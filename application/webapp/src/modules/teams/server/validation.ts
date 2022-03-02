import { z } from "zod";
import { PLAN_PRICE_IDS } from "../../billing/plans";
import { getTeamById } from "./db";

export const emailSchema = z.string().email();

export const teamNameSchema = z
  .string({
    required_error: "Name is required.",
    invalid_type_error: "Name must be a string.",
  })
  .max(100, {
    message: "Team name must be no greater than 100 characters in length.",
  })
  .nonempty({ message: "Team name must not be empty." })
  .regex(/^[a-zA-Z0-9-_]+$/, {
    message:
      "Name must consist of only alphanumerics characters, underscores, and/or hyphens.",
  });

export const teamIdIsAvailable = async (id: string) => {
  const team = await getTeamById(id);
  let restrictedIds = ["new"];

  if (team) {
    restrictedIds.push(id);
    const newTeamNameSchema = teamNameSchema.refine(
      (s) => !restrictedIds.includes(s),
      {
        message: "Name is unavailable.",
      }
    );
    return newTeamNameSchema.parse(id);
  }
  return teamNameSchema
    .refine((s) => !restrictedIds.includes(s), {
      message: "Name is unavailable.",
    })
    .parse(id);
};

export const teamCreationInputSchema = z.object({
  id: teamNameSchema,
  plan: z
    .string({
      required_error: "Plan is required.",
    })
    .refine(
      (s) => {
        return [
          PLAN_PRICE_IDS.MONTHLY.PRO,
          PLAN_PRICE_IDS.MONTHLY.BUSINESS,
          PLAN_PRICE_IDS.ANNUAL.BUSINESS,
          PLAN_PRICE_IDS.MONTHLY.PRO,
        ].includes(s);
      },
      { message: "Invalid plan." }
    ),
});
