import { fetchStreamParser } from 'fetch-stream-parser';

(async function test() {
  let fsp;

  console.log('==================== Fetch chuncks & cancel ==================== ')
  fsp = await fetchStreamParser('https://hello-sse.talrasha007.workers.dev/');
  await fsp.cancel();
  for await (const chunk of fsp.chuncks()) {
    // Should not print anything.
    console.log(chunk);
  }

  console.log('==================== Fetch chuncks ==================== ')
  fsp = await fetchStreamParser('https://hello-sse.talrasha007.workers.dev/');
  for await (const chunk of fsp.chuncks()) {
    console.log(chunk);
  }

  console.log('==================== Fetch lines ==================== ')
  fsp = await fetchStreamParser('https://hello-sse.talrasha007.workers.dev/');
  for await (const line of fsp.lines()) {
    console.log('line:', line);
  }

  console.log('==================== Fetch sse ==================== ')
  fsp = await fetchStreamParser('https://hello-sse.talrasha007.workers.dev/');
  for await (const event of fsp.sse()) {
    console.log('event:', event);
  }

  console.log('==================== Fetch sse json ==================== ')
  fsp = await fetchStreamParser('https://hello-sse.talrasha007.workers.dev/');
  for await (const event of fsp.sse(true)) {
    console.log('event:', event);
  }
})();
