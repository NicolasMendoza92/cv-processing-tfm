import { z } from "zod";

export const experienceItemSchema = z.object({
  title: z.string().min(1, "El título del puesto es requerido."),
  years: z
    .number()
    .min(0, "Los años de experiencia no pueden ser negativos.")
    .optional()
    .nullable(),
  company: z.string().optional().nullable(),
});

export const educationItemSchema = z.object({
  degree: z.string().min(1, "El grado o título es requerido."),
  year: z
    .number()
    .int()
    .positive("El año de educación debe ser un número positivo.")
    .optional()
    .nullable(),
  institution: z.string().optional().nullable(),
});

export const languageItemSchema = z.object({
  name: z.string().min(1, "El nombre del idioma es requerido."),
  level: z.string().min(1, "El nivel del idioma es requerido."),
});

export const candidateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  email: z.string().email("Formato de email inválido.").optional().nullable(),
  phone: z.string().optional().nullable(),
  experience: z.array(experienceItemSchema).default([]),
  education: z.array(educationItemSchema).default([]),
  languages: z.array(languageItemSchema).default([]),
  skills: z.array(z.string()),
  disability: z.string().optional().nullable(),
  previousIncarceration: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  rawText: z.string().optional().nullable(),
  gender: z.enum(["m", "h", "otro"]).optional().nullable(),
  age: z
    .number()
    .int()
    .min(16, "Edad mínima razonable 16.")
    .max(80, "Edad máxima razonable 80.")
    .optional()
    .nullable(),
  maritalStatus: z
    .enum(["soltero", "casado", "divorciado", "viudo", "otro"])
    .optional()
    .nullable(),
  birthCountry: z.string().optional().nullable(),
  numLanguages: z.number().int().min(0).optional().nullable(),
  hasCar: z.boolean().default(false).nullable(),
  criminalRecord: z.boolean().default(false).nullable(),
  restrainingOrder: z.boolean().default(false).nullable(),
  numChildren: z.number().int().min(0).optional().nullable(),
  workDisability: z.boolean().default(false).nullable(),
  disabilityFlag: z.boolean().default(false).nullable(), 
  jobSeeker: z.boolean().default(false).nullable(),
  weaknesses: z.string().optional().nullable(),
  trainingProfile: z.string().optional().nullable(),
  employabilityScore: z
    .number()
    .min(0)
    .max(1, "La puntuación debe ser entre 0 y 1."),
  topRecommendations: z.array(z.string()).default([]),
  lastProcessed: z
    .string()
    .refine(
      (val) => !isNaN(new Date(val).getTime()),
      "Formato de fecha y hora inválido."
    ),
  areasForDevelopment: z.array(z.string()).optional(),
  interviewQuestions: z.array(z.string()).optional(),
  cvFileName: z.string().optional(),
});

// export const offerSchema = z.object({
//   puesto: z.string().min(3, "El puesto debe tener al menos 3 caracteres"),
//   categoria: z.string().optional(),
//   empresa: z.string().optional(),
//   descripcion: z.string().max(500, "La descripción no puede superar 500 caracteres").optional(),
//   activo: z.boolean().default(true),
//   fechaInicio: z.date().nullable(),
//   fechaFin: z.date().nullable(),
// })


export const offerSchema = z.object({
  puesto: z.string().min(3, "El puesto debe tener al menos 3 caracteres"),
  categoria: z.string().optional(),
  empresa: z.string().optional(),
  descripcion: z
    .string()
    .max(500, "La descripción no puede superar 500 caracteres")
    .optional(),
  activo: z.boolean().default(true),
  fechaInicio: z.coerce.date().nullable(),
  fechaFin: z.coerce.date().nullable(),
});
