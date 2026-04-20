# Lovable Prompt Helper
Yo

A Firefox extension that turns rough ideas into well-structured [Lovable.dev](https://lovable.dev) prompts using Google's Gemini API.

Type "a habit tracker" and get back a prompt with a feature breakdown, stack hints, visual direction, data model, and edge cases. Far more detailed than anything you'd write by hand and ready to accept and send straight to Lovable.

## Usage

1. Go to [lovable.dev](https://lovable.dev)
2. Click the **Enhance** button next to the prompt input, or press **Ctrl+Shift+E** (Cmd+Shift+E on Mac)
3. Type your rough idea and click **Get Prompt**
4. Edit the result if needed, then click **Accept** to fill it into Lovable

## Setup

1. Install the extension
2. Click the extension icon and open **Settings**
3. Get a free API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) and paste it in

The key is stored locally on your device and never leaves it except in requests to Gemini.

## Privacy

For Google's Gemini API on the **free tier, Google may use your inputs to improve their models.** Use a paid API tier if this is a concern. The extension itself collects no data and makes no external calls beyond Gemini.

## Development

No build step — vanilla JS loaded directly by the browser.

```
about:debugging → This Firefox → Load Temporary Add-on → select manifest.json
```

Create a `config.js` at the project root to seed a dev API key on install:

```js
export const DEV_API_KEY = 'your-key-here';
```

## License

MIT
