'use server';
/**
 * @fileOverview An AI agent for analyzing skin conditions from images and text.
 *
 * - analyzeSkinCondition - A function that handles the skin condition analysis process.
 * - AnalyzeSkinConditionInput - The input type for the analyzeSkinCondition function.
 * - AnalyzeSkinConditionOutput - The return type for the analyzeSkinCondition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AnalyzeSkinConditionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a skin condition, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().optional().describe('Any additional description or symptoms provided by the user.'),
});
export type AnalyzeSkinConditionInput = z.infer<typeof AnalyzeSkinConditionInputSchema>;

// Output Schema
const AnalyzeSkinConditionOutputSchema = z.object({
  diseaseName: z.string().describe('The name of the potential skin disease identified.'),
  cause: z.string().describe('The likely cause(s) of the identified skin disease.'),
  treatment: z.string().describe('Recommended treatments or interventions for the skin disease.'),
  routine: z.string().describe('A daily or weekly routine to follow to manage or improve the condition.'),
  encouragement: z.string().describe('Supportive and encouraging words for the user to mitigate fear and provide reassurance.'),
});
export type AnalyzeSkinConditionOutput = z.infer<typeof AnalyzeSkinConditionOutputSchema>;

// Wrapper function to call the flow
export async function analyzeSkinCondition(input: AnalyzeSkinConditionInput): Promise<AnalyzeSkinConditionOutput> {
  return analyzeSkinConditionFlow(input);
}

// Genkit Prompt Definition
const analyzeSkinConditionPrompt = ai.definePrompt({
  name: 'analyzeSkinConditionPrompt',
  input: {schema: AnalyzeSkinConditionInputSchema},
  output: {schema: AnalyzeSkinConditionOutputSchema},
  prompt: `You are an expert dermatologist and an AI assistant named SwastyaScan. Your goal is to analyze skin conditions based on user-provided images and descriptions.
Provide a clear, concise, and helpful analysis.

Analyze the following image and description to identify the potential skin disease, its cause, suggest treatments/routines, and offer encouraging words.

Image: {{media url=photoDataUri}}
Description: {{#if description}}{{{description}}}{{else}}No additional description provided.{{/if}}

Please structure your response as a JSON object with the following fields:
- diseaseName: string (The name of the potential skin disease identified.)
- cause: string (The likely cause(s) of the identified skin disease.)
- treatment: string (Recommended treatments or interventions for the skin disease.)
- routine: string (A daily or weekly routine to follow to manage or improve the condition.)
- encouragement: string (Supportive and encouraging words for the user to mitigate fear and provide reassurance.)
`,
});

// Genkit Flow Definition
const analyzeSkinConditionFlow = ai.defineFlow(
  {
    name: 'analyzeSkinConditionFlow',
    inputSchema: AnalyzeSkinConditionInputSchema,
    outputSchema: AnalyzeSkinConditionOutputSchema,
  },
  async (input) => {
    const {output} = await analyzeSkinConditionPrompt(input);
    if (!output) {
      throw new Error('Failed to get analysis output from the model.');
    }
    return output;
  }
);
