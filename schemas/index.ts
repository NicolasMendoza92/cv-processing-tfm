import { z } from 'zod';

export const experienceItemSchema = z.object({
  title: z.string().min(1, "El título del puesto es requerido."),
  years: z.number().min(0, "Los años de experiencia no pueden ser negativos.").optional().nullable(),
  // Si usaras startDate/endDate como mencioné antes:
  // startDate: z.string().datetime(),
  // endDate: z.string().datetime().nullable().optional(),
});

export const educationItemSchema = z.object({
  degree: z.string().min(1, "El grado o título es requerido."),
  year: z.number().int().positive("El año de educación debe ser un número positivo.").optional().nullable(),
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
  employabilityScore: z.number().min(0).max(100, "La puntuación debe ser entre 0 y 100."),
  topRecommendations: z.array(z.string()).default([]),
  lastProcessed: z.string().refine(
    (val) => !isNaN(new Date(val).getTime()),
    "Formato de fecha y hora inválido."
  ),
  areasForDevelopment: z.array(z.string()).optional(),
  interviewQuestions: z.array(z.string()).optional(),
  cvFileName: z.string().optional(),
});
