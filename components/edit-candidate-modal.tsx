// components/edit-candidate-modal.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CandidateDataExtended,
  EducationItem,
  ExperienceItem,
  LanguageItem,
} from "@/types";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface EditCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateDataExtended | null;
  onEdit: (id: string, data: CandidateDataExtended) => Promise<void>;
}

export function EditCandidateModal({
  isOpen,
  onClose,
  candidate,
  onEdit,
}: EditCandidateModalProps) {
  const [formData, setFormData] = useState<CandidateDataExtended | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (candidate) {
      setFormData({
        ...candidate,
      });
    } else {
      setFormData(null);
    }
  }, [candidate, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      const parsedData: CandidateDataExtended = {
        ...formData,
      };

      await onEdit(candidate.id, parsedData);
      toast.success("Candidato actualizado exitosamente.");
      onClose(); // Cerrar modal al guardar
    } catch (error: any) {
      console.error("Error al guardar cambios:", error);
      toast.error(
        `Error al actualizar candidato: ${
          error.message || "Error desconocido."
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) return null;

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { title: "", company: "", years: 0 },
      ],
    });
  };

  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index),
    });
  };

  const updateExperience = (
    index: number,
    field: keyof ExperienceItem,
    value: any
  ) => {
    const newExperience = [...formData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setFormData({ ...formData, experience: newExperience });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { degree: "", institution: "", year: undefined },
      ],
    });
  };

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const updateEducation = (
    index: number,
    field: keyof EducationItem,
    value: any
  ) => {
    const newEducation = [...formData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setFormData({ ...formData, education: newEducation });
  };

  const addLanguage = () => {
    setFormData({
      ...formData,
      languages: [...formData.languages, { name: "", level: "" }],
    });
  };

  const removeLanguage = (index: number) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index),
    });
  };

  const updateLanguage = (
    index: number,
    field: keyof LanguageItem,
    value: string
  ) => {
    const newLanguages = [...formData.languages];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    setFormData({ ...formData, languages: newLanguages });
  };

  const addSkill = () => {
    setNewSkill("");
    setIsSkillDialogOpen(true);
  };

  const handleConfirmAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) {
      setIsSkillDialogOpen(false);
      return;
    }

    setFormData({
      ...formData,
      skills: [...formData.skills, trimmed],
    });
    setIsSkillDialogOpen(false);
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Datos del Candidato</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="h-[calc(95vh-180px)] pr-4">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Información Personal</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        age: Number.parseInt(e.target.value) || null,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Género</Label>
                  <Select
                    value={formData.gender || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="h">Masculino</SelectItem>
                      <SelectItem value="m">Femenino</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maritalStatus">Estado Civil</Label>
                  <Select
                    value={formData.maritalStatus || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, maritalStatus: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soltero">Soltero/a</SelectItem>
                      <SelectItem value="casado">Casado/a</SelectItem>
                      <SelectItem value="divorciado">Divorciado/a</SelectItem>
                      <SelectItem value="viudo">Viudo/a</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="birthCountry">País de Nacimiento</Label>
                  <Input
                    id="birthCountry"
                    value={formData.birthCountry || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, birthCountry: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="numChildren">Número de Hijos</Label>
                  <Input
                    id="numChildren"
                    type="number"
                    value={formData.numChildren || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        numChildren: Number.parseInt(e.target.value) || null,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Experience */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Experiencia Laboral</h3>
                <Button  type="button" size="sm" variant="outline" onClick={addExperience}>
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </Button>
              </div>
              {formData.experience?.map((exp, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg space-y-3 relative"
                >
                  <Button
                   type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => removeExperience(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-2 gap-3 pr-10">
                    <div>
                      <Label>Cargo</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) =>
                          updateExperience(index, "title", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Empresa</Label>
                      <Input
                        value={exp.company || ""}
                        onChange={(e) =>
                          updateExperience(index, "company", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Años de Experiencia</Label>
                      <Input
                        type="number"
                        value={exp.years || 1}
                        onChange={(e) =>
                          updateExperience(
                            index,
                            "years",
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Education */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Educación</h3>
                <Button  type="button" size="sm" variant="outline" onClick={addEducation}>
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </Button>
              </div>
              {formData.education.map((edu, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg space-y-3 relative"
                >
                  <Button
                   type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => removeEducation(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-2 gap-3 pr-10">
                    <div>
                      <Label>Título/Grado</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(index, "degree", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Institución</Label>
                      <Input
                        value={edu.institution || ""}
                        onChange={(e) =>
                          updateEducation(index, "institution", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Año</Label>
                      <Input
                        type="number"
                        value={edu.year || ""}
                        onChange={(e) =>
                          updateEducation(
                            index,
                            "year",
                            Number.parseInt(e.target.value) || undefined
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Languages */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Idiomas</h3>
                <Button  type="button" size="sm" variant="outline" onClick={addLanguage}>
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </Button>
              </div>
              {formData.languages.map((lang, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg space-y-3 relative"
                >
                  <Button
                   type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => removeLanguage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-2 gap-3 pr-10">
                    <div>
                      <Label>Idioma</Label>
                      <Input
                        value={lang.name}
                        onChange={(e) =>
                          updateLanguage(index, "name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Nivel</Label>
                      <Input
                        value={lang.level || ""}
                        onChange={(e) =>
                          updateLanguage(index, "level", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Skills */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Habilidades</h3>
                <Button  type="button" size="sm" variant="outline" onClick={addSkill}>
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {skill}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeSkill(index)}
                    >
                      <X />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Información Adicional</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="disability">Discapacidad</Label>
                  <Input
                    id="disability"
                    value={formData.disability || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, disability: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="previousIncarceration">
                    Reclusión Previa
                  </Label>
                  <Input
                    id="previousIncarceration"
                    value={formData.previousIncarceration || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        previousIncarceration: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="trainingProfile">Perfil de Formación</Label>
                  <Input
                    id="trainingProfile"
                    value={formData.trainingProfile || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trainingProfile: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasCar"
                    checked={formData.hasCar || false}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, hasCar: checked as boolean })
                    }
                  />
                  <Label htmlFor="hasCar">Tiene Vehículo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="criminalRecord"
                    checked={formData.criminalRecord || false}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        criminalRecord: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="criminalRecord">
                    Tiene Antecedentes Penales
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="restrainingOrder"
                    checked={formData.restrainingOrder || false}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        restrainingOrder: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="restrainingOrder">
                    Tiene Orden de Alejamiento
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="workDisability"
                    checked={formData.workDisability || false}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        workDisability: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="workDisability">Discapacidad Laboral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="disabilityFlag"
                    checked={formData.disabilityFlag || false}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        disabilityFlag: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="disabilityFlag">
                    Indicador de Discapacidad
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="jobSeeker"
                    checked={formData.jobSeeker || false}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        jobSeeker: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="jobSeeker">Buscando Empleo Activamente</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="summary">Resumen / Perfil</Label>
                <Textarea
                  id="summary"
                  value={formData.summary || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="weaknesses">
                  Debilidades / Áreas de Mejora
                </Label>
                <Textarea
                  id="weaknesses"
                  value={formData.weaknesses || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, weaknesses: e.target.value })
                  }
                  rows={2}
                />
              </div>
            </div>
          </div>

          <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Agregar habilidad</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <Label htmlFor="newSkill">Nombre de la habilidad</Label>
                <Input
                  id="newSkill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Ej: Atención al cliente"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsSkillDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="button" onClick={handleConfirmAddSkill}>
                  Añadir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
