import OpenAI from 'openai';
import AiUsageLog from '../models/AiUsageLog.js';
import Clinic from '../models/Clinic.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY,
});

const FALLBACK_RESPONSE = {
  possibleConditions: [
    'AI service temporarily unavailable. Please consult medical references.',
  ],
  suggestedTests: ['Complete blood count', 'Physical examination'],
  treatmentRecommendations: [
    'Seek in-person medical consultation',
    'Monitor symptoms and document changes',
  ],
  riskLevel: 'medium',
  note: 'This is a fallback response. AI analysis was unavailable.',
};

/**
 * Get AI diagnosis assistance
 */
export const getDiagnosisAssist = async (userId, clinicId, input) => {
  const { symptoms, age, gender, history } = input;

  const prompt = `As a medical AI assistant, analyze these symptoms and provide structured guidance.
Patient: ${age} years, ${gender}
Symptoms: ${symptoms}
Medical history: ${history || 'Not provided'}

Respond in JSON format only:
{
  "possibleConditions": ["condition1", "condition2"],
  "suggestedTests": ["test1", "test2"],
  "treatmentRecommendations": ["rec1", "rec2"],
  "riskLevel": "low|medium|high"
}`;

  try {
    const clinic = clinicId ? await Clinic.findById(clinicId) : null;
    if (clinic && !clinic.aiEnabled) {
      return { ...FALLBACK_RESPONSE, fallbackUsed: true };
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content || '';
    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : FALLBACK_RESPONSE;
    } catch {
      parsed = FALLBACK_RESPONSE;
    }

    await AiUsageLog.create({
      userId,
      action: 'diagnosis_assist',
      success: true,
      fallbackUsed: false,
    });

    return parsed;
  } catch (error) {
    await AiUsageLog.create({
      userId,
      action: 'diagnosis_assist',
      success: false,
      fallbackUsed: true,
    });
    return { ...FALLBACK_RESPONSE, fallbackUsed: true };
  }
};

/**
 * Generate simple language explanation of diagnosis
 */
export const getPrescriptionExplanation = async (userId, clinicId, diagnosis, medicines) => {
  const prompt = `Explain this medical information in simple, patient-friendly language (2-3 sentences):
Diagnosis: ${diagnosis}
Medicines: ${medicines?.map((m) => `${m.name} - ${m.dosage}`).join(', ') || 'None'}

Include: what the condition means, why these medicines help, and one lifestyle tip.`;

  try {
    const clinic = clinicId ? await Clinic.findById(clinicId) : null;
    if (clinic && !clinic.aiEnabled) {
      return 'AI explanations are disabled for this clinic.';
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });

    const explanation = completion.choices[0]?.message?.content || 'Explanation unavailable.';

    await AiUsageLog.create({
      userId,
      action: 'prescription_explanation',
      success: true,
      fallbackUsed: false,
    });

    return explanation;
  } catch (error) {
    await AiUsageLog.create({
      userId,
      action: 'prescription_explanation',
      success: false,
      fallbackUsed: true,
    });
    return 'We could not generate an AI explanation. Please ask your doctor for details.';
  }
};
