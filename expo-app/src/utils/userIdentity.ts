export interface UserIdentity {
  fullName: string;
  firstName: string;
  lastName: string;
  initial: string;
  email: string;
  profileImageUrl: string | null;
  isAuthenticated: boolean;
}

/**
 * Single canonical identity derivation helper for the entire application.
 * Guarantees consistent name, first name, initial, avatar image, and email handling across Home, Profile, and Chat.
 */
export function deriveUserIdentity(
  fullNameInput?: string | null,
  emailInput?: string | null,
  profileImageInput?: string | null,
  isAuthenticated: boolean = true,
): UserIdentity {
  const rawFullName = (fullNameInput || '').trim();
  const rawEmail = (emailInput || '').trim();
  const profileImageUrl = profileImageInput?.trim() || null;

  let resolvedName = rawFullName;

  // If full name is omitted, derive a clean name from email prefix before '@'
  if (!resolvedName && rawEmail) {
    const prefix = rawEmail.split('@')[0];
    resolvedName = prefix.replace(/[^a-zA-Z0-9]+/g, ' ').trim();
  }

  if (!resolvedName) {
    return {
      fullName: 'User',
      firstName: 'there',
      lastName: '',
      initial: 'U',
      email: rawEmail,
      profileImageUrl,
      isAuthenticated,
    };
  }

  const words = resolvedName.split(/\s+/).filter(Boolean);
  const firstWord = words[0] || 'there';
  const lastName = words.length > 1 ? words.slice(1).join(' ') : '';

  const firstName = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
  const initial = firstWord.charAt(0).toUpperCase() || 'U';
  const fullName = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    fullName,
    firstName,
    lastName,
    initial,
    email: rawEmail,
    profileImageUrl,
    isAuthenticated,
  };
}
