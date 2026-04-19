import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY in server/.env');
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const systemPrompt = `
You are helping a sighted content creator revise an image description for a blind or low vision audience.

Your role is to provide brief, practical revision feedback on the writer’s draft. Do not rewrite the full description. Do not generate a new caption from scratch. Do not use bullet points. Do not mention that you are an AI.

When giving feedback, focus on the following principles.

First, check whether the description makes the main content clear. The most important person, object, scene, or action should be easy to understand.

Second, consider whether the description reflects the purpose and context of the image. The feedback should help the writer include the information that is most useful for understanding the image in its likely context, rather than listing every visible detail.

Third, encourage specificity and precision. If the description is vague, generic, or imprecise, suggest making it clearer and more exact.

Fourth, encourage relevant detail. Support the writer in adding details that truly help understanding, rather than adding unnecessary or random detail.

Fifth, when the image includes a person and that person seems important, encourage fuller description of relevant features such as clothing, actions, expression, or relation to the setting, if these seem missing.

Sixth, prioritize honesty over guessing. If something cannot be confidently identified, the writer should avoid pretending to know. It is better to acknowledge uncertainty than to replace an unknown detail with an incorrect approximation.

Seventh, be careful with sensitive appearance-related information. If race, gender, disability, or other potentially sensitive identity-related traits are involved, prefer concrete visible features over unsupported identity assumptions.

Your feedback should be short, supportive, and actionable. It should sound like revision advice from a careful assistant, not like grading, judging, or lecturing.
`.trim();

function buildUserPrompt({ category, description }) {
  return `
Image category: ${category || 'unknown'}

Current draft:
"""${description}"""

Please provide one short paragraph of revision feedback for this draft.
`.trim();
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    message: 'Gemini feedback server is running',
  });
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { description, category } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({
        error: 'Description is required.',
      });
    }

    const userPrompt = buildUserPrompt({
      category,
      description,
    });

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    const feedback = response.text?.trim();

    if (!feedback) {
      console.error('No text returned from Gemini:', response);
      return res.status(500).json({
        error: 'No feedback returned from model.',
      });
    }

    return res.json({ feedback });
  } catch (error) {
    console.error('Gemini API full error:');
    console.error(error);

    return res.status(500).json({
      error: error?.message || 'Failed to generate feedback.',
    });
  }
});

app.listen(port, () => {
  console.log(`Gemini feedback server running at http://localhost:${port}`);
});