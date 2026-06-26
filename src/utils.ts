/**
 * Utility functions for Barsha Application
 */

/**
 * Parses the model's text response to separate the main conversational/educational content
 * from the structured "Barsha's Insights" follow-up questions.
 * This keeps the reading bubble clean while powering interactive clickable prompt buttons.
 */
export function parseBarshaResponse(text: string): { cleanContent: string; suggestions: string[] } {
  if (!text) return { cleanContent: '', suggestions: [] };

  const markers = [
    /Barsha's Insights:/i,
    /### Barsha's Insights/i,
    /### Insights/i,
    /Suggested Exploration:/i,
    /### Suggested Exploration/i
  ];

  let splitIndex = -1;
  let matchedMarkerLength = 0;

  for (const marker of markers) {
    const match = text.match(marker);
    if (match && match.index !== undefined) {
      splitIndex = match.index;
      matchedMarkerLength = match[0].length;
      break;
    }
  }

  if (splitIndex === -1) {
    return { cleanContent: text, suggestions: [] };
  }

  const cleanContent = text.substring(0, splitIndex).trim();
  const footerSection = text.substring(splitIndex + matchedMarkerLength).trim();

  // Extract individual bullet items from the footer section
  const lines = footerSection.split('\n');
  const suggestions: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Match lines starting with -, *, or 1., 2. etc.
    const bulletMatch = trimmed.match(/^[\-\*\d\.]+\s+(.*)$/);
    if (bulletMatch && bulletMatch[1]) {
      // Remove enclosing quotes or punctuation if present
      const cleanSuggestion = bulletMatch[1].replace(/^["']|["']$/g, '').trim();
      if (cleanSuggestion && cleanSuggestion.length > 5) {
        suggestions.push(cleanSuggestion);
      }
    } else if (trimmed.length > 10 && !trimmed.includes('---')) {
      // Fallback for non-bullet line that is substantial
      suggestions.push(trimmed.replace(/^["']|["']$/g, '').trim());
    }
  }

  // Cap at max 3 suggestions for layout elegance
  return {
    cleanContent,
    suggestions: suggestions.slice(0, 3)
  };
}
