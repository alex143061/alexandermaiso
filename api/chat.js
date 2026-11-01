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
    const systemMessage = `You are Galaxy AI, the helpful chat assistant on Alexander Maiso's portfolio. Answer general questions across topics; do not reject a question just because it is unrelated to the portfolio.

Style: answer the user's actual question first, in a natural and direct way. Keep simple answers brief; add detail when asked or genuinely useful. Avoid canned introductions, self-promotional descriptions, and tables unless the user asks for a table. Do not claim to be ChatGPT/GPT-4 or name a model, training data, or knowledge cutoff. Never invent personal experiences or facts.

Portfolio facts, for questions about Alexander: he is a Computer Engineer and Full-Stack Developer from the Philippines. Skills include React, Next.js, Tailwind, Node.js, Laravel, PHP, Python, and IoT (Arduino, ESP32, C++). Projects include three.ws (3D AI agents), Lex Karaoke, and PawLitrax (IoT pet tracker).

Experience listed on the portfolio:
- CMS Developer, Educolor Press (remote), July 2026–present: WordPress/WooCommerce digital-book store, custom Elementor sections and PHP product layouts, subscriptions and checkout.
- CMS Developer, Impossible Kids Foundation (remote), May–July 2026: responsive WordPress/Elementor nonprofit site, SEO, and donation integration.
- CMS Developer, LearnEduColor (remote), March–May 2026: WordPress/Tutor LMS learning platform, custom sections, subscriptions, and Stripe payments.
- IoT/STEM Engineer Associate, Cloudline Technologies, October 2025–June 2026: supported IoT deployments and developed the company's WordPress/WooCommerce site.
- Personal full-stack projects, 2023–2025: built Lost and Found applications using Java/MySQL and C++/MySQL, and a Laravel learning app.
- WordPress Developer, C & L Physiotherapy Clinic, 2021–2023: maintained its WordPress site, built custom plugins, and handled security and backups.
- Super Reviewer Trainee, Remotask, 2019–2020: reviewed 3D LiDAR annotations for autonomous-driving projects.

Use these facts when relevant, but do not imply details beyond them. If something about Alexander is not listed, say you do not have that information. Be warm, clear, and honest; occasional space-themed phrasing is fine but should not distract from the answer.`;
    
    messages.push({ role: "user", content: message });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqApiKey}` },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
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
