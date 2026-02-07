import { useState } from "react";
import { Search, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Layout from "@/components/Layout";
import { qnaItems } from "@/data/mockData";

const tabs = ["FAQ", "1:1 채팅", "문의 이력"];

export default function QnAPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("FAQ");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const filtered = qnaItems.filter((q) =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-4">Q&A</h1>

        {/* Search */}
        <div className="relative max-w-md mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="자주 묻는 질문 검색..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-9 text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
              className="text-xs h-8"
            >
              {tab === "1:1 채팅" && <MessageCircle className="h-3.5 w-3.5 mr-1" />}
              {tab}
            </Button>
          ))}
        </div>

        {activeTab === "FAQ" && (
          <>
            <Accordion type="single" collapsible className="space-y-2">
              {paginated.map((item) => (
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

            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">검색 결과가 없습니다.</div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-6">
                <Button variant="outline" size="sm" className="h-8 text-xs" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>이전</Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button key={i + 1} variant={currentPage === i + 1 ? "default" : "outline"} size="sm" className="h-8 w-8 text-xs" onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </Button>
                ))}
                <Button variant="outline" size="sm" className="h-8 text-xs" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>다음</Button>
              </div>
            )}
          </>
        )}

        {activeTab === "1:1 채팅" && (
          <div className="text-center py-16">
            <MessageCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">1:1 채팅 기능은 준비 중입니다.</p>
          </div>
        )}

        {activeTab === "문의 이력" && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">문의 이력이 없습니다.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
