// src/mcp/models/openai/index.ts
import { OpenAI } from 'openai';

// Configuration and initialization
const apiKey = process.env.AI_API_KEY;
const openai = new OpenAI({ apiKey });

export interface CompletionRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface CompletionResponse {
  text: string;
  finishReason: string;
}

export async function generateCompletion(
  request: CompletionRequest
): Promise<CompletionResponse> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: request.prompt,
        },
      ],
      max_tokens: request.maxTokens || 150,
      temperature: request.temperature || 0.7,
    });

    return {
      text: completion.choices[0].message.content || '',
      finishReason: completion.choices[0].finish_reason || '',
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate completion');
  }
}

// Add more OpenAI model methods as needed
