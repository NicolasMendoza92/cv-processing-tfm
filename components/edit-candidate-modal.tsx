// components/edit-candidate-modal.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CandidateExtractedData } from "@/types" 
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface EditCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateExtractedData | null;
  onSave: (id: string, data: CandidateExtractedData) => Promise<void>;
}

export function EditCandidateModal({ isOpen, onClose, candidate, onSave }: EditCandidateModalProps) {
  const [formData, setFormData] = useState<CandidateExtractedData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (candidate) {
      setFormData({
        ...candidate,
        experience: JSON.stringify(candidate.experience, null, 2) as any,
        education: JSON.stringify(candidate.education, null, 2) as any,
        languages: JSON.stringify(candidate.languages, null, 2) as any,
      });
    } else {
      setFormData(null);
    }
  }, [candidate, isOpen]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      if (!prev) return null;

      if (name === "employabilityScore" && type === "number") {
        return { ...prev, [name]: parseFloat(value) || 0 };
      }
      // Otros campos de texto normales
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !candidate) return;

    setIsSubmitting(true);
    try {
      const parsedData: CandidateExtractedData = {
        ...formData,
        experience: JSON.parse(formData.experience as any),
        education: JSON.parse(formData.education as any),
        languages: JSON.parse(formData.languages as any),
      };

      await onSave(candidate.id, parsedData);
      toast.success("Candidato actualizado exitosamente.");
      onClose(); // Cerrar modal al guardar
    } catch (error: any) {
      console.error("Error al guardar cambios:", error);
      toast.error(`Error al actualizar candidato: ${error.message || "Error desconocido."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) return null; 

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Datos del Candidato</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Fila 1: Nombre, Email */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email ?? ""} onChange={handleChange} />
          </div>

          {/* Fila 2: Teléfono, Employability Score */}
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" name="phone" value={formData.phone ?? ""} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employabilityScore">Puntuación Empleabilidad</Label>
            <Input
              id="employabilityScore"
              name="employabilityScore"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.employabilityScore}
              onChange={handleChange}
            />
          </div>

          {/* Fila 3: CV File Name, Last Processed */}
          <div className="space-y-2">
            <Label htmlFor="cvFileName">Nombre del CV</Label>
            <Input id="cvFileName" name="cvFileName" value={formData.cvFileName ?? ""} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastProcessed">Último Procesado (ISO String)</Label>
            <Input id="lastProcessed" name="lastProcessed" value={formData.lastProcessed} onChange={handleChange} required />
          </div>

          {/* Fila de campos JSON */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="experience">Experiencia (JSON)</Label>
            <Textarea
              id="experience"
              name="experience"
              value={formData.experience as any} // Usa "as any" aquí también
              onChange={handleChange}
              rows={6}
              className="font-mono text-xs"
            />
            <p className="text-muted-foreground text-sm">Edita la experiencia como un array JSON.`</p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="education">Educación (JSON)</Label>
            <Textarea
              id="education"
              name="education"
              value={formData.education as any}
              onChange={handleChange}
              rows={6}
              className="font-mono text-xs"
            />
            <p className="text-muted-foreground text-sm">Edita la educación como un array JSON. </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="languages">Idiomas (JSON)</Label>
            <Textarea
              id="languages"
              name="languages"
              value={formData.languages as any}
              onChange={handleChange}
              rows={4}
              className="font-mono text-xs"
            />
            <p className="text-muted-foreground text-sm">Edita los idiomas como un array JSON.</p>
          </div>
          
          {/* Otros campos de texto/arrays */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="skills">Habilidades (separadas por coma)</Label>
            <Textarea
              id="skills"
              name="skills"
              value={Array.isArray(formData.skills) ? formData.skills.join(', ') : ''}
              onChange={(e) => setFormData(prev => prev ? { ...prev, skills: e.target.value.split(',').map(s => s.trim()) } : null)}
              rows={3}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="areasForDevelopment">Áreas de Desarrollo (separadas por coma)</Label>
            <Textarea
              id="areasForDevelopment"
              name="areasForDevelopment"
              value={Array.isArray(formData.areasForDevelopment) ? formData.areasForDevelopment.join(', ') : ''}
              onChange={(e) => setFormData(prev => prev ? { ...prev, areasForDevelopment: e.target.value.split(',').map(s => s.trim()) } : null)}
              rows={3}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="interviewQuestions">Preguntas de Entrevista (separadas por coma)</Label>
            <Textarea
              id="interviewQuestions"
              name="interviewQuestions"
              value={Array.isArray(formData.interviewQuestions) ? formData.interviewQuestions.join(', ') : ''}
              onChange={(e) => setFormData(prev => prev ? { ...prev, interviewQuestions: e.target.value.split(',').map(s => s.trim()) } : null)}
              rows={3}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="summary">Resumen</Label>
            <Textarea id="summary" name="summary" value={formData.summary ?? ""} onChange={handleChange} rows={5} />
          </div>

           <div className="space-y-2">
            <Label htmlFor="disability">Discapacidad</Label>
            <Input id="disability" name="disability"  type="text" value={formData.disability ?? ""} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="previousIncarceration">Reculusión Previa</Label>
            <Input id="previousIncarceration" name="previousIncarceration" type="text" value={formData.previousIncarceration ?? ""} onChange={handleChange} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="rawText">Texto Crudo del CV</Label>
            <Textarea id="rawText" name="rawText" value={formData.rawText ?? ""} onChange={handleChange} rows={10} className="font-mono text-xs" />
          </div>
         
          <DialogFooter className="md:col-span-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}