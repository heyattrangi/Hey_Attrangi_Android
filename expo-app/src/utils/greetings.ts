export type GreetingPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export interface GreetingTemplate {
  withName: string; // e.g. "Good morning, {name}!"
  fallback: string; // e.g. "Good morning!"
}

const GREETINGS_BY_PERIOD: Record<GreetingPeriod, GreetingTemplate[]> = {
  morning: [
    { withName: 'Good morning, {name}!', fallback: 'Good morning!' },
    {
      withName: 'Morning, {name}. How are you feeling today?',
      fallback: 'Good morning! How are you feeling today?',
    },
    { withName: 'Rise and shine, {name}!', fallback: 'Rise and shine!' },
    {
      withName: 'Good morning, {name}. Take a deep breath.',
      fallback: 'Good morning. Take a deep breath.',
    },
    { withName: 'A fresh new morning, {name}!', fallback: 'A fresh new morning!' },
    {
      withName: "Morning, {name}! Let's take it one step at a time today.",
      fallback: "Good morning! Let's take it one step at a time today.",
    },
    {
      withName: 'Good morning, {name}. Wishing you clarity and calm today.',
      fallback: 'Good morning. Wishing you clarity and calm today.',
    },
    {
      withName: "Hey {name}, good morning! Glad you're here.",
      fallback: "Good morning! Glad you're here.",
    },
    { withName: 'Hello, {name}! Bright morning ahead.', fallback: 'Hello! Bright morning ahead.' },
    {
      withName: 'Wishing you a good morning, {name}.',
      fallback: 'Wishing you a good morning.',
    },
    { withName: 'A fresh start today, {name}.', fallback: 'A fresh start today.' },
    {
      withName: "Here's to a peaceful morning, {name}.",
      fallback: "Here's to a peaceful morning.",
    },
    {
      withName: 'Hope your morning is going well, {name}.',
      fallback: 'Hope your morning is going well.',
    },
  ],
  afternoon: [
    { withName: 'Good afternoon, {name}!', fallback: 'Good afternoon!' },
    {
      withName: 'Hey {name}, hope your afternoon is going smoothly.',
      fallback: 'Hope your afternoon is going smoothly.',
    },
    {
      withName: 'Good afternoon, {name}. Remember to take a quick pause.',
      fallback: 'Good afternoon. Remember to take a quick pause.',
    },
    {
      withName: 'Hello, {name}! How are you holding up today?',
      fallback: 'Hello! How are you holding up today?',
    },
    {
      withName: 'Good afternoon, {name}! Stay hydrated and mindful.',
      fallback: 'Good afternoon! Stay hydrated and mindful.',
    },
    {
      withName: 'Hey {name}, halfway through the day!',
      fallback: 'Hello! Halfway through the day.',
    },
    {
      withName: 'Good afternoon, {name}. Be gentle with yourself today.',
      fallback: 'Good afternoon. Be gentle with yourself today.',
    },
    {
      withName: 'Hello {name}, taking a moment for yourself?',
      fallback: 'Hello, taking a moment for yourself?',
    },
    {
      withName: 'Good afternoon, {name}! Keep up the steady pace.',
      fallback: 'Good afternoon! Keep up the steady pace.',
    },
    {
      withName: "How's your afternoon going, {name}?",
      fallback: "How's your afternoon going?",
    },
    {
      withName: "Hope you're having a good afternoon, {name}.",
      fallback: "Hope you're having a good afternoon.",
    },
    {
      withName: 'A good afternoon to you, {name}.',
      fallback: 'A good afternoon to you.',
    },
    {
      withName: 'Wishing you a peaceful afternoon, {name}.',
      fallback: 'Wishing you a peaceful afternoon.',
    },
  ],
  evening: [
    { withName: 'Good evening, {name}!', fallback: 'Good evening!' },
    {
      withName: 'Hey {name}, good evening! Time to relax.',
      fallback: 'Good evening! Time to relax.',
    },
    {
      withName: 'Good evening, {name}. How was your day?',
      fallback: 'Good evening. How was your day?',
    },
    {
      withName: 'Evening, {name}! Hope you had a fulfilling day.',
      fallback: 'Good evening! Hope you had a fulfilling day.',
    },
    {
      withName: "Good evening, {name}. Let go of today's stress.",
      fallback: "Good evening. Let go of today's stress.",
    },
    {
      withName: "Hey {name}, evening's here. Time for a peaceful pause.",
      fallback: 'Good evening. Time for a peaceful pause.',
    },
    {
      withName: 'Good evening, {name}. Rest your thoughts.',
      fallback: 'Good evening. Rest your thoughts.',
    },
    {
      withName: 'Hope your evening is going well, {name}.',
      fallback: 'Hope your evening is going well.',
    },
    {
      withName: "How's your evening going, {name}?",
      fallback: "How's your evening going?",
    },
    {
      withName: 'Wishing you a lovely evening, {name}.',
      fallback: 'Wishing you a lovely evening.',
    },
    {
      withName: "Hope you're having a good evening, {name}.",
      fallback: "Hope you're having a good evening.",
    },
    {
      withName: 'Evening, {name}. Unwind and take it easy.',
      fallback: 'Good evening. Unwind and take it easy.',
    },
    {
      withName: 'Good evening, {name}. You did great today.',
      fallback: 'Good evening. You did great today.',
    },
  ],
  night: [
    { withName: 'Good night, {name}!', fallback: 'Good night!' },
    {
      withName: 'Still up, {name}? Take it easy tonight.',
      fallback: 'Still up? Take it easy tonight.',
    },
    {
      withName: 'Late night, {name}? Time to rest your mind.',
      fallback: 'Late night? Time to rest your mind.',
    },
    {
      withName: 'Good night, {name}. Sleep peacefully.',
      fallback: 'Good night. Sleep peacefully.',
    },
    { withName: 'Hey {name}, rest easy tonight.', fallback: 'Rest easy tonight.' },
    {
      withName: 'Quiet hours, {name}. Wishing you deep rest.',
      fallback: 'Quiet hours. Wishing you deep rest.',
    },
    {
      withName: 'Good night, {name}. Tomorrow is a fresh page.',
      fallback: 'Good night. Tomorrow is a fresh page.',
    },
    {
      withName: 'Late evening, {name}. Disconnect and unwind.',
      fallback: 'Late evening. Disconnect and unwind.',
    },
    {
      withName: 'Have a restful night, {name}.',
      fallback: 'Have a restful night.',
    },
    {
      withName: 'Winding down for the day, {name}?',
      fallback: 'Winding down for the day?',
    },
    {
      withName: 'Hope you have a peaceful night, {name}.',
      fallback: 'Hope you have a peaceful night.',
    },
    { withName: 'Rest well, {name}.', fallback: 'Rest well.' },
    { withName: 'Take it easy tonight, {name}.', fallback: 'Take it easy tonight.' },
  ],
};

