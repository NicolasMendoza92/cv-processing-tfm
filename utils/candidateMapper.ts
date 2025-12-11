

import { CandidateDetails, CandidateExtractedData } from "@/types";

export function mapCandidateExtractedDataToDetails(
  data: CandidateExtractedData
): CandidateDetails {
  const lastJob = data.experience.length > 0
    ? data.experience[data.experience.length - 1].title
    : 'No especificado';

  const lastEducation = data.education.length > 0
    ? data.education[data.education.length - 1].degree
    : 'No especificado';

  const workExperienceYears = data.experience.reduce((sum, item) => sum + (item.years ?? 0), 0);

  const formalEducationYears = data.education.length > 0
    ? data.education.filter(edu => edu.year !== null && edu.year !== undefined).length 
    : 0;

  const isAptForEmployment = data.employabilityScore > 0.5; 

  return {
    id: data.id,
    name: data.name,
    email: data.email ?? 'N/A', 
    phone: data.phone ?? 'N/A', 
    lastJob: lastJob,
    lastEducation: lastEducation,
    skills: data.skills,
    languages: data.languages,
    disability: data.disability ?? 'No especificado', 
    previousIncarceration: data.previousIncarceration ?? 'No especificado', 
    formalEducationYears: formalEducationYears,
    workExperienceYears: workExperienceYears,
    employabilityScore: data.employabilityScore,
    isAptForEmployment: isAptForEmployment,
    topRecomendations: data.topRecommendations,
    interviewQuestions: data.interviewQuestions ?? [],
    developmentRecommendations: data.areasForDevelopment,
    cvFileName: data.cvFileName ?? 'Sin archivo CV', 
  };
}