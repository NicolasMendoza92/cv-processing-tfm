type Gender = "h" | "m" | "otro" | null | undefined;
type MaritalStatus =
  | "soltero"
  | "casado"
  | "divorciado"
  | "viudo"
  | "otro"
  | null
  | undefined;

export function getMaritalStatusByGender(
  maritalStatus?: MaritalStatus,
  gender?: Gender
): string {
  if (!maritalStatus || maritalStatus === "otro") return "otro";

  const isMale = gender === "h";
  const isFemale = gender === "m";

  if (!isMale && !isFemale) return maritalStatus;

  const map: Record<
    Exclude<MaritalStatus, null | undefined | "otro">,
    { m: string; f: string }
  > = {
    soltero: { m: "soltero", f: "soltera" },
    casado: { m: "casado", f: "casada" },
    divorciado: { m: "divorciado", f: "divorciada" },
    viudo: { m: "viudo", f: "viuda" },
  };

  return isMale ? map[maritalStatus].m : map[maritalStatus].f;
}

export function getGender(gender?: Gender): string {
  switch (gender) {
    case "h":
      return "hombre";
    case "m":
      return "mujer";
    default:
      return "otro";
  }
}

export function getYesNo(value?: boolean | null): string {
  if (value === true) return "Sí";
  if (value === false) return "No";
  return "—";
}

