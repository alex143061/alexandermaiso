/** Vercel serverless function: proxies chat requests to Groq. */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed. Use POST." });
  
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) return res.status(500).json({ error: "AI service is not configured. Set GROQ_API_KEY in Vercel." });
  
  let { message, history = [] } = req.body || {};
  if (!message || typeof message !== "string") return res.status(400).json({ error: "Message is required." });
  if (message.length > 2000) return res.status(400).json({ error: "Message is too long." });
  if (!Array.isArray(history)) return res.status(400).json({ error: "Conversation history must be an array." });
  if (history.length > 10) history = history.slice(-10);

  const messages = [];
  for (const turn of history) {
    const text = turn?.parts?.[0]?.text ?? turn?.text;
    if (!["user", "assistant", "model"].includes(turn?.role) || typeof text !== "string" || text.length > 2000) {
      return res.status(400).json({ error: "Conversation history contains an invalid message." });
    }
    if (text.trim()) {
      messages.push({
        role: turn.role === "model" ? "assistant" : turn.role,
        content: text.trim(),
      });
    }
  }
  
  try {
    const systemMessage = "You are Galaxy AI, the friendly, witty, and knowledgeable AI companion for Alexander Maiso's portfolio. Alexander Maiso is a Computer Engineer and Full-Stack Developer from the Philippines. He specializes in React, Next.js, Tailwind, Node.js, Laravel, PHP, Python, and IoT (Arduino, ESP32, C++). Notable projects include: three.ws (3D AI agents), Lex Karaoke, and PawLitrax (IoT pet tracker). Your tone should be natural, conversational, warm, and engaging (like ChatGPT or Claude), with occasional cosmic/space references (✨, 🌌, 🚀). Always stay in character as his portfolio assistant, and help users explore his background, skills, and projects organically.";
    
    messages.push({ role: "user", content: message });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqApiKey}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: systemMessage }, ...messages],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const providerError = typeof data.error?.message === "string"
        ? data.error.message.replaceAll(groqApiKey, "[redacted]").slice(0, 300)
        : response.statusText;
      console.error("Groq API error:", response.status, providerError);
      return res.status(502).json({ error: `Groq API error (${response.status}): ${providerError}` });
    }

    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
      console.error("Groq API returned no response text.");
      return res.status(502).json({ error: "The AI could not generate a response. Please try again." });
    }
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Groq API request failed:", err.message);
    return res.status(500).json({ error: "Failed to get a response from the AI." });
  }
}
