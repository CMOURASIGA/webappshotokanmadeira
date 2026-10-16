/**
 * GOOGLE APPS SCRIPT — DOJO DIGITAL MADEIRA KARATE
 * Script oficial unificado: Campeonatos, Galerias e MadeiraStore
 *
 * Abas gerenciadas:
 * - Produtos, Inscrições, Configuracoes, Katas, Tecnicas, Avisos, Eventos, Galerias
 * - CAMPEONATOS, CATEGORIAS_CAMPEONATO
 * - PEDIDOS_LOJA, ITENS_PEDIDO_LOJA
 */

function TEST_GALLERY_DRIVE_ACCESS() {
  var folderId = "1Ox53ko8Rh2P7hXlr9WRjjwM4ztug_XUB";
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles();
  var imageCount = 0;

  while (files.hasNext()) {
    var file = files.next();
    if (String(file.getMimeType() || "").indexOf("image/") === 0) {
      imageCount++;
    }
  }

  Logger.log("Acesso ao Drive autorizado.");
  Logger.log("Pasta: " + folder.getName());
  Logger.log("Imagens encontradas: " + imageCount);

  return "OK - " + imageCount + " imagens encontradas em " + folder.getName();
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ status: "error", message: "Payload vazio." });
    }

    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.action === "INIT_CHAMPIONSHIP_SHEETS" || data.action === "INIT_ALL_SHEETS") {
      initChampionshipSheets_(ss);
      initStoreSheets_(ss);
      return jsonResponse_({ status: "success", message: "Estruturas de campeonatos e MadeiraStore inicializadas." });
    }

    if (data.action === "INIT_STORE_SHEETS") {
      initStoreSheets_(ss);
      return jsonResponse_({ status: "success", message: "Abas PEDIDOS_LOJA e ITENS_PEDIDO_LOJA inicializadas." });
    }

    if (data.action === "CREATE_STORE_ORDER") {
      var lock = LockService.getScriptLock();
      try {
        lock.waitLock(10000);
      } catch (lockErr) {
        return jsonResponse_({ status: "error", message: "Não foi possível obter bloqueio exclusivo no momento." });
      }

      try {
        var ordersSheet = ensureStoreOrdersSheet_(ss);
        var itemsSheet = ensureStoreOrderItemsSheet_(ss);

        var orderCode = data.order && data.order.codigo 
          ? String(data.order.codigo).trim() 
          : generateStoreOrderCode_(ordersSheet);

        var nowIso = new Date().toISOString();
        var rawOrder = data.order || {};
        var rawItems = Array.isArray(data.items) ? data.items : [];

        var totalCalculated = 0;
        var processedItems = [];
        var productsSheet = ensureProdutosMadeiraStoreSheet_(ss);

        if (!rawItems.length) {
          return jsonResponse_({ status: "error", message: "O pedido deve conter pelo menos um item." });
        }

        for (var i = 0; i < rawItems.length; i++) {
          var it = rawItems[i] || {};
          var productId = String(it.produtoId || "").trim();
          var product = findProductById_(productsSheet, productId);
          if (!product) {
            return jsonResponse_({ status: "error", message: "Produto não localizado: " + productId });
          }

          var active = parseSheetBool_(product.ativo, true);
          var available = parseSheetBool_(product.disponivel, true);
          if (!active || !available) {
            return jsonResponse_({ status: "error", message: "Produto indisponível: " + String(product.nome || productId) });
          }

          var qty = Number(it.quantidade || 1);
          if (!isFinite(qty) || Math.floor(qty) !== qty || qty < 1 || qty > 99) {
            return jsonResponse_({ status: "error", message: "Quantidade inválida para " + String(product.nome || productId) });
          }

          var size = String(it.tamanho || "").trim();
          var color = String(it.cor || "").trim();
          var variation = String(it.variacao || "").trim();
          var allowedSizes = parseSheetList_(product.tamanhos);
          var allowedColors = parseSheetList_(product.cores);
          var allowedVariations = parseSheetList_(product.variacoes);

          if (allowedSizes.length && allowedSizes.indexOf(size) === -1) {
            return jsonResponse_({ status: "error", message: "Tamanho inválido para " + String(product.nome || productId) });
          }
          if (allowedColors.length && allowedColors.indexOf(color) === -1) {
            return jsonResponse_({ status: "error", message: "Cor inválida para " + String(product.nome || productId) });
          }
          if (allowedVariations.length && allowedVariations.indexOf(variation) === -1) {
            return jsonResponse_({ status: "error", message: "Variação inválida para " + String(product.nome || productId) });
          }

          var price = parseSheetNumber_(product.preco);
          if (!(price > 0)) {
            return jsonResponse_({ status: "error", message: "Preço oficial inválido para " + String(product.nome || productId) });
          }

          var sub = Math.round((qty * price) * 100) / 100;
          totalCalculated += sub;

          var itemRow = {
            pedidoId: orderCode,
            produtoId: productId,
            produtoNome: String(product.nome || productId).trim(),
            categoria: String(product.categoria || "").trim(),
            quantidade: qty,
            tamanho: size,
            cor: color,
            variacao: variation,
            personalizacao: String(it.personalizacao || "").trim(),
            valorUnitario: price,
            subtotal: sub
          };

          appendObjectRow_(itemsSheet, storeOrderItemsHeaders_(), itemRow);
          processedItems.push(itemRow);
        }

        var orderData = {
          id: orderCode,
          codigo: orderCode,
          nomeCliente: String(rawOrder.nomeCliente || "").trim(),
          telefone: String(rawOrder.telefone || "").trim(),
          email: String(rawOrder.email || "").trim(),
          valorTotal: Math.round(totalCalculated * 100) / 100,
          statusPedido: String(rawOrder.statusPedido || "RECEBIDO").trim(),
          statusPagamento: String(rawOrder.statusPagamento || "AGUARDANDO_PAGAMENTO").trim(),
          dataCriacao: String(rawOrder.dataCriacao || nowIso).trim(),
          dataPagamento: String(rawOrder.dataPagamento || "").trim(),
          dataRetirada: String(rawOrder.dataRetirada || "").trim(),
          observacoes: String(rawOrder.observacoes || "").trim(),
          atualizadoEm: nowIso,
          tokenRetirada: String(rawOrder.tokenRetirada || Utilities.getUuid().replace(/-/g, "")).trim(),
          dataGeracaoComprovante: String(rawOrder.dataGeracaoComprovante || nowIso).trim(),
          entreguePor: String(rawOrder.entreguePor || "").trim()
        };

        upsertObjectByKey_(ordersSheet, "id", orderCode, storeOrdersHeaders_(), orderData);
        SpreadsheetApp.flush();

        return jsonResponse_({
          status: "success",
          order: orderData,
          items: processedItems
        });
      } finally {
        lock.releaseLock();
      }
    }

    if (data.action === "UPDATE_STORE_ORDER") {
      var ordersSheet = ensureStoreOrdersSheet_(ss);
      var orderId = String(data.orderId || (data.order && data.order.id) || (data.order && data.order.codigo) || "").trim();
      if (!orderId) {
        return jsonResponse_({ status: "error", message: "orderId não informado." });
      }

      var rawOrder = data.order || data;
      var existingOrder = findObjectByKey_(ordersSheet, "id", orderId, storeOrdersHeaders_()) ||
                          findObjectByKey_(ordersSheet, "codigo", orderId, storeOrdersHeaders_());

      if (!existingOrder) {
        return jsonResponse_({ status: "error", message: "Pedido não localizado na planilha." });
      }

      var nowIso = new Date().toISOString();
      if (rawOrder.statusPedido) existingOrder.statusPedido = String(rawOrder.statusPedido).trim();
      if (rawOrder.statusPagamento) {
        existingOrder.statusPagamento = String(rawOrder.statusPagamento).trim();
        if (existingOrder.statusPagamento === "PAGAMENTO_CONFIRMADO" && !existingOrder.dataPagamento) {
          existingOrder.dataPagamento = nowIso;
        }
      }
      if (existingOrder.statusPedido === "ENTREGUE" && !existingOrder.dataRetirada) {
        existingOrder.dataRetirada = nowIso;
      }
      if (rawOrder.observacoes !== undefined) existingOrder.observacoes = String(rawOrder.observacoes).trim();
      existingOrder.atualizadoEm = nowIso;

      upsertObjectByKey_(ordersSheet, "id", existingOrder.id, storeOrdersHeaders_(), existingOrder);
      SpreadsheetApp.flush();

      return jsonResponse_({ status: "success", order: existingOrder });
    }

    if (data.action === "GET_STORE_ORDER") {
      var ordersSheet = ensureStoreOrdersSheet_(ss);
      var itemsSheet = ensureStoreOrderItemsSheet_(ss);
      var orderId = String(data.orderId || data.codigo || "").trim();

      var foundOrder = findObjectByKey_(ordersSheet, "id", orderId, storeOrdersHeaders_()) ||
                       findObjectByKey_(ordersSheet, "codigo", orderId, storeOrdersHeaders_());

      if (!foundOrder) {
        return jsonResponse_({ status: "error", message: "Pedido não localizado." });
      }

      var allItems = getObjectsByKeyValue_(itemsSheet, "pedidoId", foundOrder.codigo || foundOrder.id, storeOrderItemsHeaders_());
      return jsonResponse_({ status: "success", order: foundOrder, items: allItems });
    }

    if (data.action === "SAVE_STORE_CATEGORY" && data.category) {
      var categorySheet = ensureStoreCategoriesSheet_(ss);
      var category = normalizeStoreCategory_(data.category);
      upsertObjectByKey_(categorySheet, "id", category.id, storeCategoryHeaders_(), category);
      SpreadsheetApp.flush();
      return jsonResponse_({ status: "success", category: storeCategoryObjectForApi_(category) });
    }

    if (data.action === "DELETE_STORE_CATEGORY" && data.id) {
      var categorySheet = ensureStoreCategoriesSheet_(ss);
      var productSheet = ensureProdutosMadeiraStoreSheet_(ss);
      var inUse = countRowsByValue_(productSheet, "categoriaId", String(data.id));
      if (inUse > 0) {
        return jsonResponse_({ status: "error", message: "Categoria vinculada a produto. Remova ou altere os produtos antes de excluir." });
      }
      deleteRowByKey_(categorySheet, "id", String(data.id));
      SpreadsheetApp.flush();
      return jsonResponse_({ status: "success", deleted: true });
    }

    if (data.action === "SAVE_STORE_PRODUCT" && data.product) {
      var productSheet = ensureProdutosMadeiraStoreSheet_(ss);
      var product = normalizeStoreProduct_(data.product);
      if (!product.categoriaId) {
        return jsonResponse_({ status: "error", message: "Selecione uma categoria cadastrada." });
      }
      var categorySheet = ensureStoreCategoriesSheet_(ss);
      var category = findObjectByKey_(categorySheet, "id", product.categoriaId, storeCategoryHeaders_());
      if (!category || String(category.ativo).toLowerCase() === "não") {
        return jsonResponse_({ status: "error", message: "Categoria inválida ou inativa." });
      }
      product.categoria = String(category.nome || "").trim();
      upsertObjectByKey_(productSheet, "id", product.id, storeProductHeaders_(), product);
      SpreadsheetApp.flush();
      return jsonResponse_({ status: "success", product: storeProductObjectForApi_(product) });
    }

    if (data.action === "DELETE_STORE_PRODUCT" && data.id) {
      var productSheet = ensureProdutosMadeiraStoreSheet_(ss);
      deleteRowByKey_(productSheet, "id", String(data.id));
      SpreadsheetApp.flush();
      return jsonResponse_({ status: "success", deleted: true });
    }

    if (data.action === "SAVE_STORE_CONFIG" && data.config) {
      var driveUrl = String(data.config.driveFolderUrl || "").trim();
      var folderId = extractDriveFolderId_(driveUrl);
      if (!folderId) {
        return jsonResponse_({ status: "error", message: "Informe um link válido de pasta do Google Drive." });
      }
      try {
        var folder = DriveApp.getFolderById(folderId);
        folder.getName();
      } catch (folderErr) {
        return jsonResponse_({ status: "error", message: "Não foi possível acessar a pasta. Verifique o link e o compartilhamento da pasta." });
      }
      setConfigValue_(ss, "madeirastore_drive_folder_url", driveUrl);
      setConfigValue_(ss, "madeirastore_drive_folder_id", folderId);
      SpreadsheetApp.flush();
      return jsonResponse_({ status: "success", config: { driveFolderUrl: driveUrl, driveFolderId: folderId } });
    }

    if (data.action === "UPLOAD_STORE_PRODUCT_IMAGE" && data.dataUrl) {
      var folderId = getConfigValue_(ss, "madeirastore_drive_folder_id");
      if (!folderId) {
        return jsonResponse_({ status: "error", message: "Configure primeiro a pasta de imagens da MadeiraStore no Dashboard." });
      }
      var uploaded = uploadStoreProductImage_(folderId, String(data.dataUrl), String(data.fileName || "produto.jpg"));
      return jsonResponse_({ status: "success", url: uploaded.url, fileId: uploaded.fileId });
    }

    if (data.action === "CONFIRM_STORE_PICKUP" && data.token) {
      var ordersSheet = ensureStoreOrdersSheet_(ss);
      var existing = findObjectByKey_(ordersSheet, "tokenRetirada", String(data.token), storeOrdersHeaders_());
      if (!existing) {
        return jsonResponse_({ status: "error", message: "Pedido não localizado para este QR Code." });
      }
      if (String(existing.statusPagamento || "") !== "PAGAMENTO_CONFIRMADO") {
        return jsonResponse_({ status: "error", message: "Pagamento ainda não confirmado. A entrega não pode ser concluída." });
      }
      var nowIso = new Date().toISOString();
      existing.statusPedido = "ENTREGUE";
      existing.dataRetirada = existing.dataRetirada || nowIso;
      existing.entreguePor = String(data.entreguePor || "ADMIN").trim();
      existing.atualizadoEm = nowIso;
      upsertObjectByKey_(ordersSheet, "id", existing.id, storeOrdersHeaders_(), existing);
      SpreadsheetApp.flush();
      return jsonResponse_({ status: "success", order: existing });
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
    "id", "titulo", "drive_folder_id", "descricao", "data", "ativo", "destaque", "ordem", "tipo"
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
    "disponivel", "ativo", "ordem", "canal"
  ], "#1F2937");
}

