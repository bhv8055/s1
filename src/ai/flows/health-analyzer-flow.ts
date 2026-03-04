'use server';
/**
 * @fileOverview A general health analysis AI agent.
 *
 * - analyzeHealth - A function that handles the health analysis process.
 * - HealthAnalysisInput - The input type for the analyzeHealth function.
 * - HealthAnalysisOutput - The return type for the analyzeHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthAnalysisInputSchema = z.object({
  prompt: z.string().describe("The user's query about their health symptoms."),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo of a condition, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type HealthAnalysisInput = z.infer<typeof HealthAnalysisInputSchema>;

const HealthAnalysisOutputSchema = z.object({
    diseaseName: z.string().describe('The name of the potential condition.'),
    cause: z
        .string()
        .describe('The likely cause(s) or contributing factors of the condition.'),
    treatment: z
        .string()
        .describe('Recommended medicines or treatment approaches.'),
    routine: z
        .string()
        .describe('A daily routine or lifestyle changes to be followed.'),
    encouragement: z
        .string()
        .describe(
        'Supportive and encouraging words to reassure the user and reduce fear.'
        ),
});
export type HealthAnalysisOutput = z.infer<typeof HealthAnalysisOutputSchema>;

export async function analyzeHealth(
  input: HealthAnalysisInput
): Promise<HealthAnalysisOutput> {
  return healthAnalyzerFlow(input);
}

const healthAnalyzerPrompt = ai.definePrompt({
  name: 'healthAnalyzerPrompt',
  input: {schema: HealthAnalysisInputSchema},
  output: {schema: HealthAnalysisOutputSchema},
  prompt: `You are an AI medical assistant named SwastyaScan. Your goal is to analyze health conditions based on user-provided text descriptions and optional images.

If an image is provided, prioritize its analysis for visible conditions (like skin issues). If no image is provided, rely on the text description to analyze symptoms (like heart-related issues).

Based on the user's provided information, provide a comprehensive assessment. Your output must be a JSON object and include the following:
1.  The potential name of the disease/condition.
2.  The likely cause(s) of this condition.
3.  Recommended medicines or treatment approaches.
4.  A routine or lifestyle changes that the user should follow.
5.  Encouraging words to help the user cope with the diagnosis and not feel scared.

User's Prompt: {{{prompt}}}
{{#if photoDataUri}}
Image: {{media url=photoDataUri}}
{{/if}}
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const healthAnalyzerFlow = ai.defineFlow(
  {
    name: 'healthAnalyzerFlow',
    inputSchema: HealthAnalysisInputSchema,
    outputSchema: HealthAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await healthAnalyzerPrompt(input);
    return output!;
  }
);
