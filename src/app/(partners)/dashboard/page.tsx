'use client';

import { useState } from "react";
import { useDashboard } from "@/hooks/dashboard/useDashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSearchBar } from "@/components/dashboard/DashboardSearchBar";
import { DateChips } from "@/components/dashboard/DateChips";
import { DashboardKPIs } from "@/components/dashboard/DashboardKPIs";
import { DashboardChart } from "@/components/dashboard/DashboardChart";

const dateChips = ["오늘", "7일", "30일", "3개월", "6개월", "1년"];

export default function DashboardPage() {
  const [selectedChip, setSelectedChip] = useState("30일");
  const [searchQuery, setSearchQuery] = useState("");
  const { kpis, chartData, isLoading } = useDashboard();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <DashboardHeader />
      <DashboardSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <DateChips chips={dateChips} selectedChip={selectedChip} onChipSelect={setSelectedChip} />
      {kpis && <DashboardKPIs kpis={kpis} />}
      <DashboardChart chartData={chartData} isLoading={isLoading} />
    </div>
  );
}
