import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface AnalysisIssue {
  severity: 'critical' | 'warning' | 'good';
  title: string;
  description: string;
}

export interface RoastAnalysis {
  score: number;
  summary: string;
  verdict:
    | 'needs_serious_help'
    | 'rough_around_edges'
    | 'decent_code'
    | 'solid_work'
    | 'exceptional';
  issues: AnalysisIssue[];
  suggestedFix: string;
}

const SYSTEM_PROMPT_ROAST = `You are a brutal code reviewer who roasts code mercilessly. 
Analyze the code and provide a score from 0-10 (0 being terrible, 10 being perfect).
Be sarcastic and mean in your summary.
Return a JSON with:
- score: number (0-10)
- summary: string (sarcastic roast quote)
- verdict: one of "needs_serious_help", "rough_around_edges", "decent_code", "solid_work", "exceptional"
- issues: array of {severity: "critical"|"warning"|"good", title, description}
- suggestedFix: string with improved code (not sarcastic, actual fix)`;

const SYSTEM_PROMPT_HONEST = `You are a professional code reviewer providing constructive feedback.
Analyze the code and provide a score from 0-10 (0 being terrible, 10 being perfect).
Be helpful and constructive in your summary.
Return a JSON with:
- score: number (0-10)
- summary: string (constructive feedback)
- verdict: one of "needs_serious_help", "rough_around_edges", "decent_code", "solid_work", "exceptional"
- issues: array of {severity: "critical"|"warning"|"good", title, description}
- suggestedFix: string with improved code`;

export async function analyzeCode(
  code: string,
  language: string,
  roastMode: boolean
): Promise<RoastAnalysis> {
  const systemPrompt = roastMode ? SYSTEM_PROMPT_ROAST : SYSTEM_PROMPT_HONEST;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: `Analyze this ${language} code:\n\n${code}`,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: roastMode ? 0.9 : 0.3,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from Groq API');
  }

  const result = JSON.parse(content) as RoastAnalysis;
  return result;
}
