import { NextResponse } from "next/server";

// Utility for generating error responses
export function createErrorResponse(message: string, status: number) {
	return NextResponse.json({ error: message }, { status });
}
