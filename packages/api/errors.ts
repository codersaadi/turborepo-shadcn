import type { z } from "zod";

// Enum for predefined error types to ensure type safety
export enum ErrorType {
  RATE_LIMIT = "RATE_LIMIT_ERROR",
  AUTHENTICATION = "AUTHENTICATION_ERROR",
  VALIDATION = "VALIDATION_ERROR",
  CONFLICT = "CONFLICT_ERROR",
  FORBIDDEN = "FORBIDDEN_ERROR",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  INTERNAL_SERVER = "INTERNAL_SERVER_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
}

// Enhanced error metadata interface
export interface ErrorMetadata {
  stack?: string;
  debug?: {
    inputRaw: unknown;
    inputParsed: unknown;
    inputParseErrors?: z.ZodError | unknown;
  };
  timestamp: string;
  requestId?: string;
  traceId?: string;
}

// Comprehensive error response interface
export interface ErrorResponse {
  code: string;
  message: string;
  statusCode: number;
  data: unknown | null;
  metadata: ErrorMetadata | Record<string, unknown> | null;
}

// Base error class with enhanced features
export class BaseError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly metadata: ErrorResponse["metadata"];

  constructor(
    message: string,
    code: ErrorType | string,
    statusCode: number,
    metadata: ErrorResponse["metadata"] = null
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.metadata = {
      ...metadata,
      timestamp: new Date().toISOString(),
    };

    // Ensure proper stack trace capture
    Error.captureStackTrace?.(this, this.constructor);
  }
}

// Error creation functions
export function createRateLimitError(
  metadata: Record<string, unknown> | null = null
): BaseError {
  return new BaseError(
    "Rate limit exceeded",
    ErrorType.RATE_LIMIT,
    429,
    metadata
  );
}

export function createAuthenticationError(
  message = "Authentication required",
  metadata: Record<string, unknown> | null = null
): BaseError {
  return new BaseError(message, ErrorType.AUTHENTICATION, 401, metadata);
}

export function createValidationError(
  message = "Validation failed",
  metadata: Record<string, unknown> | null = null
): BaseError {
  return new BaseError(message, ErrorType.VALIDATION, 400, metadata);
}

export function createConflictError(
  message = "Resource conflict occurred",
  metadata: Record<string, unknown> | null = null
): BaseError {
  return new BaseError(message, ErrorType.CONFLICT, 409, metadata);
}

export function createForbiddenError(
  message = "Forbidden access",
  metadata: Record<string, unknown> | null = null
): BaseError {
  return new BaseError(message, ErrorType.FORBIDDEN, 403, metadata);
}

export function createResourceNotFoundError(
  resource = "Resource",
  metadata: Record<string, unknown> | null = null
): BaseError {
  return new BaseError(
    `${resource} not found`,
    ErrorType.RESOURCE_NOT_FOUND,
    404,
    metadata
  );
}

export function createInternalServerError(
  message = "An unexpected error occurred",
  metadata: Record<string, unknown> | null = null
): BaseError {
  return new BaseError(message, ErrorType.INTERNAL_SERVER, 500, metadata);
}

export function createBadRequestError(
  message = "Invalid request parameters",
  metadata: Record<string, unknown> | null = null
): BaseError {
  return new BaseError(message, ErrorType.BAD_REQUEST, 400, metadata);
}

// Centralized error creation function
export function createError(
  type: ErrorType,
  message?: string,
  metadata: Record<string, unknown> | null = null
): BaseError {
  switch (type) {
    case ErrorType.RATE_LIMIT:
      return createRateLimitError(metadata);
    case ErrorType.AUTHENTICATION:
      return createAuthenticationError(message, metadata);
    case ErrorType.VALIDATION:
      return createValidationError(message, metadata);
    case ErrorType.CONFLICT:
      return createConflictError(message, metadata);
    case ErrorType.FORBIDDEN:
      return createForbiddenError(message, metadata);
    case ErrorType.RESOURCE_NOT_FOUND:
      return createResourceNotFoundError(message, metadata);
    case ErrorType.INTERNAL_SERVER:
      return createInternalServerError(message, metadata);
    case ErrorType.BAD_REQUEST:
      return createBadRequestError(message, metadata);
    default:
      return new BaseError(message || "Unknown error", type, 500, metadata);
  }
}

// Error serialization function
export function serializeError(
  error: BaseError,
  options: {
    includeStack?: boolean;
    anonymize?: boolean;
  } = {}
): ErrorResponse {
  const {
    includeStack = process.env.NODE_ENV !== "production",
    anonymize = false,
  } = options;

  const baseResponse: ErrorResponse = {
    code: error.code,
    message: anonymize ? "An error occurred" : error.message,
    statusCode: error.statusCode,
    data: null,
    metadata: includeStack
      ? { ...error.metadata, stack: error.stack }
      : error.metadata,
  };

  // Optionally anonymize sensitive metadata
  if (anonymize && baseResponse.metadata) {
    baseResponse.metadata.debug = undefined;
  }

  return baseResponse;
}

// Type guard to check if an error is a known error
export function isKnownError(error: unknown): error is BaseError {
  return error instanceof BaseError;
}
