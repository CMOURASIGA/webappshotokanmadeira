/**
 * GOOGLE APPS SCRIPT — DOJO DIGITAL MADEIRA KARATE
 * A planilha e a fonte oficial do modulo de campeonatos.
 *
 * Abas preservadas:
 * Produtos, Inscrições, Configuracoes, Katas, Tecnicas, Avisos, Eventos
 *
 * Abas adicionadas pelo modulo:
 * CAMPEONATOS, CATEGORIAS_CAMPEONATO
 */

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ status: "error", message: "Payload vazio." });
    }

    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.action === "INIT_CHAMPIONSHIP_SHEETS" || data.action === "INIT_ALL_SHEETS") {
      initChampionshipSheets_(ss);
      return jsonResponse_({ status: "success", message: "Estrutura de campeonatos inicializada." });
    }

    if (data.action === "LIST_GALLERY_PHOTOS" && data.folderId) {
      var folder = DriveApp.getFolderById(String(data.folderId).trim());
      var files = folder.getFiles();
      var photos = [];
      var total = 0;
      var requestedLimit = Number(data.limit || 300);
      if (!requestedLimit || requestedLimit < 1) requestedLimit = 300;
      requestedLimit = Math.min(requestedLimit, 300);

      while (files.hasNext()) {
        var file = files.next();
        var mimeType = String(file.getMimeType() || "");
        if (mimeType.indexOf("image/") !== 0) continue;

        total++;
        if (photos.length >= requestedLimit) continue;

        var fileId = file.getId();
        photos.push({
          id: fileId,
          name: file.getName(),
          mimeType: mimeType,
          thumbnailUrl: "https://drive.google.com/thumbnail?id=" + encodeURIComponent(fileId) + "&sz=w1200",
          url: "https://drive.google.com/thumbnail?id=" + encodeURIComponent(fileId) + "&sz=w2400",
          viewUrl: "https://drive.google.com/file/d/" + encodeURIComponent(fileId) + "/view",
          updatedAt: file.getLastUpdated().toISOString()
        });
      }

      photos.sort(function(a, b) {
        return String(b.updatedAt).localeCompare(String(a.updatedAt));
      });

      return jsonResponse_({
        status: "success",
        folderId: String(data.folderId).trim(),
        folderName: folder.getName(),
        total: total,
        photos: photos
      });
    }

    if (data.action === "SAVE_CHAMPIONSHIP" && data.championship) {
      var championship = normalizeChampionship_(data.championship);
      var championshipSheet = ensureChampionshipsSheet_(ss);
      upsertObjectByKey_(championshipSheet, "id", championship.id, championshipHeaders_(), championship);
      SpreadsheetApp.flush();
      return jsonResponse_({ status: "success", target: "CAMPEONATOS", championship: championship });
    }

    if (data.action === "DELETE_CHAMPIONSHIP" && data.championshipId) {
      var champSheet = ensureChampionshipsSheet_(ss);
      var registrations = ensureRegistrationsSheet_(ss);
      var categories = ensureCategoriesSheet_(ss);

      var registrationsForChampionship = countRowsByValue_(registrations, "Campeonato ID", String(data.championshipId));
      if (registrationsForChampionship > 0) {
        return jsonResponse_({
          status: "error",
          message: "Não é possível excluir o campeonato porque existem inscrições vinculadas."
        });
      }

      deleteRowByKey_(champSheet, "id", String(data.championshipId));
      deleteRowsByValue_(categories, "campeonatoId", String(data.championshipId));
      SpreadsheetApp.flush();
      return jsonResponse_({ status: "success", deleted: true });
    }

    if (data.action === "ADD_REGISTRATION" && data.registration) {
      var lock = LockService.getScriptLock();
      lock.waitLock(10000);
      try {
        var registrationSheet = ensureRegistrationsSheet_(ss);
        var registration = normalizeRegistration_(data.registration);

        if (!registration["Código"]) {
          registration["Código"] = nextRegistrationCode_(registrationSheet);
        }

        upsertObjectByKey_(
          registrationSheet,
          "Código",
          registration["Código"],
          registrationHeaders_(),
          registration
        );

        SpreadsheetApp.flush();
        return jsonResponse_({
          status: "success",
          target: "Inscrições",
          registration: registrationObjectForApi_(registration)
        });
      } finally {
        lock.releaseLock();
      }
    }

    if (data.action === "DELETE_REGISTRATION" && data.registrationId) {
      var registrationDeleteSheet = ensureRegistrationsSheet_(ss);
      deleteRowByKey_(registrationDeleteSheet, "Código", String(data.registrationId));
      SpreadsheetApp.flush();
      return jsonResponse_({ status: "success", deleted: true });
    }

    if (data.action === "SAVE_CATEGORY" && data.category) {
      var categorySheet = ensureCategoriesSheet_(ss);
      var category = normalizeCategory_(data.category);
      upsertObjectByKey_(categorySheet, "id", category.id, categoryHeaders_(), category);
      SpreadsheetApp.flush();
      return jsonResponse_({ status: "success", target: "CATEGORIAS_CAMPEONATO", category: category });
    }

    if (data.action === "DELETE_CATEGORY" && data.categoryId) {
      var categoryDeleteSheet = ensureCategoriesSheet_(ss);
      deleteRowByKey_(categoryDeleteSheet, "id", String(data.categoryId));
      SpreadsheetApp.flush();
      return jsonResponse_({ status: "success", deleted: true });
    }

    return jsonResponse_({ status: "ignored", message: "Ação não reconhecida: " + String(data.action || "") });
  } catch (err) {
    return jsonResponse_({ status: "error", message: String(err && err.message ? err.message : err) });
  }
}

