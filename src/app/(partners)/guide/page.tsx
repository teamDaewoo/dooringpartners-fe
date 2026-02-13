'use client';

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGuide } from "@/hooks/guide/useGuide";

function UsingGuidePageContent() {
  // React Query Hook 사용
  const { sections, isLoading } = useGuide();

  const [activeSection, setActiveSection] = useState(sections[0]?.id || "");
  const [activeItem, setActiveItem] = useState(sections[0]?.items[0]?.id || "");

  const currentSection = sections.find((s) => s.id === activeSection);
  const currentItem = currentSection?.items.find((i) => i.id === activeItem);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const section = sections.find((s) => s.id === sectionId);
    if (section && section.items.length > 0) {
      setActiveItem(section.items[0].id);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center py-12 text-muted-foreground text-sm">로딩 중...</div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-6">사용가이드</h1>

        <div className="flex gap-8">
          {/* Left sidebar */}
          <nav className="w-56 shrink-0 sticky top-[60px] self-start">
            <div className="space-y-1">
              {sections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => handleSectionClick(section.id)}
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
                          onClick={() => setActiveItem(item.id)}
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

          {/* Right content */}
          <div className="flex-1 min-w-0">
            {currentItem && (
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">{currentItem.title}</h2>
                {/* Feature image placeholder */}
                <div className="aspect-[16/9] bg-gradient-to-br from-info/20 to-info/5 rounded-lg flex items-center justify-center mb-6">
                  <ImageIcon className="h-12 w-12 text-info/30" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{currentItem.content}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function UsingGuidePage() {
  return (
    
      <UsingGuidePageContent />
    
  );
}
