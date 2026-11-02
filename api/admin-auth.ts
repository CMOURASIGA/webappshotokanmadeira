const ADMIN_PIN = String(process.env.MADEIRA_ADMIN_PIN || "").trim();

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  if (!ADMIN_PIN) {
    return res.status(503).json({
      success: false,
      error: "PIN administrativo não configurado no ambiente."
    });
  }

  const enteredPin = String(
    req.headers?.["x-admin-pin"] ||
    req.body?.pin ||
    ""
  ).trim();

  if (!enteredPin || enteredPin !== ADMIN_PIN) {
    return res.status(401).json({
      success: false,
      error: "PIN incorreto."
    });
  }

  return res.status(200).json({ success: true });
}