function initChampionshipSheets_(ss) {
  // Preserva e inicializa a estrutura já existente do site.
  ensureRegistrationsSheet_(ss);
  ensureConfiguracoesSheet_(ss);
  ensureProdutosSheet_(ss);
  ensureEventosSheet_(ss);
  ensureAvisosSheet_(ss);
  ensureKatasSheet_(ss);
  ensureTecnicasSheet_(ss);
  ensureGalleriesSheet_(ss);

  // Estrutura específica do módulo de campeonatos.
  ensureChampionshipsSheet_(ss);
  ensureCategoriesSheet_(ss);
  SpreadsheetApp.flush();
}

function registrationHeaders_() {
  return [
    "Código",
    "Campeonato",
    "Nome Completo",
    "Nascimento",
    "Idade",
    "Sexo",
    "Graduação",
    "Peso (kg)",
    "Participação",
    "Telefone",
    "E-mail",
    "Menor?",
    "Responsável",
    "Tel Responsável",
    "Chave/Categoria",
    "Status Inscrição",
    "Status Pagamento",
    "Valor",
    "Data/Hora Inscrição",
    "Campeonato ID",
    "Categoria ID",
    "Data Confirmação",
    "Confirmado Por",
    "Comprovante Recebido",
    "Observações",
    "Atualizado Em"
  ];
}

function championshipHeaders_() {
  return [
    "id",
    "slug",
    "nome",
    "descricao",
    "dataCampeonato",
    "local",
    "aberturaInscricoes",
    "encerramentoInscricoes",
    "status",
    "valorInscricao",
    "modalidades",
    "pixTipo",
    "pixChave",
    "pixNome",
    "pixCidade",
    "pixIncluirValor",
    "regulamento",
    "permiteMenores",
    "idadeMinima",
    "idadeMaxima",
    "createdAt",
    "updatedAt"
  ];
}

function categoryHeaders_() {
  return [
    "id",
    "campeonatoId",
    "nome",
    "sexo",
    "idadeMinima",
    "idadeMaxima",
    "pesoMaximo",
    "observacoes",
    "createdAt",
    "updatedAt"
  ];
}

function ensureGalleriesSheet_(ss) {
  return ensureSheetWithHeaders_(ss, "Galerias", [
    "id", "titulo", "drive_folder_id", "descricao", "data", "ativo", "destaque", "ordem"
  ], "#1F2937");
}

function ensureRegistrationsSheet_(ss) {
  return ensureSheetWithHeaders_(ss, "Inscrições", registrationHeaders_(), "#D32F2F");
}

function ensureChampionshipsSheet_(ss) {
  return ensureSheetWithHeaders_(ss, "CAMPEONATOS", championshipHeaders_(), "#1F2937");
}

