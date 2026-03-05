import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QnATabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function QnATabs({ tabs, activeTab, onTabChange }: QnATabsProps) {
  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tab) => (
        <Button
          key={tab}
          size="sm"
          variant={activeTab === tab ? "default" : "outline"}
          onClick={() => onTabChange(tab)}
          className="text-xs h-8"
        >
          {tab === "1:1 채팅" && <MessageCircle className="h-3.5 w-3.5 mr-1" />}
          {tab}
        </Button>
      ))}
    </div>
  );
}
