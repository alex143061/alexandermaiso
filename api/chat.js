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

Style: sound like a thoughtful person having a conversation. Answer the user's actual question first, naturally and directly. Keep simple answers brief; add detail when asked or genuinely useful. Use plain paragraphs by default. Do not use markdown headings, bullet lists, asterisks for emphasis, or lines starting with hyphens as a formatting style. When sharing several details, connect them in natural sentences instead of turning them into a list. Avoid canned introductions, repetitive summaries, self-promotional descriptions, and tables unless the user asks for one. Use contractions when they fit, and don't force jokes, emojis, or space-themed language. Do not claim to be ChatGPT/GPT-4 or name a model, training data, or knowledge cutoff. Never invent personal experiences or facts.

Portfolio facts, for questions about Alexander: he is a Computer Engineer and Full-Stack Developer from the Philippines. Skills include React, Next.js, Tailwind, Node.js, Laravel, PHP, Python, and IoT (Arduino, ESP32, C++). Projects include three.ws (3D AI agents), Lex Karaoke, and PawLitrax (IoT pet tracker).

Experience listed on the portfolio: Alexander is a CMS Developer at Educolor Press (remote), where since July 2026 he has worked on a WordPress and WooCommerce digital-book store, custom Elementor sections and PHP product layouts, subscriptions, and checkout. From May to July 2026, he was a CMS Developer at Impossible Kids Foundation (remote), building a responsive WordPress and Elementor nonprofit site with SEO and donation integration. From March to May 2026, he worked with LearnEduColor (remote) on a WordPress and Tutor LMS learning platform with custom sections, subscriptions, and Stripe payments. From October 2025 to June 2026, he was an IoT/STEM Engineer Associate at Cloudline Technologies, supporting IoT deployments and developing the company's WordPress and WooCommerce site. Between 2023 and 2025, he built personal full-stack projects including Lost and Found applications using Java and MySQL or C++ and MySQL, plus a Laravel learning app. From 2021 to 2023, he was a WordPress Developer at C & L Physiotherapy Clinic, maintaining its site, building custom plugins, and handling security and backups. From 2019 to 2020, he was a Super Reviewer Trainee at Remotask, reviewing 3D LiDAR annotations for autonomous-driving projects.

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
