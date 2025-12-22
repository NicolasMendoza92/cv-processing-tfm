"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Upload, History, Users, Settings, Briefcase} from "lucide-react";

const navItems = [
  {
    title: "Carga de CVs",
    href: "/",
    icon: Upload,
  },
  {
    title: "Historial de Procesamiento",
    href: "/history",
    icon: History,
  },
  {
    title: "Mis Candidatos",
    href: "/candidates",
    icon: Users,
  },
  {
    title: "Ofertas",
    href: "/ofertas",
    icon: Briefcase,
  },
  {
    title: "Configuración",
    href: "/settings",
    icon: Settings,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 min-h-screen bg-card border-r border-border p-4 flex flex-col gap-2">
      <div className="mb-6 px-3">
        <h2 className="text-lg font-bold text-foreground">Gestión de CVs</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Fundación de Inclusión
        </p>
      </div>

      <div className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