function ensureCategoriesSheet_(ss) {
  return ensureSheetWithHeaders_(ss, "CATEGORIAS_CAMPEONATO", categoryHeaders_(), "#1F2937");
}

function ensureConfiguracoesSheet_(ss) {
  var sheet = ensureSheetWithHeaders_(ss, "Configuracoes", ["chave", "valor", "descricao"], "#1F2937");
  if (sheet.getLastRow() === 1) {
    sheet.appendRow(["whatsapp", "5521973681109", "WhatsApp oficial para contato e comprovantes"]);
    sheet.appendRow(["pix", "21973681109", "Chave PIX padrão do Dojo"]);
    sheet.appendRow(["logo", "https://i.imgur.com/fECU6ud.png", "Link direto da imagem do logo"]);
    sheet.appendRow(["google_analytics_id", "", "ID de medição GA4 (opcional)"]);
    sheet.appendRow(["video_faixa", "", "Link de vídeo orientador de amarração da faixa"]);
  }
  return sheet;
}

function ensureProdutosSheet_(ss) {
  return ensureSheetWithHeaders_(ss, "Produtos", [
    "id", "nome", "descricao", "preco", "imagem1", "imagem2", "imagem3",
    "categoria", "tamanhos", "cores", "variacoes", "personalizavel",
    "disponivel", "ativo", "ordem"
  ], "#1F2937");
}

function ensureEventosSheet_(ss) {
  return ensureSheetWithHeaders_(ss, "Eventos", [
    "id", "titulo", "imagem", "mostrar_popup", "link_album", "data_evento"
  ], "#1F2937");
}

function ensureAvisosSheet_(ss) {
  return ensureSheetWithHeaders_(ss, "Avisos", [
    "id", "titulo", "imagem", "instagram_url", "mostrar_popup"
  ], "#1F2937");
}

function ensureKatasSheet_(ss) {
  return ensureSheetWithHeaders_(ss, "Katas", ["id", "video_url"], "#1F2937");
}

function ensureTecnicasSheet_(ss) {
  return ensureSheetWithHeaders_(ss, "Tecnicas", ["id", "video_url", "imagem"], "#1F2937");
}

