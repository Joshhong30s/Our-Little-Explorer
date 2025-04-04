// src/mcp/protocols/content/captionGeneration.ts
import { Photo } from '@/types/photos';
import { generateCompletion } from '@/mcp/models/openai';
import {
  createPhotoPromptContext,
  createCaptionPrompt,
} from '@/mcp/contexts/photo/photoContext';

export interface CaptionGenerationResult {
  caption: string;
  error?: string;
}

export async function generatePhotoCaption(
  photo: Photo
): Promise<CaptionGenerationResult> {
  try {
    // Create context for the AI
    const context = createPhotoPromptContext(photo);

    // Generate prompt for caption
    const prompt = createCaptionPrompt(context);

    // Get completion from the model
    const completion = await generateCompletion({
      prompt,
      maxTokens: 100,
      temperature: 0.7,
    });

    // Clean up the caption response
    const caption = completion.text.trim().replace(/^["']|["']$/g, ''); // Remove quotes if present

    return { caption };
  } catch (error) {
    console.error('Error generating photo caption:', error);
    return {
      caption: '',
      error: 'Failed to generate caption',
    };
  }
}
