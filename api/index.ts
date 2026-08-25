import express from "express";
import multer from "multer";
// @ts-ignore - pdf-parse has no bundled types
import pdf from "pdf-parse/lib/pdf-parse.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

const geminiApiKey = process.env.GEMINI_API_KEY || "";

async function getGenAI() {
  const { GoogleGenAI } = await import("@google/genai");
  return new GoogleGenAI({ apiKey: geminiApiKey || "dummy-key" });
}

// See server.ts for full inline documentation of each endpoint's behavior;
// kept in sync here for Vercel's serverless deployment target.

app.post("/api/refine", async (req, res) => {
  try {
    if (!geminiApiKey) return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
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
    const genAI = await getGenAI();
    const response = await genAI.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" },
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Gemini Refine Error:", error);
    res.status(500).json({ error: error.message || "Failed to refine text" });
  }
});

app.post("/api/extract", async (req, res) => {
  try {
    if (!geminiApiKey) return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
    const { headline, fileData, mimeType } = req.body;
    const prompt = `SECRETARY'S CERTIFICATE EXTRACTOR:
Your task is to find and extract ALL clauses specifically listed under the Board Resolution section titled: "${headline}".

RULES FOR EXTRACTION:
1. CONTINUITY: Merge rows and text that span across page boundaries into one continuous entry.
2. TEXT CLEANING: Strip the word "RESOLVED", "RESOLVED FURTHER", "RESOLVED FINALLY", or similar prefixes. The "text" field should contain only the main instruction.
3. TABLE PLACEMENT (CRITICAL): Only attach a "tableData" array to the specific clause that introduces it.
4. ABSOLUTELY NO DUPLICATION: Do NOT repeat table data in multiple objects.
5. NO HALLUCINATION: If a clause does not clearly contain or introduce a table, its "tableData" field MUST be null.
6. WORDING: Keep the specific legal wording of the resolution text precisely.

SCOPE: Extract everything belonging to this specific agenda item until the next major heading. Return an empty array [] if the headline "${headline}" is not found.

FORMAT: Respond ONLY with a valid JSON array of objects.`;
    const genAI = await getGenAI();
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: "user", parts: [{ inlineData: { mimeType, data: fileData } }, { text: prompt }] },
      ],
      config: { responseMimeType: "application/json" },
    });
    res.json(JSON.parse(response.text || "[]"));
  } catch (error: any) {
    console.error("Gemini Extraction Error:", error);
    res.status(500).json({ error: error.message || "Failed to extract clauses" });
  }
});

app.post("/api/extract-amendment", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ detail: "No file uploaded" });
  if (!geminiApiKey) return res.status(500).json({ detail: "GEMINI_API_KEY not configured" });
  try {
    const pdfData = await pdf(req.file.buffer);
    const text = pdfData.text;
    const prompt = `You are a legal document analyzer. Extract structured JSON data from the following text of an Articles of Incorporation (AOI) or Articles of Partnership document. Respond ONLY with a JSON object.

Fields: name/corporateName/partnershipName, tradeNames[], primaryPurpose, secondaryPurposes, street, barangay, city, province, zip, term, numberOfDirectors, acsWords/totalCapitalWords, acsAmount/totalCapitalAmount/acsAmountNum, numberOfShares, parValue, generalManager, treasurer, treasurerTIN, treasurerAddress, treasurerCitizenship, secRegistrationNo, dateOfRegistration, article1AmendedDate, documentAmendedDate, incorporators/partners[{name,nationality,residence}], directors[{name,nationality,residence}], subscribers/contributions[{name,citizenship,sharesSubscribed,amountSubscribed,amountPaid,amountContributed,amount}], signatories[{name,role,tin}].

Merge names split across lines, never split hyphenated names, normalize nationality to FILIPINO where applicable, reconstruct multi-line addresses, and extract primaryPurpose/secondaryPurposes verbatim (split at "In pursuit of its primary purpose...").

PDF TEXT:
${text.substring(0, 50000)}`;
    const genAI = await getGenAI();
    const response = await genAI.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" },
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Amendment extraction error:", error);
    res.status(500).json({ detail: error.message || "Failed to extract data" });
  }
});

export default app;
