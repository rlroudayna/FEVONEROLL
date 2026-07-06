type BadgeVariant = "valide" | "brouillon" | "ok" | "nok" | "reserve" | "encours" | "pasfait";

const variantStyles: Record<BadgeVariant, string> = {
  valide: "bg-[#E3F2FD] text-black",
  brouillon: "bg-[#F5F5F5] text-gray-600",
  ok: "bg-[#E8F5E9] text-[#2E7D32]",
  nok: "bg-[#FFEBEE] text-[#C62828]",
  reserve: "bg-[#FFF3E0] text-[#ED6C02]",
  encours: "bg-[#FFF9C4] text-[#FBC02D]",
  pasfait: "bg-[#FFEBEE] text-[#C62828]",
};

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className = "" }: BadgeProps) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
