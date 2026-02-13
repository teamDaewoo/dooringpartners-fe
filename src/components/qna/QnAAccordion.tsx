import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { QnAItem } from "@/types/qna";

interface QnAAccordionProps {
  items: QnAItem[];
  isLoading: boolean;
}

export function QnAAccordion({ items, isLoading }: QnAAccordionProps) {
  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground text-sm">로딩 중...</div>;
  }

  if (items.length === 0) {
    return <div className="text-center py-12 text-muted-foreground text-sm">검색 결과가 없습니다.</div>;
  }

  return (
    <Accordion type="single" collapsible className="space-y-2">
      {items.map((item) => (
        <AccordionItem key={item.id} value={`q-${item.id}`} className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/30 shrink-0">
                Q
              </Badge>
              <span className="text-left">{item.question}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-4 pl-10">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
