import { profileSchema } from '../profileSchema';

describe('profileSchema', () => {
  it('accepts STEWARD with clubId', () => {
    const result = profileSchema.safeParse({
      role: 'STEWARD',
      kbvbId: 'KBVB-12345',
      clubId: 'some-uuid',
      clubName: '',
    });
    expect(result.success).toBe(true);
  });

  it('accepts HOOFD_STEWARD with clubName', () => {
    const result = profileSchema.safeParse({
      role: 'HOOFD_STEWARD',
      kbvbId: 'KBVB-12345',
      clubId: '',
      clubName: 'My Club',
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-HoofdSteward with clubName', () => {
    const result = profileSchema.safeParse({
      role: 'STEWARD',
      kbvbId: 'KBVB-12345',
      clubId: '',
      clubName: 'My Club',
    });
    expect(result.success).toBe(false);
  });

  it('accepts HOOFD_STEWARD with clubId', () => {
    const result = profileSchema.safeParse({
      role: 'HOOFD_STEWARD',
      kbvbId: 'KBVB-12345',
      clubId: 'existing-club-uuid',
      clubName: '',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty role', () => {
    const result = profileSchema.safeParse({
      role: '',
      kbvbId: 'KBVB-12345',
      clubId: 'some-uuid',
      clubName: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty kbvbId', () => {
    const result = profileSchema.safeParse({
      role: 'STEWARD',
      kbvbId: '',
      clubId: 'some-uuid',
      clubName: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects when neither clubId nor clubName provided', () => {
    const result = profileSchema.safeParse({
      role: 'STEWARD',
      kbvbId: 'KBVB-12345',
      clubId: '',
      clubName: '',
    });
    expect(result.success).toBe(false);
  });

  it('accepts HOOFD_STEWARD with both clubId and clubName', () => {
    const result = profileSchema.safeParse({
      role: 'HOOFD_STEWARD',
      kbvbId: 'KBVB-12345',
      clubId: 'some-uuid',
      clubName: 'My Club',
    });
    expect(result.success).toBe(true);
  });

  it('rejects HOOFD_STEWARD with neither clubId nor clubName', () => {
    const result = profileSchema.safeParse({
      role: 'HOOFD_STEWARD',
      kbvbId: 'KBVB-12345',
      clubId: '',
      clubName: '',
    });
    expect(result.success).toBe(false);
  });

  it('trims whitespace from role and kbvbId', () => {
    const result = profileSchema.safeParse({
      role: '  STEWARD  ',
      kbvbId: '  KBVB-123  ',
      clubId: 'some-uuid',
      clubName: '',
    });
    expect(result.success).toBe(true);
  });
});
