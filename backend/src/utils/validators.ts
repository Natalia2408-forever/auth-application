const EMAIL_PATTERN = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

export const NAME_MAX_LENGTH = 50;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function validateName(value: string | undefined): string | undefined {
  const name = value?.trim();

  if (!name) {
    return 'Name is required';
  }

  if (name.length > NAME_MAX_LENGTH) {
    return `Name must be at most ${NAME_MAX_LENGTH} characters long`;
  }
}

export function validateEmail(value: string | undefined): string | undefined {
  if (!value) {
    return 'Email is required';
  }

  if (!EMAIL_PATTERN.test(value.trim())) {
    return 'Email is not valid';
  }
}

export function validatePassword(
  value: string | undefined,
): string | undefined {
  if (!value) {
    return 'Password is required';
  }

  if (value.length < 6) {
    return 'Password must be at least 6 characters long';
  }

  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return 'Password must contain at least one letter and one digit';
  }
}
