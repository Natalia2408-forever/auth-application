const EMAIL_PATTERN = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

export function validateEmail(value) {
  if (!value) {
    return 'Email is required';
  }

  if (!EMAIL_PATTERN.test(value)) {
    return 'Email is not valid';
  }
}

export function validatePassword(value) {
  if (!value) {
    return 'Password is required';
  }
  if (value.length < 6) {
    return 'At least 6 characters';
  }
}

export function validateName(value) {
  if (!value) {
    return 'Name is required';
  }
}

export function validatePasswordConfirmation(value, password) {
  if (value !== password) {
    return 'Passwords do not match';
  }
}