function storeProductHeaders_() {
  return [
    "id", "nome", "descricao", "preco", "imagem1", "imagem2", "imagem3",
    "imagem1_file_id", "imagem2_file_id", "imagem3_file_id",
    "categoriaId", "categoria", "tamanhos", "cores", "variacoes", "personalizavel",
    "disponivel", "ativo", "ordem"
  ];
}

function ensureProdutosMadeiraStoreSheet_(ss) {
  return ensureSheetWithHeaders_(ss, "Produtos_MadeiraStore", storeProductHeaders_(), "#1F2937");
}

function storeCategoryHeaders_() {
  return ["id", "nome", "descricao", "ativo", "usaTamanho", "usaCor", "usaVariacao", "permitePersonalizacao", "ordem"];
}

function ensureStoreCategoriesSheet_(ss) {
  return ensureSheetWithHeaders_(ss, "CATEGORIAS_MADEIRASTORE", storeCategoryHeaders_(), "#1F2937");
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

function parseSheetBool_(value, defaultValue) {
  var raw = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
  if (!raw) return defaultValue === true;
  return ["1", "true", "sim", "yes", "ativo", "disponivel", "disponível"].indexOf(raw) >= 0;
}

function parseSheetList_(value) {
  return String(value || "")
    .split(/[,;|]/)
    .map(function(v) { return String(v).trim(); })
    .filter(function(v) { return !!v; });
}

function parseSheetNumber_(value) {
  var raw = String(value === undefined || value === null ? "0" : value).trim();
  if (!raw) return 0;
  if (raw.indexOf(",") >= 0) raw = raw.replace(/\./g, "").replace(",", ".");
  var n = Number(raw);
  return isFinite(n) ? n : 0;
}

function findProductById_(sheet, productId) {
  if (!productId || sheet.getLastRow() <= 1) return null;
  var map = headerMap_(sheet);
  var idCol = map["id"];
  if (!idCol) return null;

  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][idCol - 1] || "").trim() === String(productId).trim()) {
      var obj = {};
      Object.keys(map).forEach(function(header) {
        obj[header] = values[i][map[header] - 1];
      });
      return obj;
    }
  }
  return null;
}

