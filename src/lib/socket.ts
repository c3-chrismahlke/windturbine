// src/lib/socket.ts
// Socket.io disabled — backend uses SSE (Server-Sent Events) for real-time updates.
// Keeping this file so that imports won't break, but it won't attempt any connection.

export function getSocket() {
  if (process.env.NODE_ENV !== "production") {
    console.warn("⚠️ getSocket() called, but socket.io is disabled. Use SSE instead.");
  }
  return {
    // no-op stubs so calls won't crash if left in code
    on: () => {},
    off: () => {},
    emit: () => {},
    connect: () => {},
    disconnect: () => {},
  };
}
