# User Manual: STLAF Document Generator

Welcome to the STLAF Document Generator User Manual. This guide will help you navigate and utilize the application to generate various legal and corporate documents efficiently.

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Generating Documents](#generating-documents)
   - [Legal Proposals](#legal-proposals)
   - [Special Power of Attorney (SPA)](#special-power-of-attorney-spa)
   - [Secretary's Certificate](#secretarys-certificate)
   - [Certification of No Dispute](#certification-of-no-dispute)
4. [AI-Assisted Features](#ai-assisted-features)
5. [Exporting and Printing](#exporting-and-printing)
6. [Troubleshooting](#troubleshooting)

---

## 1. Introduction

The STLAF Document Generator is a streamlined web application designed for the Sadsad Tamesis Legal and Accountancy Firm. It automates the drafting of standard legal and corporate documents, ensuring precision, formatting consistency, and significant time savings. 

---

## 2. Getting Started

1. Open your web browser and navigate to the application URL provided by your administrator.
2. The main dashboard will present you with a selection of document types you can generate.
3. Select the document you wish to draft by clicking on the corresponding card.

---

## 3. Generating Documents

The process for generating a document generally follows two steps: **Data Entry** and **Preview/Export**.

### Legal Proposals
Used for generating phased service proposals for clients.
1. **Select** the "Legal Proposal" document type.
2. **Client Details**: Enter the client's name, address, and the proposal date.
3. **Firm Details**: Choose a logo type (Default, Upload custom, or use a custom path) and set the sign-off salutation.
4. **Service Phases**:
   - Enable or disable Phase 1, Phase 2, and Phase 3 as required by the client's needs.
   - Adjust the fees for each phase, or select "Use Custom Fee" to input non-standard amounts.
   - Add government registration fees and messengerial fees (Metro Manila or Outside Metro Manila).
5. **Discounts**: Check the "Apply Discount" box and enter a percentage if applicable.
6. **Preview**: Proceed to the preview step to review the compiled contract.

### Special Power of Attorney (SPA)
Used to grant representation rights to STLAF or specific individuals for government transactions.
1. **Select** the "Special Power of Attorney" document type.
2. **Document Format**: Choose between Legal, A4, or Letter size paper.
3. **Affiant Details**: Enter the Principal's name, nationality, civil status, address, and identification details (ID Type and ID Number).
4. **Representatives**: Choose to use the default STLAF representatives or manually enter custom representatives.
5. **Purposes**: 
   - Click "Add Purpose".
   - Select the target Government Agency (e.g., BIR, SEC, LGU).
   - Enter the specific purpose or use the AI Assist feature to refine your draft (see Section 4).
6. **Preview**: Verify all details in the document preview.

### Secretary's Certificate
Used to certify corporate resolutions, particularly regarding SEC authorizations.
1. **Select** the "Secretary's Certificate" document type.
2. **Corporate Details**: Enter the Corporation's name, address, board meeting type (e.g., Special, Regular), and the meeting date.
3. **Signatory Details**: Enter the Corporate Secretary's name, address, ID details, and their capacity (e.g., Corporate Secretary (Domestic)).
4. **Resolutions/Clauses**:
   - Manually type the resolutions, OR
   - Upload a source PDF document and enter a headline/context to use the AI extraction tool to automatically pull clauses.
5. **Preview**: Ensure the extracted or typed resolutions form a coherent certificate.

### Certification of No Dispute
A specialized SEC certification affirming the absence of intra-corporate disputes.
*(Note: As with other documents, follow the on-screen form to input the required affiant and corporate details, then preview the generated layout.)*

---

## 4. AI-Assisted Features

To streamline drafting, the application integrates AI tools:

- **Purpose Refinement (SPA)**: If you are unsure how to phrase an agency purpose, type a rough draft, click the "Sparkles" (AI) icon, and the system will suggest professionally phrased alternatives tailored to the specific agency.
- **Clause Extraction (SEC)**: When drafting a Secretary's Certificate, you can upload a reference document (PDF/Image) and provide a short prompt (e.g., "Bank account opening"). The AI will read the document and extract the relevant "RESOLVED" clauses automatically.

---

## 5. Exporting and Printing

Once you reach the **Preview** step for any document:
1. Review the document layout carefully. The preview accurately reflects how the document will appear on paper.
2. Click the **"Export to PDF / Print"** button located at the top or bottom of the preview pane.
3. Your browser's print dialog will open.
   - **Destination**: Select "Save as PDF" to generate a digital file, or select your physical printer.
   - **Paper Size**: Ensure the paper size in the print dialog matches the format you selected in the application (e.g., Legal / 8.5x13).
   - **Margins**: Set margins to "Default" or "None". The application handles internal document margins.
   - **Headers/Footers**: Uncheck "Print headers and footers" to avoid printing the browser's date/URL text.

---

## 6. Troubleshooting

- **Missing Information**: If the generated document has blank spaces (e.g., `[CLIENT NAME]`), go back to the previous step and ensure all required fields are filled out.
- **AI Extraction Fails**: Ensure the uploaded document is clear and legible. Check your internet connection. If the AI still fails, you can manually type the clauses.
- **Incorrect Pagination/Cut-offs**: If text is being cut off when printing, double-check that your browser's Print Dialog paper size exactly matches the paper size you selected within the app.
- **Application Freezing**: Refresh the page. Note that your progress might be lost, so it's recommended to have your data ready before drafting.

For further technical assistance or bug reporting, please contact the development team.
