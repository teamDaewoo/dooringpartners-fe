'use client';

import { useNotices } from "@/hooks/notice/useNotices";
import { NoticeHeader } from "@/components/notice/NoticeHeader";
import { NoticeSearch } from "@/components/notice/NoticeSearch";
import { NoticeFilterTabs } from "@/components/notice/NoticeFilterTabs";
import { NoticeTable } from "@/components/notice/NoticeTable";

const filterTabs = ["전체", "중요", "공지사항", "최신순", "프로모션 및 이벤트", "기타"];

function NoticePageContent() {
  const {
    notices,
    isLoading,
    activeTab,
    searchQuery,
    currentPage,
    totalPages,
    setActiveTab,
    setSearchQuery,
    setCurrentPage,
  } = useNotices({ perPage: 7 });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <NoticeHeader />
      <NoticeSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <NoticeFilterTabs tabs={filterTabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <NoticeTable
        notices={notices}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default function NoticePage() {
  return <NoticePageContent />;
}