/**
 * Determine period based on local device hour:
 * - MORNING: 05:00 - 11:59
 * - AFTERNOON: 12:00 - 16:59
 * - EVENING: 17:00 - 20:59
 * - NIGHT: 21:00 - 04:59 (handles midnight rollover)
 */
export function getGreetingPeriod(date: Date = new Date()): GreetingPeriod {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

let lastSelectedIndexes: Record<GreetingPeriod, number> = {
  morning: -1,
  afternoon: -1,
  evening: -1,
  night: -1,
};

/**
 * Generates a dynamic, English-only greeting for the user based on time of day and user name.
 * Bans "Patient", "PATIENT", or non-English words from ever appearing.
 */
export function getRandomGreeting(
  period: GreetingPeriod,
  nameInput?: string | null,
): string {
  const templates = GREETINGS_BY_PERIOD[period];

  // Pick an index different from last selection if possible
  let index = Math.floor(Math.random() * templates.length);
  if (templates.length > 1 && index === lastSelectedIndexes[period]) {
    index = (index + 1) % templates.length;
  }
  lastSelectedIndexes[period] = index;

  const selected = templates[index];

  const rawName = (nameInput || '').trim();
  const lowerName = rawName.toLowerCase();

  // Strict check: if name is empty or is literal "patient"/"user", use the clean English fallback!
  const isInvalidName = !rawName || lowerName === 'patient' || lowerName === 'user';

  if (isInvalidName) {
    return selected.fallback;
  }

  // Capitalize first letter if needed
  const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  return selected.withName.replace('{name}', formattedName);
}
