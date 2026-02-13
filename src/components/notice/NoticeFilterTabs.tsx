import { Button } from "@/components/ui/button";

interface NoticeFilterTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function NoticeFilterTabs({ tabs, activeTab, onTabChange }: NoticeFilterTabsProps) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {tabs.map((tab) => (
        <Button
          key={tab}
          size="sm"
          variant={activeTab === tab ? "default" : "outline"}
          onClick={() => onTabChange(tab)}
          className="text-xs h-8"
        >
          {tab}
        </Button>
      ))}
    </div>
  );
}
