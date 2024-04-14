import { Ai } from '@cloudflare/ai';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';

const app = new Hono();

app.use(
	'/*',
	cors({
		origin: ['https://voicejournal.pages.dev'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
	})
);

app.get('/', async (c) => {
	return c.text('VoiceJournal');
});

app.post('/ask-ai', async (c) => {
	const { content, query } = await c.req.json();

	if (!query || query.length > 128) throw new HTTPException(400, { message: 'Invalid prompt length' });

	const ai = new Ai(c.env.AI);

	const answer = await ai.run('@cf/mistral/mistral-7b-instruct-v0.1', {
		messages: [
			{
				role: 'system',
				content: `You are a helpful assistant. I will provide you with notes data what has format like "date: actual-note". You will respond or answer the question while keeping context of the notes data provided, also do not include note-number in response. If multiple notes have same date then also count them distinctively.`,
			},
			...content,
			{
				role: 'user',
				content: 'At this point I have provided you the required notes data',
			},
			{ role: 'user', content: query },
		],
		max_tokens: 256,
	});

	return c.json(answer);
});

app.post('/summarize', async (c) => {
	const { content } = await c.req.json();

	if (!content || content.length === 0) throw new HTTPException(400, { message: 'Invalid text length' });

	const ai = new Ai(c.env.AI);

	const answer = await ai.run('@cf/facebook/bart-large-cnn', {
		input_text: content,
		max_tokens: 1024,
	});

	return c.json(answer);
});

app.post('/synthesize', async (c) => {
	const buffer = await c.req.arrayBuffer();

	const ai = new Ai(c.env.AI);
	const input = {
		audio: [...new Uint8Array(buffer)],
	};

	const response = await ai.run('@cf/openai/whisper', input);

	return c.json({ input: { audio: [] }, response });
});

export default app;
