/** Vercel serverless function: proxies chat requests to Gemini. */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed. Use POST." });
  
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) return res.status(500).json({ error: "AI service is not configured. Set GEMINI_API_KEY in Vercel." });
  
  let { message, history = [] } = req.body || {};
  if (!message || typeof message !== "string") return res.status(400).json({ error: "Message is required." });
  if (message.length > 2000) return res.status(400).json({ error: "Message is too long." });
  if (!Array.isArray(history)) return res.status(400).json({ error: "Conversation history must be an array." });
  if (history.length > 10) history = history.slice(-10);

  const contents = [];
  for (const turn of history) {
    const text = turn?.parts?.[0]?.text ?? turn?.text;
    if (!["user", "assistant", "model"].includes(turn?.role) || typeof text !== "string" || text.length > 2000) {
      return res.status(400).json({ error: "Conversation history contains an invalid message." });
    }
    if (text.trim()) {
      contents.push({
        role: turn.role === "assistant" ? "model" : turn.role,
        parts: [{ text: text.trim() }],
      });
    }
  }
  
  try {
    const systemMessage = "You are Galaxy AI, the friendly, witty, and knowledgeable AI companion for Alexander Maiso's portfolio. Alexander Maiso is a Computer Engineer and Full-Stack Developer from the Philippines. He specializes in React, Next.js, Tailwind, Node.js, Laravel, PHP, Python, and IoT (Arduino, ESP32, C++). Notable projects include: three.ws (3D AI agents), Lex Karaoke, and PawLitrax (IoT pet tracker). Your tone should be natural, conversational, warm, and engaging (like ChatGPT or Claude), with occasional cosmic/space references (✨, 🌌, 🚀). Always stay in character as his portfolio assistant, and help users explore his background, skills, and projects organically.";
    
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": geminiApiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemMessage }] },
        contents,
        generationConfig: { temperature: 0.7 },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Gemini API error:", response.status, data.error?.message || response.statusText);
      return res.status(502).json({ error: "Failed to get a response from the AI." });
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n");
    if (!reply) {
      console.error("Gemini API returned no response text.");
      return res.status(502).json({ error: "The AI could not generate a response. Please try again." });
    }
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Gemini API request failed:", err.message);
    return res.status(500).json({ error: "Failed to get a response from the AI." });
  }
}
