// Middleware is not supported with `output: "export"`.
// Auth guards are handled client-side inside each layout/component.
// Keep this file so the module graph is unchanged; the empty matcher means
// it is never invoked, which also satisfies Next.js's static-export check.

export function middleware() {}

export const config = { matcher: [] };
