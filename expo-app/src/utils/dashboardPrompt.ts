/**
 * Dashboard Prompt Generator & Crisis Text Sanitizer
 * Replicates Web source of truth (CenterColumn.tsx) 1:1.
 */

export function sanitizeCrisisContent(content: string): string {
  if (!content || typeof content !== 'string') return '';
  const isCrisis =
    content.includes('988') ||
    content.includes('International Helplines') ||
    content.toLowerCase().includes('emergency services') ||
    content.toLowerCase().includes('trusted person') ||
    content.toLowerCase().includes('suicide hotline');

  if (isCrisis) {
    return content.split('**International Helplines:**')[0].trim();
  }
  return content;
}

export function generateDashboardPrompt(responseText: string): string {
  if (!responseText) return 'Would you like to continue where we left off?';

  const text = responseText.trim();

  const questions = text.match(/[^.!?]+\?/g);
  if (questions && questions.length > 0) {
    const lastQuestion = questions[questions.length - 1].trim();
    if (lastQuestion.length > 12 && lastQuestion.length < 120) {
      return lastQuestion.charAt(0).toUpperCase() + lastQuestion.slice(1);
    }
  }

  const patterns = [
    { regex: /feeling\s+([a-z\s]+?)(?:[.?!,:]|\s+and|\s+but|\s+because)/i, prefix: 'feeling' },
    { regex: /struggling\s+(?:to|with)\s+([a-z\s]+?)(?:[.?!,:]|\s+and|\s+but|\s+because)/i, prefix: 'your struggles with' },
    { regex: /sounds\s+like\s+you(?:'re| are)\s+([a-z\s]+?)(?:[.?!,:]|\s+and|\s+but|\s+because)/i, prefix: 'being' },
    { regex: /dealing\s+with\s+([a-z\s]+?)(?:[.?!,:]|\s+and|\s+but|\s+because)/i, prefix: 'dealing with' },
  ];

  for (const { regex, prefix } of patterns) {
    const match = text.match(regex);
    if (match && match[1]) {
      const topic = match[1].trim().split(/\s+/).slice(0, 5).join(' ');
      if (topic.length > 3) {
        return `Would you like to continue talking about ${prefix} ${topic}?`;
      }
    }
  }

  return 'Would you like to continue where we left off?';
}
