import { callAppsScript, readSheetRows } from "./_sheetConfig.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    const galleryId = String(req.query?.galleryId || "").trim();
    if (!galleryId) {
      return res.status(400).json({ error: "Galeria não informada." });
    }

    const rows = await readSheetRows("Galerias");
    const row = rows.find(r => String(r?.id || "").trim() === galleryId);
    if (!row) {
      return res.status(404).json({ error: "Galeria não encontrada." });
    }

    const folderId = String(row.drive_folder_id || "").trim();
    if (!folderId) {
      return res.status(400).json({ error: "Pasta do Google Drive não configurada para esta galeria." });
    }

    const result = await callAppsScript("LIST_GALLERY_PHOTOS", {
      folderId,
      limit: 300
    });

    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=120, stale-while-revalidate=300");
    return res.status(200).json({
      gallery: {
        id: galleryId,
        titulo: String(row.titulo || "").trim(),
        descricao: String(row.descricao || "").trim(),
        data: String(row.data || "").trim()
      },
      total: Number(result.total || 0),
      photos: Array.isArray(result.photos) ? result.photos : []
    });
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "Erro ao carregar fotos da galeria." });
  }
}
