'use client';

import { useState } from "react";
import { useQnA } from "@/hooks/qna/useQnA";
import { QnAHeader } from "@/components/qna/QnAHeader";
import { QnASearch } from "@/components/qna/QnASearch";
import { QnATabs } from "@/components/qna/QnATabs";
import { QnAAccordion } from "@/components/qna/QnAAccordion";
import { QnAEmptyState } from "@/components/qna/QnAEmptyState";

const tabs = ["FAQ", "1:1 채팅", "문의 이력"];

function QnAPageContent() {
  const [activeTab, setActiveTab] = useState("FAQ");
  const { items, isLoading, searchQuery, setSearchQuery } = useQnA();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <QnAHeader />
      <QnASearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <QnATabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "FAQ" && <QnAAccordion items={items} isLoading={isLoading} />}
      {activeTab === "1:1 채팅" && <QnAEmptyState type="chat" />}
      {activeTab === "문의 이력" && <QnAEmptyState type="history" />}
    </div>
  );
}

export default function QnAPage() {
  return <QnAPageContent />;
}
