import type { MemberRole } from "@/lib/access";

export type NavItem = {
  label: string;
  href: string;
  roles: MemberRole[];
  /** Plan step that delivers this screen. Undefined = available now. */
  step?: number;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

const STAFF: MemberRole[] = ["admin", "teacher"];
const ADMIN: MemberRole[] = ["admin"];

// School area menu, grouped instead of the 13 tabs in a row of the old app.
export const schoolNav: NavGroup[] = [
  {
    label: "Início",
    items: [{ label: "Painel", href: "/painel", roles: STAFF }],
  },
  {
    label: "Financeiro",
    items: [
      { label: "Mensalidades", href: "/painel/mensalidades", roles: ADMIN, step: 3 },
      { label: "Pagamentos", href: "/painel/pagamentos", roles: ADMIN, step: 4 },
      { label: "Relatórios", href: "/painel/relatorios", roles: ADMIN, step: 6 },
    ],
  },
  {
    label: "Escola",
    items: [
      { label: "Alunos", href: "/painel/alunos", roles: STAFF, step: 2 },
      { label: "Responsáveis", href: "/painel/responsaveis", roles: ADMIN, step: 2 },
      { label: "Turmas", href: "/painel/turmas", roles: STAFF, step: 2 },
    ],
  },
  {
    label: "Comunicação",
    items: [
      { label: "Avisos", href: "/painel/avisos", roles: STAFF, step: 5 },
      { label: "Agenda", href: "/painel/agenda", roles: STAFF, step: 5 },
      { label: "Calendário", href: "/painel/calendario", roles: STAFF, step: 5 },
    ],
  },
  {
    label: "Configurações",
    items: [
      { label: "Dados da escola", href: "/painel/configuracoes", roles: ADMIN },
      { label: "Assinatura", href: "/painel/assinatura", roles: ADMIN, step: 6 },
    ],
  },
];

// Family area: four tabs in a bottom bar, made for the phone.
export const familyNav: NavItem[] = [
  { label: "Início", href: "/familia", roles: ["guardian"] },
  { label: "Financeiro", href: "/familia/financeiro", roles: ["guardian"], step: 5 },
  { label: "Avisos", href: "/familia/avisos", roles: ["guardian"], step: 5 },
  { label: "Agenda", href: "/familia/agenda", roles: ["guardian"], step: 5 },
];

/** Menu groups a person sees, given their roles in the active school. */
export function navForRoles(groups: NavGroup[], roles: MemberRole[]): NavGroup[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.some((role) => roles.includes(role))),
    }))
    .filter((group) => group.items.length > 0);
}

/** Finds the menu item for a path, e.g. "/painel/alunos". */
export function findNavItem(href: string): NavItem | undefined {
  const all = [...schoolNav.flatMap((group) => group.items), ...familyNav];
  return all.find((item) => item.href === href);
}

/** Is this menu item the current page? */
export function isActive(item: NavItem, pathname: string) {
  const isRoot = item.href === "/painel" || item.href === "/familia";
  return isRoot ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}
