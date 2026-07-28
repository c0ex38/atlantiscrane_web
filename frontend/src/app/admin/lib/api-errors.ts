type ApiErrorDetail = {
  field?: unknown;
  message?: unknown;
};

type ApiErrorPayload = {
  code?: unknown;
  error?: unknown;
  errors?: unknown;
  message?: unknown;
};

const statusMessages: Record<number, string> = {
  400: "Gönderilen istek geçerli değil.",
  401: "Oturumunuz geçersiz veya süresi dolmuş.",
  403: "Bu işlem için yetkiniz bulunmuyor.",
  404: "İstenen kayıt veya servis bulunamadı.",
  409: "Bu işlem mevcut bir kayıtla çakışıyor.",
  413: "Gönderilen dosya izin verilen boyuttan büyük.",
  422: "Gönderilen bilgiler işlenemedi.",
  429: "Çok fazla istek gönderildi. Lütfen kısa bir süre sonra tekrar deneyin.",
  500: "Sunucuda beklenmeyen bir hata oluştu.",
  502: "API sunucusundan geçerli bir yanıt alınamadı.",
  503: "API servisi şu anda kullanılamıyor.",
  504: "API sunucusu zamanında yanıt vermedi.",
};

export class ApiRequestError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

function getValidationMessages(errors: unknown): string[] {
  if (!Array.isArray(errors)) return [];

  return errors
    .map((detail: ApiErrorDetail | unknown) => {
      if (typeof detail === "string") return detail;
      if (!detail || typeof detail !== "object") return "";
      return typeof (detail as ApiErrorDetail).message === "string"
        ? (detail as ApiErrorDetail).message as string
        : "";
    })
    .filter(Boolean);
}

export async function createApiResponseError(response: Response): Promise<ApiRequestError> {
  let payload: ApiErrorPayload = {};

  try {
    payload = await response.clone().json() as ApiErrorPayload;
  } catch {
    const responseText = await response.text().catch(() => "");
    if (responseText.trim()) payload.message = responseText.trim();
  }

  const primaryMessage =
    typeof payload.message === "string" && payload.message.trim()
      ? payload.message.trim()
      : typeof payload.error === "string" && payload.error.trim()
        ? payload.error.trim()
        : statusMessages[response.status] || `API isteği başarısız oldu (HTTP ${response.status}).`;

  const validationMessages = getValidationMessages(payload.errors)
    .filter((message) => !primaryMessage.includes(message));
  const message = validationMessages.length
    ? `${primaryMessage} ${validationMessages.join(" ")}`
    : primaryMessage;
  const code = typeof payload.code === "string" ? payload.code : undefined;

  return new ApiRequestError(message, response.status, code);
}

export function normalizeApiError(error: unknown): ApiRequestError {
  if (error instanceof ApiRequestError) return error;

  if (error instanceof DOMException && error.name === "AbortError") {
    return new ApiRequestError("API isteği zaman aşımına uğradı. Lütfen tekrar deneyin.");
  }

  const originalMessage = error instanceof Error ? error.message : "";
  const isNetworkError =
    error instanceof TypeError ||
    /load failed|failed to fetch|networkerror|network request failed/i.test(originalMessage);

  if (isNetworkError) {
    return new ApiRequestError(
      "API sunucusuna ulaşılamadı. Bağlantınızı kontrol edin veya servisin çalıştığından emin olun.",
    );
  }

  return new ApiRequestError(
    originalMessage || "İşlem sırasında beklenmeyen bir hata oluştu.",
  );
}

export async function apiRequest(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function readApiJson<T>(response: Response): Promise<T> {
  try {
    return await response.json() as T;
  } catch {
    throw new ApiRequestError(
      "API sunucusundan okunamayan veya eksik bir yanıt alındı.",
      response.status,
    );
  }
}