function normalizeStoreCategory_(cat) {
  var now = new Date().getTime();
  return {
    id: String(cat.id || ("msc-" + now)).trim(),
    nome: String(cat.nome || "").trim(),
    descricao: String(cat.descricao || "").trim(),
    ativo: cat.ativo === false ? "Não" : "Sim",
    usaTamanho: cat.usaTamanho === true ? "Sim" : "Não",
    usaCor: cat.usaCor === true ? "Sim" : "Não",
    usaVariacao: cat.usaVariacao === true ? "Sim" : "Não",
    permitePersonalizacao: cat.permitePersonalizacao === true ? "Sim" : "Não",
    ordem: Number(cat.ordem || 0)
  };
}

function storeCategoryObjectForApi_(cat) {
  return {
    id: cat.id, nome: cat.nome, descricao: cat.descricao,
    ativo: String(cat.ativo).toLowerCase() !== "não",
    usaTamanho: String(cat.usaTamanho).toLowerCase() === "sim",
    usaCor: String(cat.usaCor).toLowerCase() === "sim",
    usaVariacao: String(cat.usaVariacao).toLowerCase() === "sim",
    permitePersonalizacao: String(cat.permitePersonalizacao).toLowerCase() === "sim",
    ordem: Number(cat.ordem || 0)
  };
}

