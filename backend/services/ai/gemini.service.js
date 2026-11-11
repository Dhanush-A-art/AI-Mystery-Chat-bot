/**
 * Gemini AI Service Layer
 * Interfaces with Google Gemini API to produce structured JSON responses
 */

const getApiKey = () => process.env.GEMINI_API_KEY || '';
const getModelName = () => process.env.GEMINI_MODEL || 'gemini-1.5-flash';

/**
 * Generate structured JSON content using Gemini API
 * @param {string} systemPrompt 
 * @param {string} userPrompt 
 * @returns {Promise<any>} Parsed JSON object
 */
const generateJSON = async (systemPrompt, userPrompt) => {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('MISSING_API_KEY');
  }

  const model = getModelName();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${systemPrompt}\n\nIMPORTANT: You must output ONLY valid, parseable JSON matching the requested schema. Do not wrap in markdown quotes if possible, or use standard \`\`\`json markdown.` },
          { text: userPrompt }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      responseMimeType: "application/json"
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error [${response.status}]: ${errorText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

  // Sanitize potential markdown code fences
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[Gemini JSON Parse Error] Raw text was:', rawText);
    throw new Error(`Failed to parse AI response as JSON: ${err.message}`);
  }
};

/**
 * Generate plain text response (e.g. for detective assistant hints)
 */
const generateText = async (systemPrompt, userPrompt) => {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('MISSING_API_KEY');
  }

  const model = getModelName();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: systemPrompt },
          { text: userPrompt }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 500
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error [${response.status}]: ${errorText}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
};

module.exports = {
  generateJSON,
  generateText
};

