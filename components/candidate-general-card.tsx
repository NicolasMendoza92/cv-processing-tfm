"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  GraduationCap,
  Languages as LanguagesIcon,
  Mail,
  MapIcon,
  Phone,
  User,
  User2Icon,
  UserCircle,
  Users,
} from "lucide-react";
import type { CandidateDetails } from "@/types";
import { getGender, getMaritalStatusByGender } from "@/utils";

type Props = {
  candidate: CandidateDetails;
};

export function CandidateGeneralInfoCard({ candidate }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Información General del Candidato
        </CardTitle>
        <CardDescription>
          Datos extraídos del CV mediante procesamiento de lenguaje natural
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contacto + datos personales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span className="font-medium">Email</span>
            </div>
            <p className="text-sm text-foreground pl-6">{candidate.email}</p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User2Icon className="w-4 h-4" />
              <span className="font-medium">Edad</span>
            </div>
            <p className="text-sm text-foreground pl-6">{candidate.age}</p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapIcon className="w-4 h-4" />
              <span className="font-medium">País</span>
            </div>
            <p className="text-sm text-foreground pl-6">
              {candidate.birthCountry}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span className="font-medium">Teléfono</span>
            </div>
            <p className="text-sm text-foreground pl-6">{candidate.phone}</p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCircle className="w-4 h-4" />
              <span className="font-medium">Sexo</span>
            </div>
            <p className="text-sm text-foreground pl-6">
              {getGender(candidate.gender)}
            </p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="font-medium">Estado civil</span>
            </div>
            <p className="text-sm text-foreground pl-6">
              {getMaritalStatusByGender(
                candidate.maritalStatus,
                candidate.gender
              )}
            </p>
          </div>
        </div>

        <Separator />

        {/* Work */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Briefcase className="w-4 h-4" />
            Último Puesto de Trabajo
          </div>
          <p className="text-sm text-foreground pl-6">
            {candidate.lastJob}
          </p>
          <p className="text-xs text-muted-foreground pl-6">
            Experiencia laboral: {candidate.workExperienceYears}{" "}
            {candidate.workExperienceYears === 1 ? "año" : "años"}
          </p>
        </div>

        <Separator />

        {/* Education */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <GraduationCap className="w-4 h-4" />
            Última Formación Académica
          </div>
          <p className="text-sm text-foreground pl-6">
            {candidate.lastEducation}
          </p>
          <p className="text-xs text-muted-foreground pl-6">
            Años de educación formal: {candidate.formalEducationYears}
          </p>
        </div>

        <Separator />

        {/* Skills */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Habilidades Clave
          </h4>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Languages */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <LanguagesIcon className="w-4 h-4" />
            Idiomas
          </div>
          <div className="flex flex-wrap gap-2">
            {candidate.languages.map((lang, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-3 py-1"
              >
                {lang.name} - {lang.level}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
