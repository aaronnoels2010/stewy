import { z } from 'zod';

export const profileSchema = z.object({
  role: z
    .string()
    .trim()
    .min(1, { message: 'profile.validation.required' }),
  kbvbId: z
    .string()
    .trim()
    .min(1, { message: 'profile.validation.required' }),
  clubId: z.string(),
  clubName: z.string(),
}).superRefine((data, ctx) => {
  const hasClubId = data.clubId.length > 0;
  const hasClubName = data.clubName.trim().length > 0;

  if (!hasClubId && !hasClubName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'profile.validation.required',
      path: ['clubId'],
    });
  }

  if (hasClubName && data.role !== 'HOOFD_STEWARD') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'profile.validation.clubNameOnlyForHoofdSteward',
      path: ['clubName'],
    });
  }
});

export type ProfileFormData = z.infer<typeof profileSchema>;
