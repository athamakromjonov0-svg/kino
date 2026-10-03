import api from './api';

export const sessionService = {
  /**
   * Get seat layout and status for a session
   * GET /sessions/:id/seats
   * @param {string|number} sessionId
   * @returns {Promise<Array<{ row: number, seat: number, taken: boolean }>>}
   */
  async getSessionSeats(sessionId) {
    const response = await api.get(`/sessions/${sessionId}/seats`);
    const resData = response.data;

    // Direct array of seats
    if (Array.isArray(resData)) {
      return resData.map(normalizeSeat);
    }

    // Wrapped in data or seats
    if (Array.isArray(resData?.data)) {
      return resData.data.map(normalizeSeat);
    }

    if (Array.isArray(resData?.seats)) {
      return resData.seats.map(normalizeSeat);
    }

    // If 2D matrix or nested rows
    if (resData?.rows && Array.isArray(resData.rows)) {
      const flattened = [];
      resData.rows.forEach((rowObj, rIdx) => {
        const rowNum = rowObj.row || rIdx + 1;
        const seats = rowObj.seats || [];
        seats.forEach((sObj, sIdx) => {
          flattened.push({
            row: rowNum,
            seat: sObj.seat || sObj.number || sIdx + 1,
            taken: Boolean(sObj.taken ?? sObj.isBooked ?? sObj.booked),
          });
        });
      });
      return flattened;
    }

    return [];
  },
};

/**
 * Normalizes single seat object to standard { row, seat, taken }
 */
function normalizeSeat(s, index) {
  return {
    row: Number(s.row) || 1,
    seat: Number(s.seat ?? s.number ?? s.seatNumber ?? (index + 1)),
    taken: Boolean(s.taken ?? s.isBooked ?? s.booked ?? s.occupied ?? false),
  };
}

export default sessionService;
