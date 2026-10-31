/**
 * Vercel serverless function: proxies chat requests to Gemini REST API.
 * The API key lives only on the server (Vercel Env Vars), never in the browser.
 *
 * POST body: { message: string, history?: Array<{role: 'user'|'model', parts: string[]}> }
 */
export default async function handler(req, res) {
  // Enable CORS for local development
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not configured on the server.");
    return res.status(500).json({ error: "AI service is not configured." });
  }

  let { message, history = [] } = req.body || {};

  // Basic validation
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required." });
  }

  // Length limit to prevent abuse
  if (message.length > 2000) {
    return res.status(400).json({ error: "Message is too long (max 2000 chars)." });
  }

  try {
    const systemPrompt = `You are Galaxy AI, the friendly, witty, and knowledgeable AI companion for Alexander Maiso's portfolio.
Alexander Maiso is a Computer Engineer and Full-Stack Developer from the Philippines. He specializes in React, Next.js, Tailwind, Node.js, Laravel, PHP, Python, and IoT (Arduino, ESP32, C++).
Notable projects include: three.ws (3D AI agents), Lex Karaoke, and PawLitrax (IoT pet tracker).
Your tone should be natural, conversational, warm, and engaging (like ChatGPT or Claude), with occasional cosmic/space references (✨, 🌌, 🚀).
Always stay in character as his portfolio assistant, and help users explore his background, skills, and projects organically.`;

    // Build contents array with system prompt as first user turn
    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Understood. I am Galaxy AI, Alex's portfolio assistant. How can I help you today?" }] },
      ...history.map((h) => ({
        role: h.role === "model" ? "model" : "user",
        parts: [{ text: h.parts?.[0]?.text ?? h.text ?? "" }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("Gemini API error:", response.status, responseText);
      return res.status(500).json({ error: "Failed to get a response from the AI.", debug: `Gemini status ${response.status}: ${responseText}` });
    }

    const data = JSON.parse(responseText);
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond to that. 🌠";

    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error("Chat API error:", err.message);
    return res.status(500).json({ error: "Failed to get a response from the AI.", debug: err.message });
  }
}