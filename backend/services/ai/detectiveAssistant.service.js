const { generateText } = require('./gemini.service');

/**
 * AI Detective Assistant Service
 * Provides tiered hints strictly isolated from the private solution vault.
 */
const getDetectiveHint = async ({
  caseOverview,
  suspects,
  evidence,
  question,
  hintLevel // 'gentle' | 'evidence_based' | 'strong'
}) => {
  // Guard against leakage: filter only public info
  const publicSuspects = suspects.map(s => ({
    name: s.name,
    occupation: s.occupation,
    alibi: s.alibi,
    publicInfo: s.publicInfo
  }));

  const publicEvidence = evidence.map(e => ({
    evidenceId: e.evidenceId,
    type: e.type,
    title: e.title,
    description: e.description,
    timestamp: e.timestamp,
    location: e.location
  }));

  const hintInstructions = {
    gentle: "Provide a subtle, atmospheric observation that points the investigator toward looking closely at timelines or contradictions without naming any specific evidence directly.",
    evidence_based: "Point out 1 or 2 specific pieces of evidence from the public evidence list that appear inconsistent or warrant closer inspection, without giving away who is guilty.",
    strong: "Highlight the specific physical or technical discrepancies found between the suspects' alibis and the recovered evidence records, guiding the investigator toward the logical deduction."
  };

  const sysPrompt = `You are a Senior Detective Mentor in a high-stakes investigation room.
Your goal is to guide the junior detective to solve the crime through their own critical thinking.
IMPORTANT RESTRICTIONS:
1. You only know the public information provided below.
2. DO NOT state who the culprit is.
3. DO NOT fabricate evidence that does not exist in the list.
4. Level of hint requested: ${hintLevel.toUpperCase()}.
5. Rule: ${hintInstructions[hintLevel] || hintInstructions.gentle}`;

  const userPrompt = `Case: ${caseOverview.title} (${caseOverview.category})
Incident Details: ${caseOverview.scenario}

Suspects Available:
${JSON.stringify(publicSuspects, null, 2)}

Evidence Catalog:
${JSON.stringify(publicEvidence, null, 2)}

Investigator's inquiry: "${question || 'What should I focus on next?'}"`;

  try {
    const response = await generateText(sysPrompt, userPrompt);
    return response;
  } catch (error) {
    // Contextual fallback response if Gemini is offline
    if (hintLevel === 'gentle') {
      return "Notice the discrepancy in the timeline between when the cameras went offline and when everyone claimed they departed. An alibi is only as good as the clocks that verify it.";
    } else if (hintLevel === 'evidence_based') {
      return "Examine the technical equipment noted in the CCTV footage and check whether any suspect had access or recent purchases matching that specific gear.";
    } else {
      return "Review the chat logs recovered near the elevator alongside the maintenance receipts. Notice how the bypass of the display pedestal required technical knowledge of the alarm circuitry—who on the suspect roster actually handles that hardware daily?";
    }
  }
};

module.exports = {
  getDetectiveHint
};

