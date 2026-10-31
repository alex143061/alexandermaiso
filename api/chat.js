import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Vercel serverless function: proxies chat requests to Gemini.
 * The API key lives only on the server (Vercel Env Vars), never in the browser.
 *
 * POST body: { message: string, history?: Array<{role: 'user'|'model', parts: string[]}> }
 */
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("DEBUG: GEMINI_API_KEY is not configured on the server.");
    return res.status(500).json({ error: "AI service is not configured." });
  }

  console.log("DEBUG: API key loaded, length:", apiKey.length);

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
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log("DEBUG: GoogleGenerativeAI initialized");
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    console.log("DEBUG: model created");

    // Build conversation history with system instruction as first message
    const systemPrompt = `You are Galaxy AI, the friendly, witty, and knowledgeable AI companion for Alexander Maiso's portfolio.
Alexander Maiso is a Computer Engineer and Full-Stack Developer from the Philippines. He specializes in React, Next.js, Tailwind, Node.js, Laravel, PHP, Python, and IoT (Arduino, ESP32, C++).
Notable projects include: three.ws (3D AI agents), Lex Karaoke, and PawLitrax (IoT pet tracker).
Your tone should be natural, conversational, warm, and engaging (like ChatGPT or Claude), with occasional cosmic/space references (✨, 🌌, 🚀).
Always stay in character as his portfolio assistant, and help users explore his background, skills, and projects organically.`;

    const fullHistory = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Understood. I am Galaxy AI, Alex's portfolio assistant. How can I help you today?" }] },
      ...history.map((h) => ({
        role: h.role === "model" ? "model" : "user",
        parts: [{ text: h.parts?.[0]?.text ?? h.text ?? "" }],
      })),
    ];

    const chat = model.startChat({
      history: fullHistory,
    });
    console.log("DEBUG: chat started");

    const result = await chat.sendMessage(message);
    console.log("DEBUG: message sent");
    const response = result.response;
    const text = response.text();
    console.log("DEBUG: response received, length:", text?.length || 0);

    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error("DEBUG: Gemini error:", err.message);
    console.error("DEBUG: Error stack:", err.stack);
    return res.status(500).json({ error: "Failed to get a response from the AI.", debug: err.message });
  }
}