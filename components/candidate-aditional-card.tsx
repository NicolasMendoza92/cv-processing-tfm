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
import { User } from "lucide-react";
import type { CandidateDetails } from "@/types";
import { getYesNo } from "@/utils";

type Props = {
  candidate: CandidateDetails;
};

export function CandidateAdditionalDataCard({ candidate }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Datos Adicionales del Candidato
        </CardTitle>
        <CardDescription>
          Datos exclusivos para el análisis y negocio
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Discapacidad / Reclusión */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">Discapacidad:</span>
              <Badge
                variant={
                  candidate.disability === "Sí" ? "destructive" : "default"
                }
              >
                {candidate.disability}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">
                Situación de reclusión previa:
              </span>
              <Badge
                variant={
                  candidate.previousIncarceration === "Sí"
                    ? "default"
                    : "destructive"
                }
              >
                {candidate.previousIncarceration}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Coche / Antecedentes */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">Coche:</span>
              <Badge
                variant={
                  candidate.hasCar === true ? "default" : "destructive"
                }
              >
                {getYesNo(candidate.hasCar)}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">Antecedentes:</span>
              <Badge
                variant={
                  candidate.criminalRecord === false
                    ? "success"
                    : "destructive"
                }
              >
                {getYesNo(candidate.criminalRecord)}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Orden / Demandante empleo */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">
                Orden de alejamiento:
              </span>
              <Badge
                variant={
                  candidate.restrainingOrder === false
                    ? "success"
                    : "destructive"
                }
              >
                {getYesNo(candidate.restrainingOrder)}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">
                Demandante de empleo:
              </span>
              <Badge
                variant={
                  candidate.jobSeeker === true ? "default" : "destructive"
                }
              >
                {getYesNo(candidate.jobSeeker)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
