import { createGameSchema } from '../createGameSchema';

describe('createGameSchema', () => {
  const validData = {
    awayTeamId: 'club-123',
    appointment: new Date('2026-06-15T14:00:00'),
    deadline: new Date('2026-06-10T12:00:00'),
    location: 'Stadium A',
    accessibility: '',
  };

  it('accepts valid game data', () => {
    const result = createGameSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects empty awayTeamId', () => {
    const result = createGameSchema.safeParse({ ...validData, awayTeamId: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('awayTeamId'))).toBe(true);
    }
  });

  it('rejects invalid appointment date', () => {
    const result = createGameSchema.safeParse({ ...validData, appointment: new Date('invalid') });
    expect(result.success).toBe(false);
  });

  it('rejects invalid deadline date', () => {
    const result = createGameSchema.safeParse({ ...validData, deadline: new Date('invalid') });
    expect(result.success).toBe(false);
  });

  it('rejects empty location', () => {
    const result = createGameSchema.safeParse({ ...validData, location: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('location'))).toBe(true);
    }
  });

  it('trims whitespace from location', () => {
    const result = createGameSchema.safeParse({ ...validData, location: '   ' });
    expect(result.success).toBe(false);
  });

  it('rejects deadline in the past', () => {
    const result = createGameSchema.safeParse({
      ...validData,
      deadline: new Date('2020-01-01T00:00:00'),
      appointment: new Date('2026-06-15T14:00:00'),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('deadline') && i.message === 'createGame.validation.deadlineMustBeFuture')).toBe(true);
    }
  });

  it('rejects appointment before deadline', () => {
    const result = createGameSchema.safeParse({
      ...validData,
      deadline: new Date('2026-06-20T12:00:00'),
      appointment: new Date('2026-06-15T14:00:00'),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('appointment') && i.message === 'createGame.validation.appointmentAfterDeadline')).toBe(true);
    }
  });

  it('rejects appointment in the past', () => {
    const result = createGameSchema.safeParse({
      ...validData,
      appointment: new Date('2020-06-15T14:00:00'),
      deadline: new Date('2020-06-10T12:00:00'),
    });
    expect(result.success).toBe(false);
  });

  it('defaults accessibility to empty string', () => {
    const { accessibility, ...rest } = validData;
    const result = createGameSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.accessibility).toBe('');
    }
  });
});
