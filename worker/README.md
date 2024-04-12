# VoiceJournal Cloudflare AI Workers

A set of cloudflare AI workers deployed on cloudflare workers. In order to handle multiple routes, `hono` is used as routing library for workers.

## Cloudflare AI Models

This AI worker uses three models:

1. Automatic Speech Recognition: [whisper](https://developers.cloudflare.com/workers-ai/models/whisper/)
2. Summarization: [bart-large-cnn](https://developers.cloudflare.com/workers-ai/models/bart-large-cnn/)
3. Text Generation: [qwen1.5-0.5b-chat](https://developers.cloudflare.com/workers-ai/models/qwen1.5-0.5b-chat/)

## Installation Instructions

To run the AI worker locally, follow given steps:

1. Clone the repo with with `git clone https://github.com/prashikm/voicejournal-cloudflare-ai-workers` command
2. Install dependencies via `npm install`
3. Run in development mode: `npx wrangler dev --remote`
4. Navigate to URL provided by Wrangler.

Note: Make sure you are log in to Wrangler, if not do so via `wrangler login`. 

---

After installation, user can access the AI functionality via routes defined in `index.js` file or can interact with [VoiceJournal website](https://master.voicejournal.pages.dev) which is build using `Next.js` and deployed on Cloudflare Pages. For font-end code visit [voice-journal](https://github.com/prashikm/voice-journal)
