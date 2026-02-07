import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductSearchPage from "./pages/ProductSearchPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LinkManagePage from "./pages/LinkManagePage";
import ReportPage from "./pages/ReportPage";
import ReceiptPage from "./pages/ReceiptPage";
import NoticePage from "./pages/NoticePage";
import QnAPage from "./pages/QnAPage";
import UsingGuidePage from "./pages/UsingGuidePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductSearchPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/links" element={<LinkManagePage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/receipt" element={<ReceiptPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/qna" element={<QnAPage />} />
          <Route path="/guide" element={<UsingGuidePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
