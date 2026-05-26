import {
  formatDateForDisplay,
  formatTimeForDisplay,
  formatDateForApi,
  parseDisplayDate,
  parseDisplayTime,
} from '../dateUtils';

describe('dateUtils', () => {
  describe('formatDateForDisplay', () => {
    it('formats a normal date to dd-MM-yyyy', () => {
      const d = new Date(2025, 0, 15);
      expect(formatDateForDisplay(d)).toBe('15-01-2025');
    });

    it('pads single-digit day and month', () => {
      const d = new Date(2025, 2, 5);
      expect(formatDateForDisplay(d)).toBe('05-03-2025');
    });

    it('handles leap year date', () => {
      const d = new Date(2024, 1, 29);
      expect(formatDateForDisplay(d)).toBe('29-02-2024');
    });
  });

  describe('formatTimeForDisplay', () => {
    it('formats time to HH:mm', () => {
      const d = new Date(2025, 0, 15, 14, 30);
      expect(formatTimeForDisplay(d)).toBe('14:30');
    });

    it('pads single-digit hour and minute', () => {
      const d = new Date(2025, 0, 15, 9, 5);
      expect(formatTimeForDisplay(d)).toBe('09:05');
    });

    it('handles midnight', () => {
      const d = new Date(2025, 0, 15, 0, 0);
      expect(formatTimeForDisplay(d)).toBe('00:00');
    });
  });

  describe('formatDateForApi', () => {
    it('formats to yyyy-MM-dd HH:mm', () => {
      const d = new Date(2025, 0, 15, 14, 30);
      expect(formatDateForApi(d)).toBe('2025-01-15 14:30');
    });

    it('handles end of month', () => {
      const d = new Date(2025, 11, 31, 23, 59);
      expect(formatDateForApi(d)).toBe('2025-12-31 23:59');
    });
  });

  describe('parseDisplayDate', () => {
    it('parses dd-MM-yyyy to Date', () => {
      const result = parseDisplayDate('15-01-2025');
      expect(result).not.toBeNull();
      expect(result!.getFullYear()).toBe(2025);
      expect(result!.getMonth()).toBe(0);
      expect(result!.getDate()).toBe(15);
    });

    it('returns null for invalid format', () => {
      expect(parseDisplayDate('not-a-date')).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(parseDisplayDate('')).toBeNull();
    });

    it('returns null for impossible date', () => {
      expect(parseDisplayDate('32-01-2025')).toBeNull();
    });
  });

  describe('parseDisplayTime', () => {
    it('parses HH:mm to Date', () => {
      const result = parseDisplayTime('14:30');
      expect(result).not.toBeNull();
      expect(result!.getHours()).toBe(14);
      expect(result!.getMinutes()).toBe(30);
    });

    it('returns null for invalid format', () => {
      expect(parseDisplayTime('abc')).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(parseDisplayTime('')).toBeNull();
    });

    it('returns null for out-of-range values', () => {
      expect(parseDisplayTime('25:00')).toBeNull();
    });
  });
});
