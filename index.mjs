
class Parser {
  constructor(readableStream) {
    this._readable = readableStream;
  }

  cancel() {
    return this._readable.cancel();
  }

  async *chuncks() {
    const reader = this._readable.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      yield value;
    }
  }

  async *lines() {
    const decoder = new TextDecoder();

    let rest = '';
    for await (const chunk of this.chuncks()) {
      const text = rest + decoder.decode(chunk);
      const lines = text.split('\n');
      rest = lines.pop();

      for (const line of lines) yield line;
    }

    if (rest) yield rest;
  }

  async *json() {
    for await (const line of this.lines()) {
      if (line.trim()) yield JSON.parse(line);
    }
  }

  async *sse(isJsonData = false) {
    let current = null;
    for await (const line of this.lines()) {
      if (!line) {
        if (current) {
          yield current;
          current = null;
        }
        continue;
      }

      current = current || {};
      const match = /^(id|event|data): (.*)$/.exec(line);
      if (!match) {
        console.warn('Bad SSE line:', line);
        continue;
      }

      let [, key, value] = match;
      if (key === 'data' && isJsonData) {
        try { value = JSON.parse(value); }
        catch (e) { }
      }

      if (!current[key]) {
        current[key] = value;
      } else {
        yield current;
        current = { [key]: value };
      }
    }
  }
}

async function fetchStreamParser(url, opts) {
  const resp = await fetch(url, opts);
  if (!resp.ok) throw new Error(`Fetch failed: ${resp.status} ${resp.statusText}`);

  return new Parser(resp.body);
}

async function *getWsEvents(ws) {
  let resolve, reject, done = false, error;
  const buffer = [];

  ws.addEventListener('message', ({ data }) => resolve(data));
  ws.addEventListener('close', () => resolve());
  ws.addEventListener('error', (e) => reject(e));

  function pushData(data) {
    if (data !== undefined) buffer.push(data);
    else done = true;
  }

  function setError(err) {
    error = err;
  }

  while (true) {
    const data = await new Promise((res, rej) => {
      if (buffer.length > 0) return res(buffer.shift());
      if (buffer.length === 0 && done) return res();
      if (error) return rej(error);

      resolve = res;
      reject = rej;
    })

    resolve = pushData;
    reject = setError;
    
    if (data === undefined) break;
    else yield data;
  }
}

export default fetchStreamParser;
export { Parser, fetchStreamParser, getWsEvents };