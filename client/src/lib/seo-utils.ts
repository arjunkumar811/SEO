export function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function calculateSEOScore(
  titleLength: number,
  descriptionLength: number,
  ogTagsCount: number,
  twitterTagsCount: number
): number {
  let score = 0;
  
  // Title scoring (25 points)
  if (titleLength >= 30 && titleLength <= 60) {
    score += 25;
  } else if (titleLength > 0) {
    score += 15;
  }
  
  // Description scoring (25 points)
  if (descriptionLength >= 120 && descriptionLength <= 160) {
    score += 25;
  } else if (descriptionLength > 0) {
    score += 15;
  }
  
  // Open Graph scoring (25 points)
  if (ogTagsCount >= 4) {
    score += 25;
  } else if (ogTagsCount >= 2) {
    score += 15;
  } else if (ogTagsCount > 0) {
    score += 10;
  }
  
  // Twitter Cards scoring (25 points)
  if (twitterTagsCount >= 3) {
    score += 25;
  } else if (twitterTagsCount >= 1) {
    score += 15;
  }
  
  return Math.min(score, 100);
}
