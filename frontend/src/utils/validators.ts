export function validateEmail(value: string): string | undefined {
  if (!value) {
    return 'Email is required';
  }

  const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  if (!emailPattern.test(value)) {
    return 'Email is not valid';
  }
}

export function validatePassword(value: string): string | undefined {
  if (!value) {
    return 'Password is required';
  }

  if (value.length < 6) {
    return 'At least 6 characters';
  }

  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return 'Password must contain at least one letter and one digit';
  }
}

export function validateLoginPassword(value: string): string | undefined {
  if (!value) {
    return 'Password is required';
  }
}

export function validateName(value: string): string | undefined {
  if (!value) {
    return 'Name is required';
  }
}

export function validatePasswordConfirmation(
  value: string,
  password: string,
): string | undefined {
  if (value !== password) {
    return 'Passwords do not match';
  }
}
