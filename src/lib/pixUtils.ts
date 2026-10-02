import QRCode from "qrcode";
import { PixConfig } from "../types/championship";

/**
 * Remove acentos e caracteres especiais para compatibilidade com o padrão EMV/Pix
 */
function normalizeString(str: string, maxLength: number): string {
  const normalized = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toUpperCase()
    .trim();
  return normalized.substring(0, maxLength);
}

/**
 * Formata um campo no padrão EMV (ID + Tamanho com 2 dígitos + Valor)
 */
function formatEmvField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

/**
 * Cálculo oficial do CRC16-CCITT para o padrão Pix (Polinômio 0x1021, Init 0xFFFF)
 */
function calculateCrc16(payload: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bitwise = 0; bitwise < 8; bitwise++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc = crc << 1;
      }
      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export interface GeneratePixPayloadParams {
  config: PixConfig;
  amount?: number;
  txid?: string; // ex: código da inscrição sem traço
}

/**
 * Gera a string Pix Copia e Cola conforme especificações do Banco Central do Brasil
 */
export function generatePixCopiaECola({
  config,
  amount,
  txid = "***"
}: GeneratePixPayloadParams): string {
  if (!config || !config.chave || !config.chave.trim()) {
    return "";
  }

  // Limpeza da chave Pix conforme o tipo
  let cleanedKey = config.chave.trim();
  if (config.tipoChave === "TELEFONE") {
    // Chave Pix telefone deve estar exatamente no padrão E.164 do DICT:
    // +55 + DDD (2 dígitos) + celular (9 dígitos). Ex.: +5521973681109
    //
    // Aceitamos na configuração:
    // 21973681109
    // 5521973681109
    // +5521973681109
    // (21) 97368-1109
    // e normalizamos sempre para o mesmo valor canônico.
    let digitsOnly = cleanedKey.replace(/\D/g, "");

    // Alguns usuários digitam 0 antes do DDD: 021973681109.
    if (digitsOnly.length === 12 && digitsOnly.startsWith("0")) {
      digitsOnly = digitsOnly.slice(1);
    }

    // Se já veio com o DDI 55, removemos temporariamente para validar o número nacional.
    let nationalNumber = digitsOnly;
    if (digitsOnly.startsWith("55") && digitsOnly.length === 13) {
      nationalNumber = digitsOnly.slice(2);
    }

    // O DICT usa telefone CELULAR em E.164. No Brasil isso corresponde a
    // DDD (2) + número móvel (9) = 11 dígitos nacionais.
    if (!/^\d{11}$/.test(nationalNumber)) {
      throw new Error(
        "Chave Pix de telefone inválida. Informe DDD + celular com 11 dígitos, por exemplo 21973681109."
      );
    }

    // Celulares brasileiros possuem 9 como primeiro dígito após o DDD.
    if (nationalNumber.charAt(2) !== "9") {
      throw new Error(
        "A chave Pix por telefone deve ser um número de celular válido com DDD."
      );
    }

    cleanedKey = `+55${nationalNumber}`;
  } else if (config.tipoChave === "CPF" || config.tipoChave === "CNPJ") {
    cleanedKey = cleanedKey.replace(/\D/g, "");
  } else if (config.tipoChave === "EMAIL") {
    cleanedKey = cleanedKey.toLowerCase().trim();
  } else if (config.tipoChave === "ALEATORIA") {
    cleanedKey = cleanedKey.trim();
  }

  // 00: Payload Format Indicator
  let payload = formatEmvField("00", "01");

  // 26: Merchant Account Information
  const gui = formatEmvField("00", "br.gov.bcb.pix");
  const keyField = formatEmvField("01", cleanedKey);
  payload += formatEmvField("26", `${gui}${keyField}`);

  // 52: Merchant Category Code (0000 = padrão)
  payload += formatEmvField("52", "0000");

  // 53: Transaction Currency (986 = BRL)
  payload += formatEmvField("53", "986");

  // 54: Transaction Amount (opcional conforme configuração)
  if (config.incluirValorNoQrCode && amount && amount > 0) {
    const formattedAmount = amount.toFixed(2);
    payload += formatEmvField("54", formattedAmount);
  }

  // 58: Country Code
  payload += formatEmvField("58", "BR");

  // 59: Merchant Name (máx 25 chars)
  const merchantName = normalizeString(config.nomeRecebedor || "DOJO MADEIRA", 25);
  payload += formatEmvField("59", merchantName);

  // 60: Merchant City (máx 15 chars)
  const merchantCity = normalizeString(config.cidadeRecebedor || "RIO DE JANEIRO", 15);
  payload += formatEmvField("60", merchantCity);

  // 62: Additional Data Field Template (TxID / Referência)
  const cleanTxId = (txid || "***").replace(/[^a-zA-Z0-9]/g, "").substring(0, 25) || "***";
  const txidField = formatEmvField("05", cleanTxId);
  payload += formatEmvField("62", txidField);

  // 63: CRC16
  const payloadToCrc = `${payload}6304`;
  const crc = calculateCrc16(payloadToCrc);

  return `${payloadToCrc}${crc}`;
}

/**
 * Gera DataURL do QRCode para renderização visual direta em <img src="...">
 */
export async function generatePixQrCodeDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 320,
      color: {
        dark: "#111111",
        light: "#FFFFFF"
      }
    });
  } catch (error) {
    console.error("Erro ao gerar QRCode do Pix:", error);
    throw error;
  }
}