function ensureSheetWithHeaders_(ss, name, requiredHeaders, color) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  var lastColumn = Math.max(sheet.getLastColumn(), 0);
  var existingHeaders = lastColumn > 0
    ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(function(v) { return String(v).trim(); })
    : [];

  requiredHeaders.forEach(function(header) {
    if (existingHeaders.indexOf(header) === -1) {
      existingHeaders.push(header);
      sheet.getRange(1, existingHeaders.length).setValue(header);
    }
  });

  if (existingHeaders.length > 0) {
    var headerRange = sheet.getRange(1, 1, 1, existingHeaders.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground(color || "#1F2937");
    headerRange.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function normalizeChampionship_(c) {
  var now = new Date().toISOString();
  return {
    id: String(c.id || ("champ-" + new Date().getTime())).trim(),
    slug: String(c.slug || c.id || "").trim(),
    nome: String(c.nome || "").trim(),
    descricao: String(c.descricao || "").trim(),
    dataCampeonato: String(c.dataCampeonato || "").trim(),
    local: String(c.local || "").trim(),
    aberturaInscricoes: String(c.aberturaInscricoes || "").trim(),
    encerramentoInscricoes: String(c.encerramentoInscricoes || "").trim(),
    status: String(c.status || "RASCUNHO").trim(),
    valorInscricao: Number(c.valorInscricao || 0),
    modalidades: Array.isArray(c.modalidades) ? c.modalidades.join(", ") : String(c.modalidades || "").trim(),
    pixTipo: c.configuracaoPix ? String(c.configuracaoPix.tipoChave || "").trim() : "",
    pixChave: c.configuracaoPix ? String(c.configuracaoPix.chave || "").trim() : "",
    pixNome: c.configuracaoPix ? String(c.configuracaoPix.nomeRecebedor || "").trim() : "",
    pixCidade: c.configuracaoPix ? String(c.configuracaoPix.cidadeRecebedor || "").trim() : "",
    pixIncluirValor: c.configuracaoPix && c.configuracaoPix.incluirValorNoQrCode === false ? "Não" : "Sim",
    regulamento: String(c.regulamento || "").trim(),
    permiteMenores: c.permiteMenores === false ? "Não" : "Sim",
    idadeMinima: c.idadeMinima !== undefined && c.idadeMinima !== null ? Number(c.idadeMinima) : 0,
    idadeMaxima: c.idadeMaxima !== undefined && c.idadeMaxima !== null ? Number(c.idadeMaxima) : 120,
    createdAt: String(c.createdAt || now),
    updatedAt: now
  };
}

function normalizeRegistration_(r) {
  var now = new Date().toISOString();
  var participation = r.modalidade || r.participacao || "";
  return {
    "Código": String(r.id || r["Código"] || "").trim(),
    "Campeonato": String(r.championshipName || r["Campeonato"] || "").trim(),
    "Nome Completo": String(r.nomeCompleto || r["Nome Completo"] || "").trim(),
    "Nascimento": String(r.dataNascimento || r["Nascimento"] || "").trim(),
    "Idade": r.idadeNaDataCampeonato !== undefined ? r.idadeNaDataCampeonato : (r["Idade"] || ""),
    "Sexo": String(r.sexo || r["Sexo"] || "").trim(),
    "Graduação": String(r.graduacao || r["Graduação"] || "").trim(),
    "Peso (kg)": r.peso !== undefined ? r.peso : (r["Peso (kg)"] || ""),
    "Participação": String(participation || "").trim(),
    "Telefone": String(r.telefone || r["Telefone"] || "").trim(),
    "E-mail": String(r.email || r["E-mail"] || "").trim(),
    "Menor?": r.isMenor === true || r["Menor?"] === "Sim" ? "Sim" : "Não",
    "Responsável": String(r.nomeResponsavel || r["Responsável"] || "").trim(),
    "Tel Responsável": String(r.telefoneResponsavel || r["Tel Responsável"] || "").trim(),
    "Chave/Categoria": String(r.categoriaNome || r["Chave/Categoria"] || "Sem Categoria").trim(),
    "Status Inscrição": String(r.status || r["Status Inscrição"] || "RECEBIDA").trim(),
    "Status Pagamento": String(r.paymentStatus || r["Status Pagamento"] || "AGUARDANDO_PAGAMENTO").trim(),
    "Valor": r.valorInscricao !== undefined ? r.valorInscricao : (r["Valor"] || 0),
    "Data/Hora Inscrição": String(r.dataHoraInscricao || r["Data/Hora Inscrição"] || now),
    "Campeonato ID": String(r.championshipId || r["Campeonato ID"] || "").trim(),
    "Categoria ID": String(r.categoriaId || r["Categoria ID"] || "").trim(),
    "Data Confirmação": String(r.conferidoEm || r["Data Confirmação"] || "").trim(),
    "Confirmado Por": String(r.conferidoPor || r["Confirmado Por"] || "").trim(),
    "Comprovante Recebido": r.comprovanteRecebido === true || r["Comprovante Recebido"] === "Sim" ? "Sim" : "Não",
    "Observações": String(r.observacoes || r["Observações"] || "").trim(),
    "Atualizado Em": now
  };
}

function registrationObjectForApi_(r) {
  return {
    id: r["Código"],
    championshipId: r["Campeonato ID"],
    championshipName: r["Campeonato"],
    nomeCompleto: r["Nome Completo"],
    dataNascimento: r["Nascimento"],
    idadeNaDataCampeonato: Number(r["Idade"] || 0),
    sexo: r["Sexo"],
    graduacao: r["Graduação"],
    peso: Number(r["Peso (kg)"] || 0),
    modalidade: r["Participação"],
    telefone: r["Telefone"],
    email: r["E-mail"],
    isMenor: r["Menor?"] === "Sim",
    nomeResponsavel: r["Responsável"],
    telefoneResponsavel: r["Tel Responsável"],
    categoriaId: r["Categoria ID"],
    categoriaNome: r["Chave/Categoria"],
    status: r["Status Inscrição"],
    paymentStatus: r["Status Pagamento"],
    valorInscricao: Number(r["Valor"] || 0),
    dataHoraInscricao: r["Data/Hora Inscrição"],
    conferidoEm: r["Data Confirmação"],
    conferidoPor: r["Confirmado Por"],
    comprovanteRecebido: r["Comprovante Recebido"] === "Sim",
    observacoes: r["Observações"]
  };
}

function normalizeCategory_(cat) {
  var now = new Date().toISOString();
  return {
    id: String(cat.id || ("cat-" + new Date().getTime())).trim(),
    campeonatoId: String(cat.championshipId || cat.campeonatoId || "").trim(),
    nome: String(cat.nome || "").trim(),
    sexo: String(cat.sexo || "Misto").trim(),
    idadeMinima: cat.idadeMinima !== undefined ? cat.idadeMinima : "",
    idadeMaxima: cat.idadeMaxima !== undefined ? cat.idadeMaxima : "",
    pesoMaximo: cat.pesoMaximo !== undefined ? cat.pesoMaximo : "",
    observacoes: String(cat.observacoes || "").trim(),
    createdAt: String(cat.createdAt || now),
    updatedAt: now
  };
}

function nextRegistrationCode_(sheet) {
  var year = new Date().getFullYear();
  var prefix = "CAM" + year + "-";
  var lastRow = sheet.getLastRow();
  var maxSeq = 0;

  if (lastRow > 1) {
    var headerMap = headerMap_(sheet);
    var codeColumn = headerMap["Código"];
    if (codeColumn) {
      var values = sheet.getRange(2, codeColumn, lastRow - 1, 1).getValues();
      values.forEach(function(row) {
        var value = String(row[0] || "").trim();
        if (value.indexOf(prefix) === 0) {
          var n = parseInt(value.substring(prefix.length), 10);
          if (!isNaN(n) && n > maxSeq) maxSeq = n;
        }
      });
    }
  }

  return prefix + String(maxSeq + 1).padStart(4, "0");
}

function upsertObjectByKey_(sheet, keyHeader, keyValue, headers, objectData) {
  var map = headerMap_(sheet);
  var keyColumn = map[keyHeader];
  if (!keyColumn) throw new Error("Coluna chave não encontrada: " + keyHeader);

  var targetRow = -1;
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var values = sheet.getRange(2, keyColumn, lastRow - 1, 1).getValues();
    for (var i = 0; i < values.length; i++) {
      if (String(values[i][0]).trim() === String(keyValue).trim()) {
        targetRow = i + 2;
        break;
      }
    }
  }

  if (targetRow < 0) targetRow = lastRow + 1;

  headers.forEach(function(header) {
    var column = map[header];
    if (column) {
      sheet.getRange(targetRow, column).setValue(objectData[header] !== undefined ? objectData[header] : "");
    }
  });
}

function deleteRowByKey_(sheet, keyHeader, keyValue) {
  var map = headerMap_(sheet);
  var keyColumn = map[keyHeader];
  if (!keyColumn || sheet.getLastRow() <= 1) return false;

  var values = sheet.getRange(2, keyColumn, sheet.getLastRow() - 1, 1).getValues();
  for (var i = values.length - 1; i >= 0; i--) {
    if (String(values[i][0]).trim() === String(keyValue).trim()) {
      sheet.deleteRow(i + 2);
      return true;
    }
  }
  return false;
}

function deleteRowsByValue_(sheet, header, value) {
  var map = headerMap_(sheet);
  var column = map[header];
  if (!column || sheet.getLastRow() <= 1) return;

  var values = sheet.getRange(2, column, sheet.getLastRow() - 1, 1).getValues();
  for (var i = values.length - 1; i >= 0; i--) {
    if (String(values[i][0]).trim() === String(value).trim()) {
      sheet.deleteRow(i + 2);
    }
  }
}

function countRowsByValue_(sheet, header, value) {
  var map = headerMap_(sheet);
  var column = map[header];
  if (!column || sheet.getLastRow() <= 1) return 0;

  var values = sheet.getRange(2, column, sheet.getLastRow() - 1, 1).getValues();
  var count = 0;
  values.forEach(function(row) {
    if (String(row[0]).trim() === String(value).trim()) count++;
  });
  return count;
}

function headerMap_(sheet) {
  var lastColumn = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var map = {};
  headers.forEach(function(value, index) {
    map[String(value).trim()] = index + 1;
  });
  return map;
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
