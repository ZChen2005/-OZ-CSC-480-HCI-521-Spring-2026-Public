import * as z from "zod";

export const taskSchema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  mainGoal: z.string().min(1, "Main goal is required"),
  collaborators: z.string(),
  deadline: z.string().min(1, "Deadline is required"),
  completion: z.enum(["not-started", "in-progress", "complete"], {
    required_error: "Select completion status",
  }),
  reflection: z
    .string()
    .min(1, "Reflection is required")
    .max(500, "Reflection must be at most 500 characters."),
});

export const workLogPostSchema = z.object({
  tasks: z.array(taskSchema).min(1, "At least one task is required"),
});

export type workLogPostType = z.infer<typeof workLogPostSchema>;
