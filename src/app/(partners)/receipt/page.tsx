'use client';

import { useState } from "react";
import { useSettlement } from "@/hooks/settlement/useSettlement";
import { MonthSelector } from "@/components/settlement/MonthSelector";
import { SettlementKPIs } from "@/components/settlement/SettlementKPIs";
import { SettlementInfoBox } from "@/components/settlement/SettlementInfoBox";
import { SettlementActions } from "@/components/settlement/SettlementActions";
import { SettlementTable } from "@/components/settlement/SettlementTable";

function ReceiptPageContent() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0));
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const {
    kpis,
    settlements,
    total,
    isLoading,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useSettlement({ perPage: 5 });

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === settlements.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(settlements.map((r) => r.id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <MonthSelector currentMonth={currentMonth} onPrevMonth={prevMonth} onNextMonth={nextMonth} />
      <SettlementKPIs kpis={kpis} isLoading={isLoading} />
      <SettlementInfoBox />
      <SettlementActions />
      <SettlementTable
        settlements={settlements}
        isLoading={isLoading}
        selectedRows={selectedRows}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        onToggleRow={toggleRow}
        onToggleAll={toggleAll}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default function ReceiptPage() {
  return <ReceiptPageContent />;
}
