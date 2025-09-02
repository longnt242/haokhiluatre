// client/src/App.tsx
import { Switch, Route, Link } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PresetProvider } from "./contexts/PresetContext";

import PresetAwareNavbar from "@/components/presets/PresetAwareNavbar";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Models from "@/pages/models";
import ModelDetail from "@/pages/model-detail";
import Gallery from "@/pages/gallery";
import Videos from "@/pages/videos";
import About from "@/pages/about";
import Upload from "@/pages/upload";

import teamLogo from "./assets/team-logo.png"; // giữ lại vì đang dùng trong footer

function Router() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <PresetAwareNavbar />

      <main
        className="transition-all duration-300"
        style={{ marginLeft: "var(--content-margin-left)" }}
      >
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/models" component={Models} />
          <Route path="/models/:modelName" component={ModelDetail} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/videos" component={Videos} />
          <Route path="/about" component={About} />
          {/* CHỈ MỘT route /upload */}
          <Route path="/upload" component={Upload} />
          {/* Catch-all 404 */}
          <Route component={NotFound} />
        </Switch>

        {/* Footer */}
        <footer
          className="border-t"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={teamLogo}
                    alt="The Weakened Team Logo"
                    className="w-8 h-8"
                  />
                  <h3 className="font-display text-xl font-bold text-primary">
                    Hào Khí Lửa Tre
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Dự án game indie cinematic với công nghệ UE5, mang đậm văn hóa
                  và tinh thần Việt Nam.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="text-xl">📘</span>
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="text-xl">🐦</span>
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="text-xl">💬</span>
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="text-xl">📺</span>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Liên Kết</h4>
                <ul className="space-y-2">
                  {/* Dùng Link của wouter để không reload trang */}
                  <li>
                    <Link
                      href="/"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Trang chủ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/models"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Mô hình 3D
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/gallery"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Thư viện ảnh
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/videos"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Video
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Giới thiệu
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Hỗ Trợ</h4>
                <ul className="space-y-2">
                  <li>
                    <span className="text-muted-foreground">
                      Email: theweakened.team@gmail.com
                    </span>
                  </li>
                  <li>
                    <span className="text-muted-foreground">Powered by UE5</span>
                  </li>
                  <li>
                    <span className="text-muted-foreground">
                      Made in Vietnam 🇻🇳
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border mt-8 pt-8 text-center">
              <p className="text-muted-foreground">© 2025 The Weakened Team</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PresetProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </PresetProvider>
    </QueryClientProvider>
  );
}

export default App;
