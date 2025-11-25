import { CVUploadSection } from "@/components/cv-upload-section"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
          Sistema de Gestión de Empleabilidad
        </h1>
        <p className="text-muted-foreground text-lg text-pretty">Plataforma para fundaciones de inclusión social</p>
      </div>

      <CVUploadSection />
    </div>
  )
}
