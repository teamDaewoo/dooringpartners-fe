'use client';

import { useState, useEffect } from "react";
import { useGuide } from "@/hooks/guide/useGuide";
import { GuideHeader } from "@/components/guide/GuideHeader";
import { GuideSidebar } from "@/components/guide/GuideSidebar";
import { GuideContent } from "@/components/guide/GuideContent";

function UsingGuidePageContent() {
  const { sections, isLoading } = useGuide();
  const [activeSection, setActiveSection] = useState("");
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0].id);
      if (sections[0].items.length > 0) {
        setActiveItem(sections[0].items[0].id);
      }
    }
  }, [sections, activeSection]);

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
    <div className="max-w-7xl mx-auto px-4 py-6">
      <GuideHeader />
      <div className="flex gap-8">
        <GuideSidebar
          sections={sections}
          activeSection={activeSection}
          activeItem={activeItem}
          onSectionClick={handleSectionClick}
          onItemClick={setActiveItem}
        />
        <GuideContent item={currentItem} />
      </div>
    </div>
  );
}

export default function UsingGuidePage() {
  return <UsingGuidePageContent />;
}
