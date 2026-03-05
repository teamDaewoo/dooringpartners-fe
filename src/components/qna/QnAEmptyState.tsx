import { MessageCircle } from "lucide-react";

interface QnAEmptyStateProps {
  type: "chat" | "history";
}

export function QnAEmptyState({ type }: QnAEmptyStateProps) {
  if (type === "chat") {
    return (
      <div className="text-center py-16">
        <MessageCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">1:1 채팅 기능은 준비 중입니다.</p>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <p className="text-muted-foreground text-sm">문의 이력이 없습니다.</p>
    </div>
  );
}
