import type { VercelRequest, VercelResponse } from '@vercel/node';

const GOOGLE_TTS_API_KEY = process.env.GOOGLE_TTS_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!GOOGLE_TTS_API_KEY) {
    return res.status(500).json({ error: 'TTS API key not configured' });
  }

  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' });
  }

  // Limit text length to avoid large requests
  const truncatedText = text.slice(0, 5000);

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text: truncatedText },
          voice: {
            languageCode: 'en-US',
            name: 'en-US-Neural2-F', // Natural female voice
            ssmlGender: 'FEMALE',
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.9, // Slightly slower for learners
            pitch: 0,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Google TTS error:', error);
      return res.status(response.status).json({ error: 'TTS API error' });
    }

    const data = await response.json();

    // Return base64 audio content
    res.status(200).json({ audioContent: data.audioContent });
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
}
