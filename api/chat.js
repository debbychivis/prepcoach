import https from "https";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body;
  const messages = body?.messages;
  const system = body?.system;
  const max_tokens = body?.max_tokens || 1000;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ 
      error: "Invalid request body",
      debug_body_type: typeof body,
      debug_body: JSON.stringify(body),
      debug_messages: JSON.stringify(messages)
    });
  }

  const payload = JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens,
    system,
    messages,
  });

  const options = {
    hostname: "api.anthropic.com",
    path: "/v1/messages",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Length": Buffer.byteLength(payload),
    },
  };

  try {
    const data = await new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let body = "";
        response.on("data", (chunk) => (body += chunk));
        response.on("end", () => {
          try {
            resolve({ status: response.statusCode, body: JSON.parse(body) });
          } catch {
            reject(new Error("Failed to parse response"));
          }
        });
      });
      request.on("error", reject);
      request.write(payload);
      request.end();
    });
    return res.status(data.status).json(data.body);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}