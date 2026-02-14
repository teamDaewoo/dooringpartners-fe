'use client';

import { useLinks } from "@/hooks/link/useLinks";
import { LinkHeader } from "@/components/link/LinkHeader";
import { LinkFilters } from "@/components/link/LinkFilters";
import { LinkTable } from "@/components/link/LinkTable";

function LinkManagePageContent() {
  const {
    links,
    isLoading,
    searchQuery,
    currentPage,
    totalPages,
    perPage,
    setSearchQuery,
    setCurrentPage,
  } = useLinks({ perPage: 10 });

  return (
    <>
      <LinkHeader />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <LinkFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <LinkTable
          links={links}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          perPage={perPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}

export default function LinkManagePage() {
  return <LinkManagePageContent />;
}