function normalizeStoreProduct_(p) {
  return {
    id: String(p.id || ("msp-" + new Date().getTime())).trim(),
    nome: String(p.nome || "").trim(),
    descricao: String(p.descricao || "").trim(),
    preco: Number(p.preco || 0),
    imagem1: String(p.imagem1 || "").trim(),
    imagem2: String(p.imagem2 || "").trim(),
    imagem3: String(p.imagem3 || "").trim(),
    imagem1_file_id: String(p.imagem1FileId || p.imagem1_file_id || "").trim(),
    imagem2_file_id: String(p.imagem2FileId || p.imagem2_file_id || "").trim(),
    imagem3_file_id: String(p.imagem3FileId || p.imagem3_file_id || "").trim(),
    categoriaId: String(p.categoriaId || "").trim(),
    categoria: String(p.categoria || "").trim(),
    tamanhos: String(p.tamanhos || "").trim(),
    cores: String(p.cores || "").trim(),
    variacoes: String(p.variacoes || "").trim(),
    personalizavel: p.personalizavel === true ? "Sim" : "Não",
    disponivel: p.disponivel === false ? "Não" : "Sim",
    ativo: p.ativo === false ? "Não" : "Sim",
    ordem: Number(p.ordem || 0)
  };
}

function storeProductObjectForApi_(p) {
  return {
    id: p.id, nome: p.nome, descricao: p.descricao, preco: Number(p.preco || 0),
    imagem1: p.imagem1, imagem2: p.imagem2, imagem3: p.imagem3,
    imagem1FileId: p.imagem1_file_id, imagem2FileId: p.imagem2_file_id, imagem3FileId: p.imagem3_file_id,
    categoriaId: p.categoriaId, categoria: p.categoria,
    tamanhos: p.tamanhos, cores: p.cores, variacoes: p.variacoes,
    personalizavel: String(p.personalizavel).toLowerCase() === "sim",
    disponivel: String(p.disponivel).toLowerCase() !== "não",
    ativo: String(p.ativo).toLowerCase() !== "não",
    ordem: Number(p.ordem || 0)
  };
}

