// Type declarations for stream conversions
// Helps TypeScript understand ReadableStream type compatibility

declare module 'stream/web' {
  export interface ReadableStreamReadResult<T> {
    done: boolean
    value?: T
  }
  
  export interface ReadableStreamReadDoneResult<T> {
    done: true
    value?: T
  }
}

// Extend global ReadableStream types for better compatibility
declare global {
  interface ReadableStream<R = any> {
    getReader(): ReadableStreamDefaultReader<R>
  }
  
  interface ReadableStreamDefaultReader<R = any> {
    read(): Promise<ReadableStreamReadResult<R>>
    releaseLock(): void
    cancel(reason?: any): Promise<void>
  }
  
  interface ReadableStreamReadResult<T> {
    done: boolean
    value?: T
  }
}

export {}

