import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Box,
  Briefcase,
  Calculator,
  ChevronDown,
  ExternalLink,
  Factory,
  Handshake,
  Folder,
  HelpCircle,
  Home,
  Package,
  Monitor,
  RotateCw,
  Search,
  Settings,
  ShoppingCart,
  Star,
  Truck,
  User,
  Wallet,
  Users,
  X,
} from "lucide-react";
import type { GnbIconKey } from "@/config/erp-ui";

const gnbIcons: Record<GnbIconKey, LucideIcon> = {
  star: Star,
  users: Users,
  wallet: Wallet,
  briefcase: Briefcase,
  shoppingCart: ShoppingCart,
  factory: Factory,
  truck: Truck,
  calculator: Calculator,
  settings: Settings,
  monitor: Monitor,
  handshake: Handshake,
  chevronDown: ChevronDown,
};

export function GnbIcon({
  iconKey,
  className,
}: {
  iconKey: GnbIconKey;
  className?: string;
}) {
  const Icon = gnbIcons[iconKey];
  return <Icon className={className} aria-hidden />;
}

export const topBarIcons = {
  Home,
  Folder,
  Box,
  Package,
  Star,
  Search,
  User,
  Bell,
  HelpCircle,
  RotateCw,
  ExternalLink,
  Close: X,
} as const;
