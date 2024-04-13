# VoiceJournal Cloudflare AI Workers

A set of cloudflare AI workers. In order to handle multiple routes, `hono` is used as routing library.

## Cloudflare AI Models

This AI worker uses three models:

1. Automatic Speech Recognition: [whisper](https://developers.cloudflare.com/workers-ai/models/whisper/)
2. Summarization: [bart-large-cnn](https://developers.cloudflare.com/workers-ai/models/bart-large-cnn/)
3. Text Generation: [qwen1.5-0.5b-chat](https://developers.cloudflare.com/workers-ai/models/qwen1.5-0.5b-chat/)

## Installation Instructions

To run the AI worker locally, follow given steps:

1. Clone the repository
2. Install dependencies via `npm install`
3. Run in development mode: `npx wrangler dev`
4. Navigate to URL provided by Wrangler.

Note: Make sure you are log in to Wrangler, if not do so via `wrangler login`. 

---

After installation, user can access the AI functionality defined defined in `index.js` file or can interact with [VoiceJournal website](https://voicejournal.pages.dev). The fontend code is located in [web](../web) directory.
