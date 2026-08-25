import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
// @ts-ignore - pdf-parse has no bundled types
import pdf from "pdf-parse/lib/pdf-parse.js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const geminiKey = process.env.GEMINI_API_KEY || "";
  const { GoogleGenAI } = await import("@google/genai");
  const genAI = new GoogleGenAI({ apiKey: geminiKey || "dummy-key" });
  if (!geminiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not set. AI features will fail until added to .env");
  }

  // ─────────────────────────────────────────────────────────────
  // /api/refine — refine a legal clause (SPA purpose or SEC
  // Secretary's Certificate resolution text) into 3 phrasing options.
  // Used by the "Contracts" module (SPA / Secretary's Certificate).
  // ─────────────────────────────────────────────────────────────
  app.post("/api/refine", async (req, res) => {
    try {
      if (!geminiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing. Please add it to your .env file." });
      }
      const { text, agency, context } = req.body;
      const isSec = agency === "SEC";

      const prompt = `Refine and paraphrase the following legal text for a ${
        isSec ? "Secretary's Certificate Board Resolution" : "Special Power of Attorney (SPA)"
      }.
The text should be formal, precise, and professional.
${isSec ? 'It should follow standard corporate legal drafting conventions (e.g. starting with "That").' : 'It MUST always start with the word "To".'}
Agency: ${agency}
${context ? `Context: ${context}` : ""}
Original Text: ${text}

Respond ONLY with valid JSON in this exact format, and nothing else:
{
  "options": [
    { "label": "Precise & Formal", "text": "..." },
    { "label": "Comprehensive Scope", "text": "..." },
    { "label": "Direct & Concise", "text": "..." }
  ]
}`;

      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" },
      });

      const output = JSON.parse(response.text || "{}");
      res.json(output);
    } catch (error: any) {
      console.error("Gemini Refine Error:", error);
      res.status(500).json({ error: error.message || "Failed to refine text" });
    }
  });

  // ─────────────────────────────────────────────────────────────
  // /api/extract — extract Secretary's Certificate resolution
  // clauses (and any accompanying tables) from an uploaded PDF/image.
  // Used by the "Contracts" module (Secretary's Certificate).
  // ─────────────────────────────────────────────────────────────
  app.post("/api/extract", async (req, res) => {
    try {
      if (!geminiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
      }
      const { headline, fileData, mimeType } = req.body;

      const prompt = `SECRETARY'S CERTIFICATE EXTRACTOR:
Your task is to find and extract ALL clauses specifically listed under the Board Resolution section titled: "${headline}".

RULES FOR EXTRACTION:
1. CONTINUITY: Merge rows and text that span across page boundaries into one continuous entry.
2. TEXT CLEANING: Strip the word "RESOLVED", "RESOLVED FURTHER", "RESOLVED FINALLY", or similar prefixes. The "text" field should contain only the main instruction.
3. TABLE PLACEMENT (CRITICAL): Only attach a "tableData" array to the specific clause that introduces it. Clauses typically introduce tables by ending with a colon ":" or the words "the following:".
4. ABSOLUTELY NO DUPLICATION: Do NOT repeat table data in multiple objects. If clause A contains a table, and clause B follows it (e.g., a "binding/effect" clause), clause B MUST have "tableData": null. Repeating the same data in multiple objects is a failure.
5. NO HALLUCINATION: If a clause does not clearly contain or introduce a table, its "tableData" field MUST be null. Never return the word "null" as a string inside an array.
6. WORDING: Keep the specific legal wording of the resolution text precisely.

SCOPE:
- Extract everything belonging to this specific agenda item until the next major heading.
- Return an empty array [] if the headline "${headline}" is not found.

FORMAT: Respond ONLY with a valid JSON array of objects.`;

      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ inlineData: { mimeType, data: fileData } }, { text: prompt }],
          },
        ],
        config: { responseMimeType: "application/json" },
      });

      const parsed = JSON.parse(response.text || "[]");
      res.json(parsed);
    } catch (error: any) {
      console.error("Gemini Extraction Error:", error);
      res.status(500).json({ error: error.message || "Failed to extract clauses" });
    }
  });

  // ─────────────────────────────────────────────────────────────
  // /api/extract-amendment — extract baseline data (incorporators,
  // partners, directors, subscribers, purposes, etc.) from an
  // uploaded Articles of Incorporation / Partnership PDF.
  // Used by the "Contracts" module (Articles of Amendment).
  // ─────────────────────────────────────────────────────────────
  app.post("/api/extract-amendment", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ detail: "No file uploaded" });
    }
    if (!geminiKey) {
      return res.status(500).json({ detail: "GEMINI_API_KEY not configured" });
    }

    try {
      const pdfData = await pdf(req.file.buffer);
      const text = pdfData.text;

      const prompt = `
You are a legal document analyzer. Extract structured JSON data from the following text of an Articles of Incorporation (AOI) or Articles of Partnership document.
Ensure the response is ONLY a JSON object and nothing else.

Fields to extract:
- name / corporateName / partnershipName: (String)
- tradeNames: (Array of Strings)
- primaryPurpose: (String)
- secondaryPurposes: (String)
- street: (String)
- barangay: (String)
- city: (String)
- province: (String)
- zip: (String)
- term: (String, '0' for perpetual)
- numberOfDirectors: (String)
- acsWords / totalCapitalWords: (String, ALL CAPS)
- acsAmount / totalCapitalAmount / acsAmountNum: (String, numbers only, strip currency symbols like P, PHP, ₱)
- numberOfShares: (String, with commas)
- parValue: (String)
- generalManager: (String)
- treasurer: (String)
- treasurerTIN: (String)
- treasurerAddress: (String)
- treasurerCitizenship: (String)
- secRegistrationNo: (String)
- dateOfRegistration: (String, YYYY-MM-DD)
- article1AmendedDate: (String, YYYY-MM-DD)
- documentAmendedDate: (String, YYYY-MM-DD)
- incorporators / partners: (Array of {name, nationality, residence})
- directors: (Array of {name, nationality, residence})
- subscribers / contributions: (Array of {name, citizenship, sharesSubscribed, amountSubscribed, amountPaid, amountContributed, amount})
- signatories: (Array of {name, role, tin})

IMPORTANT RULES FOR DATA EXTRACTION:
1. NAME RECONSTRUCTION (CRITICAL): PDF conversion often splits a single person's name across 2-4 lines. Look ahead at subsequent lines and merge continuations into one "name" string.
2. HYPHENATED NAMES: Never split a hyphenated name.
3. TABLE RECOGNITION: Merge "ghost" rows where a name spans two lines.
4. AGGRESSIVE MERGING: Prefer a slightly longer name over splitting one person into two.
5. NATIONALITY: Normalize "Filipino", "Philippine", "Philippine-Filipino" etc. to "FILIPINO".
6. ADDRESSES: Reconstruct multi-line addresses into a single string.
7. PURPOSES (VERBATIM - CRITICAL): Extract "primaryPurpose" and "secondaryPurposes" EXACTLY word-for-word, no summarizing. Split at the phrase "In pursuit of its primary purpose..." (that phrase and everything after belongs to secondaryPurposes).
8. Return an object with exactly the keys listed above (use empty string/array when unknown, never omit a key).

PDF TEXT:
${text.substring(0, 50000)}
`;

      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" },
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error: any) {
      console.error("Amendment extraction error:", error);
      res.status(500).json({ detail: error.message || "Failed to extract data" });
    }
  });

  // Dev/prod asset serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`STLAF Drafting Suite running on http://localhost:${PORT}`);
  });
}

startServer();
