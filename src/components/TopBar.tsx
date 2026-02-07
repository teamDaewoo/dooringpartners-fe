import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownItem {
  label: string;
  to: string;
}

interface NavItem {
  label: string;
  to?: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  { label: "홈", to: "/" },
  { label: "상품 둘러보기", to: "/products" },
  {
    label: "내 링크",
    dropdown: [
      { label: "컨텐츠 관리", to: "/links" },
      { label: "실적 리포트", to: "/report" },
      { label: "정산 관리", to: "/receipt" },
    ],
  },
  {
    label: "고객지원",
    dropdown: [
      { label: "공지사항", to: "/notice" },
      { label: "Q&A", to: "/qna" },
      { label: "사용가이드", to: "/guide" },
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
          key={item.to}
          to={item.to}
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
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isActive = (item: NavItem) => {
    if (item.to) return location.pathname === item.to;
    if (item.dropdown) return item.dropdown.some((d) => location.pathname === d.to);
    return false;
  };

  return (
    <header className="h-[45px] border-b border-border bg-background sticky top-0 z-50">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Branding */}
        <Link to="/" className="font-bold text-base text-foreground tracking-tight">
          토탈 파트너스
        </Link>

        {/* Center Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.to ? (
                <Link
                  to={item.to}
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

        {/* Right side - MyPage */}
        <Link
          to="#"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <User className="h-4 w-4" />
          <span>마이페이지</span>
        </Link>
      </div>
    </header>
  );
}
