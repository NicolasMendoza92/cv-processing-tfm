import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Briefcase,
  GraduationCap,
  Languages,
  Wrench,
  AlertCircle,
} from "lucide-react";
import { CandidateDetails } from "@/types";

interface candidateDetailsDisplayProps {
  data: CandidateDetails;
}

export function ExtractedDataDisplay({ data }: candidateDetailsDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-primary" />
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Nombre Completo
              </p>
              <p className="text-base font-semibold">{data.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base">{data.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Teléfono
              </p>
              <p className="text-base">{data.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="w-5 h-5 text-primary" />
            Experiencia Laboral
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Último Puesto
            </p>
            <p className="text-base font-semibold">{data.lastJob}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Años de Experiencia
            </p>
            <p className="text-base">{data.workExperienceYears} años</p>
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="w-5 h-5 text-primary" />
            Formación Académica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Última Formación
            </p>
            <p className="text-base font-semibold">{data.lastEducation}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Años de Educación Formal
            </p>
            <p className="text-base">{data.formalEducationYears} años</p>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wrench className="w-5 h-5 text-primary" />
            Habilidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Languages className="w-5 h-5 text-primary" />
            Idiomas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.languages.map((lang, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="font-medium">{lang.name}</span>
                <Badge variant="outline">{lang.level}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sensitive Data */}
      <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Datos Adicionales (Inferidos)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Discapacidad
              </p>
              <p className="text-base">{data.disability}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Reclusión Previa
              </p>
              <p className="text-base">{data.previousIncarceration}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
