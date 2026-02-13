import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
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
      {/*  미러링 테스트 배너 */}  <div style={{  position: 'fixed',  top: 0,  left: 0,  right: 0,  background: '#22C55E',  color: 'white',  padding: '12px',  textAlign: 'center',  zIndex: 99999,  fontSize: '18px',  fontWeight: 'bold',  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'  }}>   미러링 & 자동 배포 테스트 완료! - {new Date().toLocaleTimeString('ko-KR')}  </div>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products" element={<ProtectedRoute><ProductSearchPage /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
            <Route path="/links" element={<ProtectedRoute><LinkManagePage /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
            <Route path="/receipt" element={<ProtectedRoute><ReceiptPage /></ProtectedRoute>} />
            <Route path="/notice" element={<ProtectedRoute><NoticePage /></ProtectedRoute>} />
            <Route path="/qna" element={<ProtectedRoute><QnAPage /></ProtectedRoute>} />
            <Route path="/guide" element={<ProtectedRoute><UsingGuidePage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