function extractDriveFolderId_(url) {
  var raw = String(url || "").trim();
  var match = raw.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) return match[1];
  if (/^[a-zA-Z0-9_-]{15,}$/.test(raw)) return raw;
  return "";
}

function setConfigValue_(ss, key, value) {
  var sheet = ensureConfiguracoesSheet_(ss);
  var map = headerMap_(sheet);
  var keyCol = map["chave"];
  var valueCol = map["valor"];
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var values = sheet.getRange(2, keyCol, lastRow - 1, 1).getValues();
    for (var i = 0; i < values.length; i++) {
      if (String(values[i][0]).trim() === String(key).trim()) {
        sheet.getRange(i + 2, valueCol).setValue(value);
        return;
      }
    }
  }
  sheet.appendRow([key, value, "Configuração MadeiraStore"]);
}

function getConfigValue_(ss, key) {
  var sheet = ensureConfiguracoesSheet_(ss);
  var map = headerMap_(sheet);
  var keyCol = map["chave"];
  var valueCol = map["valor"];
  if (sheet.getLastRow() <= 1) return "";
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][keyCol - 1]).trim() === String(key).trim()) {
      return String(values[i][valueCol - 1] || "").trim();
    }
  }
  return "";
}

function uploadStoreProductImage_(folderId, dataUrl, fileName) {
  var match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Arquivo de imagem inválido.");
  var mime = match[1];
  if (mime.indexOf("image/") !== 0) throw new Error("O arquivo enviado não é uma imagem.");
  var bytes = Utilities.base64Decode(match[2]);
  if (bytes.length > 8 * 1024 * 1024) throw new Error("Imagem muito grande. Limite de 8 MB.");
  var folder = DriveApp.getFolderById(folderId);
  var blob = Utilities.newBlob(bytes, mime, fileName || ("produto-" + new Date().getTime() + ".jpg"));
  var file = folder.createFile(blob);
  try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) {}
  var fileId = file.getId();
  return {
    fileId: fileId,
    url: "https://drive.google.com/thumbnail?id=" + encodeURIComponent(fileId) + "&sz=w1600"
  };
}

