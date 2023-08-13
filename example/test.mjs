import { fetchIterator } from '../index.mjs';

(async function test() {
  let fi;

  console.log('==================== Fetch chuncks & cancel ==================== ')
  fi = await fetchIterator('https://hello-sse.talrasha007.workers.dev/');
  await fi.cancel();
  for await (const chunk of fi.chuncks()) {
    // Should not print anything.
    console.log(chunk);
  }

  console.log('==================== Fetch chuncks ==================== ')
  fi = await fetchIterator('https://hello-sse.talrasha007.workers.dev/');
  for await (const chunk of fi.chuncks()) {
    console.log(chunk);
  }

  console.log('==================== Fetch lines ==================== ')
  fi = await fetchIterator('https://hello-sse.talrasha007.workers.dev/');
  for await (const line of fi.lines()) {
    console.log('line:', line);
  }

  console.log('==================== Fetch sse ==================== ')
  fi = await fetchIterator('https://hello-sse.talrasha007.workers.dev/');
  for await (const event of fi.sse()) {
    console.log('event:', event);
  }

  console.log('==================== Fetch sse json ==================== ')
  fi = await fetchIterator('https://hello-sse.talrasha007.workers.dev/');
  for await (const event of fi.sse(true)) {
    console.log('event:', event);
  }
})();
