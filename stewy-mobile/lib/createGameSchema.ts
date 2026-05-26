import { z } from 'zod';

export const createGameSchema = z.object({
  awayTeamId: z.string().min(1, { message: 'createGame.validation.awayTeamRequired' }),
  appointment: z.date({ message: 'createGame.validation.invalidDate' }),
  deadline: z.date({ message: 'createGame.validation.invalidDate' }),
  location: z.string().trim().min(1, { message: 'createGame.validation.locationRequired' }),
  accessibility: z.string().optional().default(''),
}).superRefine((data, ctx) => {
  if (data.deadline <= new Date()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'createGame.validation.deadlineMustBeFuture', path: ['deadline'] });
  }
  if (data.appointment <= data.deadline) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'createGame.validation.appointmentAfterDeadline', path: ['appointment'] });
  }
  if (data.appointment <= new Date()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'createGame.validation.appointmentMustBeFuture', path: ['appointment'] });
  }
});

export type CreateGameFormData = z.infer<typeof createGameSchema>;