// ----------------------------------------------------
// MadeiraStore Sheet Helpers (SPEC 09)
// ----------------------------------------------------

function initStoreSheets_(ss) {
  ensureProdutosMadeiraStoreSheet_(ss);
  ensureStoreCategoriesSheet_(ss);
  ensureStoreOrdersSheet_(ss);
  ensureStoreOrderItemsSheet_(ss);
}

function storeOrdersHeaders_() {
  return [
    "id",
    "codigo",
    "nomeCliente",
    "telefone",
    "email",
    "valorTotal",
    "statusPedido",
    "statusPagamento",
    "dataCriacao",
    "dataPagamento",
    "dataRetirada",
    "observacoes",
    "atualizadoEm",
    "tokenRetirada",
    "dataGeracaoComprovante",
    "entreguePor"
  ];
}

function storeOrderItemsHeaders_() {
  return [
    "pedidoId",
    "produtoId",
    "produtoNome",
    "categoria",
    "quantidade",
    "tamanho",
    "cor",
    "variacao",
    "personalizacao",
    "valorUnitario",
    "subtotal"
  ];
}

function ensureStoreOrdersSheet_(ss) {
  return getOrCreateSheetWithHeaders_(ss, "PEDIDOS_LOJA", storeOrdersHeaders_());
}

function ensureStoreOrderItemsSheet_(ss) {
  return getOrCreateSheetWithHeaders_(ss, "ITENS_PEDIDO_LOJA", storeOrderItemsHeaders_());
}

function generateStoreOrderCode_(sheet) {
  var year = new Date().getFullYear();
  var prefix = "MS" + year + "-";
  var map = headerMap_(sheet);
  var codeCol = map["codigo"] || map["id"];
  var maxSeq = 0;

  if (codeCol && sheet.getLastRow() > 1) {
    var values = sheet.getRange(2, codeCol, sheet.getLastRow() - 1, 1).getValues();
    values.forEach(function(row) {
      var val = String(row[0] || "").trim();
      if (val.indexOf(prefix) === 0) {
        var num = parseInt(val.replace(prefix, ""), 10);
        if (!isNaN(num) && num > maxSeq) {
          maxSeq = num;
        }
      }
    });
  }

  var nextSeq = maxSeq + 1;
  var padded = ("0000" + nextSeq).slice(-4);
  return prefix + padded;
}

function findObjectByKey_(sheet, keyHeader, keyValue, headers) {
  var map = headerMap_(sheet);
  var col = map[keyHeader];
  if (!col || sheet.getLastRow() <= 1) return null;

  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    if (String(row[col - 1]).trim().toUpperCase() === String(keyValue).trim().toUpperCase()) {
      var obj = {};
      headers.forEach(function(h) {
        var c = map[h];
        obj[h] = c ? row[c - 1] : "";
      });
      return obj;
    }
  }
  return null;
}

function getObjectsByKeyValue_(sheet, keyHeader, keyValue, headers) {
  var map = headerMap_(sheet);
  var col = map[keyHeader];
  var result = [];
  if (!col || sheet.getLastRow() <= 1) return result;

  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    if (String(row[col - 1]).trim().toUpperCase() === String(keyValue).trim().toUpperCase()) {
      var obj = {};
      headers.forEach(function(h) {
        var c = map[h];
        obj[h] = c ? row[c - 1] : "";
      });
      result.push(obj);
    }
  }
  return result;
}

function appendObjectRow_(sheet, headers, obj) {
  var map = headerMap_(sheet);
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var val = obj[headers[i]];
    row.push(val !== undefined && val !== null ? val : "");
  }
  sheet.appendRow(row);
}

function getOrCreateSheetWithHeaders_(ss, name, requiredHeaders, color) {
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
