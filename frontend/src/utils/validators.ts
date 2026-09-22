import type { FormikErrors } from 'formik';

export const NAME_MAX_LENGTH = 50;
export const PASSWORD_MIN_LENGTH = 6;

const EMAIL_PATTERN = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

export interface RegistrationValues {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export function validateName(value: string): string | undefined {
  const name = value.trim();

  if (!name) {
    return 'Name is required';
  }

  if (name.length > NAME_MAX_LENGTH) {
    return `Name must be at most ${NAME_MAX_LENGTH} characters long`;
  }
}

export function validateEmail(value: string): string | undefined {
  if (!value) {
    return 'Email is required';
  }

  if (!EMAIL_PATTERN.test(value.trim())) {
    return 'Email is not valid';
  }
}

export function validatePassword(value: string): string | undefined {
  if (!value) {
    return 'Password is required';
  }

  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`;
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

export function validatePasswordConfirmation(
  value: string,
  password: string,
): string | undefined {
  if (value !== password) {
    return 'Passwords do not match';
  }
}

export function validateRegistration(
  values: RegistrationValues,
): FormikErrors<RegistrationValues> {
  const errors: FormikErrors<RegistrationValues> = {
    name: validateName(values.name),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    passwordConfirmation: validatePasswordConfirmation(
      values.passwordConfirmation,
      values.password,
    ),
  };

  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => message),
  );
}
