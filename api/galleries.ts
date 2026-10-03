import { callAppsScript, readSheetRows } from "./_sheetConfig.js";

function parseBool(value: unknown, fallback = false): boolean {
  const clean = String(value ?? "").trim().toLowerCase();
  if (!clean) return fallback;
  return ["sim", "true", "1", "yes", "ativo"].includes(clean);
}

function parseOrder(value: unknown): number {
  const n = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 9999;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    const rows = await readSheetRows("Galerias");
    const galleries = rows
      .filter(row => row?.id && parseBool(row.ativo, true))
      .map(row => ({
        id: String(row.id || "").trim(),
        titulo: String(row.titulo || "").trim(),
        folderId: String(row.drive_folder_id || "").trim(),
        descricao: String(row.descricao || "").trim(),
        data: String(row.data || "").trim(),
        destaque: parseBool(row.destaque, false),
        ordem: parseOrder(row.ordem)
      }))
      .filter(g => g.folderId)
      .sort((a, b) => a.ordem - b.ordem);

    const enriched = await Promise.all(
      galleries.map(async gallery => {
        try {
          const result = await callAppsScript("LIST_GALLERY_PHOTOS", {
            folderId: gallery.folderId,
            limit: 1
          });
          const first = Array.isArray(result.photos) ? result.photos[0] : null;
          return {
            ...gallery,
            coverUrl: first?.thumbnailUrl || first?.url || "",
            photoCount: Number(result.total || 0)
          };
        } catch {
          return {
            ...gallery,
            coverUrl: "",
            photoCount: 0
          };
        }
      })
    );

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    return res.status(200).json(enriched);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Erro ao carregar galerias." });
  }
}
