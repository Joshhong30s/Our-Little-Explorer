// src/mcp/protocols/search/semanticSearch.ts
import { Photo } from '@/types/photos';
import { generateCompletion } from '@/mcp/models/openai';

export interface SearchResult {
  photos: Photo[];
  error?: string;
}

export async function semanticSearch(
  query: string,
  allPhotos: Photo[]
): Promise<SearchResult> {
  try {
    // Create a search prompt
    const searchPrompt = `
You are helping match photos based on user search intent. Given these photos:

${allPhotos
  .map(
    (photo, index) => `Photo ${index + 1}:
- Name: ${photo.name}
- Location: ${photo.location}
- Description: ${photo.instructions}
- Baby's age: ${photo.growingTime}
`
  )
  .join('\n')}

For the search query: "${query}"

Return the indexes of the most relevant photos as a JSON array, e.g. [1, 4, 7].
Consider semantic meaning, not just exact keyword matches. Return up to 5 results.
`;

    // Get completion
    const completion = await generateCompletion({
      prompt: searchPrompt,
      maxTokens: 100,
      temperature: 0.3,
    });

    // Parse result
    try {
      const indexMatch = completion.text.match(/\[(.*?)\]/);
      if (indexMatch) {
        const indexes = JSON.parse(indexMatch[0])
          .map((i: number) => i - 1) // Convert from 1-based to 0-based indexing
          .filter((i: number) => i >= 0 && i < allPhotos.length); // Validate indexes

        const resultPhotos = indexes.map((i: number) => allPhotos[i]);
        return { photos: resultPhotos };
      }
    } catch (parseError) {
      console.error('Error parsing search results:', parseError);
    }

    // Fallback to simple keyword search if parsing fails
    const matchingPhotos = allPhotos
      .filter(photo => {
        const searchableText =
          `${photo.name} ${photo.location} ${photo.instructions}`.toLowerCase();
        return query
          .toLowerCase()
          .split(' ')
          .some(term => searchableText.includes(term));
      })
      .slice(0, 5);

    return { photos: matchingPhotos };
  } catch (error) {
    console.error('Error performing semantic search:', error);
    return {
      photos: [],
      error: 'Failed to perform search',
    };
  }
}
