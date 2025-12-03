import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import ProductView from "./pages/ProductView";
import Cart from "./pages/Cart";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Jewelries from "./pages/Jewelries";
import Sellers from "./pages/Sellers";
import Admin from "./pages/Admin";
import SlideView from "./pages/SlideView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/jewelries" element={<Jewelries />} />
          <Route path="/product/:productId" element={<ProductView />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/sellers" element={<Sellers />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/slides" element={<SlideView />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
