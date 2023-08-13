import { fetchStreamParser } from '../index.mjs';

const openAiKey = process.env.OPENAI_KEY;

(async function () {
  const fsp = await fetchStreamParser('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openAiKey}`
    },
    body: JSON.stringify({
      stream: true,
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello, how are you?' }
      ]
    })
  });

  for await (const { data } of fsp.sse()) {
    console.log(data);
  }
})().catch(console.error);