import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Briefcase,
  Wrench,
  AlertCircle,
  ChartLine,
  Quote,
  Target,
} from "lucide-react";
import { CandidateDetails } from "@/types";
import { cn } from "@/lib/utils";
import { getScoreColor } from "@/utils";

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
            Información rapida
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
                Probabilidad de conseguir empleo
              </p>
               <span className={cn("text-xl font-bold", getScoreColor(data.employabilityScore))}>{((data.employabilityScore)*100).toFixed(0)}%</span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Empleabilidad{" "}
              </p>
              <Badge
                className="mt-2"
                variant={data.isAptForEmployment ? "default" : "destructive"}
              >
                {data.isAptForEmployment ? "APTO" : "NO APTO"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="w-5 h-5 text-primary" />
            Experiencia del candidato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </CardContent>
      </Card>

              <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Puestos de Trabajo Recomendados
            </CardTitle>
            <CardDescription>
              Basado en el perfil del candidato, estos son los roles que mejor
              se ajustan a sus habilidades y experiencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.topRecommendations && data.topRecommendations?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.topRecommendations.map((job, index) => (
                  <div key={index} className="p-3 border rounded">
                    {job}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wrench className="w-5 h-5 text-primary" />
            Cualidades a trabajar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.developmentRecommendations.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Quote className="w-5 h-5 text-primary" />
            Preguntas sugueridas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.interviewQuestions.map((quest, index) => (
              <div key={index} className="flex items-center justify-between">
                <Badge variant="outline">{quest}</Badge>
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
            Datos Adicionales
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
