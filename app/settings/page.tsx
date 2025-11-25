export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">Configuración</h1>
        <p className="text-muted-foreground text-lg text-pretty">
          Ajusta las preferencias del sistema y gestiona tu cuenta.
        </p>
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Esta sección estará disponible próximamente</p>
          <p className="text-sm text-muted-foreground mt-2">Aquí podrás configurar parámetros del sistema</p>
        </div>
      </div>
    </div>
  )
}
