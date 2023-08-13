
export interface Parser {
  constructor(readableStream: ReadableStream<Uint8Array>);
  cancel(): Promise<void>;
  chuncks(): AsyncIterableIterator<Uint8Array>;
  lines(): AsyncIterableIterator<String>;
  json(): AsyncIterableIterator<Object>;
  sse(isJsonData: Boolean): AsyncIterableIterator<Object>;
}

export function fetchStreamParser(url: RequestInfo | URL | String, opts: RequestInit): Promise<Parser>;

export default fetchStreamParser;