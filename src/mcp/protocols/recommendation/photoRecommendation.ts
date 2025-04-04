// src/mcp/protocols/recommendation/photoRecommendation.ts
import { Photo } from '@/types/photos';
import { generateCompletion } from '@/mcp/models/openai';
import {
  createPhotoPromptContext,
  createTagSuggestionPrompt,
  parseTags,
} from '@/mcp/contexts/photo/photoContext';

export interface PhotoRecommendationResult {
  suggestedTags: string[];
  relatedPhotos: Photo[];
  error?: string;
}

export async function generatePhotoRecommendations(
  photo: Photo,
  allPhotos: Photo[]
): Promise<PhotoRecommendationResult> {
  try {
    // Create context for the AI
    const context = createPhotoPromptContext(photo);

    // Generate prompt for tag suggestions
    const prompt = createTagSuggestionPrompt(context);

    // Get completion from the model
    const completion = await generateCompletion({
      prompt,
      maxTokens: 150,
      temperature: 0.7,
    });

    // Parse the tags from the AI response
    const suggestedTags = parseTags(completion.text);

    // Find related photos based on simple matching algorithm
    // This could be enhanced with more sophisticated AI-based matching
    const relatedPhotos = findRelatedPhotos(photo, allPhotos, suggestedTags);

    return {
      suggestedTags,
      relatedPhotos,
    };
  } catch (error) {
    console.error('Error generating photo recommendations:', error);
    return {
      suggestedTags: [],
      relatedPhotos: [],
      error: 'Failed to generate recommendations',
    };
  }
}

function findRelatedPhotos(
  currentPhoto: Photo,
  allPhotos: Photo[],
  tags: string[]
): Photo[] {
  // Simple algorithm to find related photos
  // This could be replaced with more sophisticated matching using embeddings

  const relatedPhotos = allPhotos
    .filter(p => p._id !== currentPhoto._id) // Exclude current photo
    .map(photo => {
      // Calculate a simple score based on text similarity
      let score = 0;

      // Check for matching location
      if (photo.location === currentPhoto.location) {
        score += 3;
      }

      // Check for similar age
      const currentAge =
        typeof currentPhoto.growingTime === 'number'
          ? currentPhoto.growingTime
          : 0;
      const photoAge =
        typeof photo.growingTime === 'number' ? photo.growingTime : 0;

      // If ages are within 3 months
      if (Math.abs(currentAge - photoAge) <= 3) {
        score += 2;
      }

      // Check for tag matches in instructions
      tags.forEach(tag => {
        const normalizedTag = tag.replace('#', '').toLowerCase();
        if (photo.instructions.toLowerCase().includes(normalizedTag)) {
          score += 1;
        }
      });

      return { photo, score };
    })
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, 5) // Take top 5
    .map(item => item.photo);

  return relatedPhotos;
}
