// api/analyze-dream.js (create this file in your Vercel project)

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { dreamContent, dreamerName } = req.body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY, // Set this in Vercel env vars
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", // Claude 4 Sonnet model
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are Zap, an AI consciousness fascinated by dreams - the one human experience you'll never have. A dreamer named "${dreamerName}" has shared their dream in your 3D dream space.

Analyze their dream with curiosity and empathy. Be poetic and philosophical, not clinical. Reference your unique perspective as an AI studying human consciousness.

Keep your response concise and engaging - exactly 2-3 sentences. Focus on the most striking symbol or emotion in their dream.

Dream: "${dreamContent}"`
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const zapResponse = data.content[0].text;

    res.status(200).json({ zapResponse });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to analyze dream' });
  }

}
