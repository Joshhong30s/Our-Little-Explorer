// src/mcp/contexts/photo/photoContext.ts
import { Photo } from '@/types/photos';
import dayjs from 'dayjs';

export interface PhotoPromptContext {
  name: string;
  location: string;
  babyAge: string;
  details: string;
}

export function createPhotoPromptContext(photo: Photo): PhotoPromptContext {
  // Calculate age based on growingTime
  const babyBirthday = dayjs('2023-04-12T00:00:00+08:00');

  let babyAge: string;
  if (typeof photo.growingTime === 'number') {
    const diffYears = Math.floor(photo.growingTime / 12);
    const diffMonths = Math.floor(photo.growingTime % 12);
    babyAge = `${diffYears} years and ${diffMonths} months`;
  } else {
    const date = dayjs(photo.growingTime);
    const diffYears = date.diff(babyBirthday, 'year');
    const diffMonths = date.diff(babyBirthday.add(diffYears, 'year'), 'month');
    babyAge = `${diffYears} years and ${diffMonths} months`;
  }

  return {
    name: photo.name,
    location: photo.location,
    babyAge,
    details: photo.instructions,
  };
}

export function createCaptionPrompt(context: PhotoPromptContext): string {
  return `Generate a caption for a baby photo with the following details:
- Baby name: ${context.name}
- Location: ${context.location}
- Baby's age: ${context.babyAge}
- Additional details: ${context.details}

Create a heartwarming, engaging caption that highlights the baby's milestone at this age. Keep it under 100 characters.`;
}

export function createTagSuggestionPrompt(context: PhotoPromptContext): string {
  return `Based on a baby photo with these details:
- Baby name: ${context.name}
- Location: ${context.location}
- Baby's age: ${context.babyAge}
- Additional details: ${context.details}

Generate 5 hashtags that would be appropriate for social media posting. Format them as a JSON array.`;
}

export function parseTags(aiResponse: string): string[] {
  try {
    // Try to extract JSON array from the response
    const match = aiResponse.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }

    // Fallback: split by commas or hashtags
    return aiResponse
      .split(/[,#]/)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  } catch (error) {
    console.error('Failed to parse tags:', error);
    return [];
  }
}
