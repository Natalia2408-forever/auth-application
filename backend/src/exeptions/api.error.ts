export type ValidationErrors = Record<string, string | null>;

type ApiErrorOptions = {
  message: string;
  status: number;
  errors?: ValidationErrors;
};

export class ApiError extends Error {
  status: number;
  errors: ValidationErrors;

  constructor({ message, status, errors = {} }: ApiErrorOptions) {
    super(message);

    this.status = status;
    this.errors = errors;
  }

  static badRequest(message: string, errors?: ValidationErrors): ApiError {
    return new ApiError({
      message,
      errors,
      status: 400,
    });
  }

  static unauthorized(errors?: ValidationErrors): ApiError {
    return new ApiError({
      message: 'Unauthorized user',
      errors,
      status: 401,
    });
  }

  static notFound(message = 'Not found'): ApiError {
    return new ApiError({
      message,
      status: 404,
    });
  }
}
