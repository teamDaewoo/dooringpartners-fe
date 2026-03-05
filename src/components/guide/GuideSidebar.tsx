import { cn } from "@/lib/utils";
import type { GuideSection } from "@/types/guide";

interface GuideSidebarProps {
  sections: GuideSection[];
  activeSection: string;
  activeItem: string;
  onSectionClick: (sectionId: string) => void;
  onItemClick: (itemId: string) => void;
}

export function GuideSidebar({
  sections,
  activeSection,
  activeItem,
  onSectionClick,
  onItemClick
}: GuideSidebarProps) {
  return (
    <nav className="w-56 shrink-0 sticky top-[60px] self-start">
      <div className="space-y-1">
        {sections.map((section) => (
          <div key={section.id}>
            <button
              onClick={() => onSectionClick(section.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
                activeSection === section.id
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {section.title}
            </button>
            {activeSection === section.id && (
              <div className="ml-3 mt-1 space-y-0.5">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onItemClick(item.id)}
                    className={cn(
                      "w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors",
                      activeItem === item.id
                        ? "text-accent font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
