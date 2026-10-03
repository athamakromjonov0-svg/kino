/**
 * Centralized API Error Handler
 * Formats API errors into clean, user-friendly messages for toasts and alerts.
 */

export const getErrorMessage = (error) => {
  if (!error) return "Kutilmagan xatolik yuz berdi.";

  // Agar oddiy string bo'lsa
  if (typeof error === "string") return error;

  // Agar tarmoq xatosi bo'lsa (server o'chiq, internet yo'q)
  if (error.code === "ERR_NETWORK" || (!error.response && error.request)) {
    return "Server bilan aloqa o'rnatib bo'lmadi. Iltimos, internet aloqasi yoki backend serverini tekshiring.";
  }

  // Server javob qaytargan bo'lsa
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    // Backend yuborgan message bo'lsa, avvalo uni tekshiramiz
    const serverMessage = data?.message || data?.error || (typeof data === "string" ? data : null);

    switch (status) {
      case 400:
        return serverMessage || "Noto'g'ri so'rov yuborildi. Iltimos, ma'lumotlarni tekshiring.";
      case 401:
        return serverMessage || "Autentifikatsiyadan o'tilmagan yoki sessiya muddati tugagan.";
      case 403:
        return serverMessage || "Ushbu amalni bajarish uchun sizda yetarli ruxsat yo'q.";
      case 404:
        return serverMessage || "So'ralgan ma'lumot yoki sahifa topilmadi.";
      case 409:
        return serverMessage || "Ushbu ma'lumot allaqachon mavjud yoki tanlangan joy band qilingan.";
      case 500:
        return serverMessage || "Serverda ichki xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring.";
      default:
        return serverMessage || `Xatolik yuz berdi (Status kodi: ${status})`;
    }
  }

  return error.message || "Noma'lum xatolik yuz berdi.";
};

/**
 * Check if error is an authentication error (401)
 */
export const isAuthError = (error) => {
  return error?.response?.status === 401;
};

/**
 * Check if error is a conflict error (409)
 */
export const isConflictError = (error) => {
  return error?.response?.status === 409;
};
