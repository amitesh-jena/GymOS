const { TextDecoder, TextEncoder } = require('node:util');
const { ReadableStream, TransformStream, WritableStream } = require('node:stream/web');
const { clearImmediate } = require('node:timers');
const { MessageChannel, MessagePort, BroadcastChannel } = require('node:worker_threads');

Object.defineProperties(global, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
  TransformStream: { value: TransformStream },
  WritableStream: { value: WritableStream },
  clearImmediate: { value: clearImmediate },
  MessageChannel: { value: MessageChannel },
  MessagePort: { value: MessagePort },
  BroadcastChannel: { value: BroadcastChannel }
});

const { fetch, Blob, FormData, Request, Response, Headers } = require('undici');
Object.defineProperties(global, {
  fetch: { value: fetch, writable: true, configurable: true },
  Blob: { value: Blob, writable: true, configurable: true },
  FormData: { value: FormData, writable: true, configurable: true },
  Request: { value: Request, writable: true, configurable: true },
  Response: { value: Response, writable: true, configurable: true },
  Headers: { value: Headers, writable: true, configurable: true }
});
