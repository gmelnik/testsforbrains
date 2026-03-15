import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Simple pass-through middleware
  // Auth is handled client-side with Supabase
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  })
}
