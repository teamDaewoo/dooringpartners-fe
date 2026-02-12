'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/common/NavLink";
import { useAuth } from "@/contexts/AuthContext";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  { label: "홈", href: "/dashboard" },
  { label: "상품 둘러보기", href: "/products" },
  {
    label: "내 활동",
    dropdown: [
      { label: "컨텐츠 관리", href: "/links" },
      { label: "실적 리포트", href: "/dashboard" },
      { label: "정산 관리", href: "/receipt" },
    ],
  },
  {
    label: "고객지원",
    dropdown: [
      { label: "공지사항", href: "/notice" },
      { label: "Q&A", href: "/qna" },
      { label: "사용가이드", href: "/guide" },
    ],
  },
];

function DropdownMenu({
  items,
  isOpen,
  onClose,
}: {
  items: DropdownItem[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[160px] z-50"
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClose}
          className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export default function TopBar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isActive = (item: NavItem) => {
    if (item.href) return pathname === item.href;
    if (item.dropdown) return item.dropdown.some((d) => pathname === d.href);
    return false;
  };

  return (
    <header className="h-[45px] border-b border-border bg-background sticky top-0 z-50">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Branding */}
        <Link href="/report" className="flex items-center gap-2">
          <Image
            src="/dooring-logo.png"
            alt="두링파트너스"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          <span className="font-bold text-base text-foreground tracking-tight">
            두링파트너스
          </span>
        </Link>

        {/* Center Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors relative",
                    isActive(item)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  {isActive(item) && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent rounded-full" />
                  )}
                </Link>
              ) : (
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === item.label ? null : item.label)
                  }
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors relative flex items-center gap-1",
                    isActive(item)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  <ChevronDown className="h-3 w-3" />
                  {isActive(item) && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent rounded-full" />
                  )}
                </button>
              )}
              {item.dropdown && (
                <DropdownMenu
                  items={item.dropdown}
                  isOpen={openDropdown === item.label}
                  onClose={() => setOpenDropdown(null)}
                />
              )}
            </div>
          ))}
        </nav>

        {/* Right side - Logout */}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-sm text-muted-foreground hover:text-foreground gap-1.5"
        >
          <LogOut className="h-4 w-4" />
          <span>로그아웃</span>
        </Button>
      </div>
    </header>
  );
}
