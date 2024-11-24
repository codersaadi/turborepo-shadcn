export class RateLimitError extends Error {
	constructor() {
		super("Rate limit exceeded");
		this.name = "RateLimitError";
	}
}

export class PublicError extends Error {
	public readonly code: string;
	public readonly statusCode: number;

	constructor(message: string, code = "PUBLIC_ERROR", statusCode = 400) {
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		this.statusCode = statusCode;
	}
}

export class AuthenticationError extends PublicError {
	constructor(message = "You must be logged in to view this content") {
		super(message, "AUTHENTICATION_ERROR", 401);
	}
}

export class UnAuthorizedError extends PublicError {
	constructor(message = "You do not have access to this content") {
		super(message, "UNAUTHORIZED_ERROR", 403);
	}
}

export class EmailInUseError extends PublicError {
	constructor(message = "Email is already in use") {
		super(message, "EMAIL_IN_USE", 409);
	}
}

export class NotFoundError extends PublicError {
	constructor(resource?: string) {
		const message = resource ? `${resource} not found` : "Resource not found";
		super(message, "NOT_FOUND_ERROR", 404);
	}
}

export class TokenExpiredError extends PublicError {
	constructor(message = "Token has expired") {
		super(message, "TOKEN_EXPIRED", 401);
	}
}

export class LoginError extends PublicError {
	constructor(message = "Invalid email or password") {
		super(message, "LOGIN_ERROR", 401);
	}
}

export function isPublicError(error: unknown): error is PublicError {
	return error instanceof PublicError;
}

export interface ErrorMetadata {
	stack?: string;
	debug?: {
		inputRaw: unknown;
		inputParsed: unknown;
		inputParseErrors: unknown;
	};
	timestamp: string;
	requestId?: string;
}

export interface ErrorResponse {
	code: string;
	message: string;
	statusCode: number;
	data: unknown | null;
	metadata: ErrorMetadata | null;
}
