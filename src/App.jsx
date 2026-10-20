import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  Footer,
} from "./components";
import { usePageMeta } from "./hooks/usePageMeta";

// The background star field pulls in three.js — defer it so the critical
// path (nav, hero copy, sections) can paint immediately.
const StarsCanvas = lazy(() => import("./components/canvas/Stars"));

// Route-level code splitting: each page becomes its own chunk.
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Blog = lazy(() => import("./pages/blog"));

const RouteFallback = () => (
  <div
    className="min-h-screen flex items-center justify-center bg-primary"
    role="status"
    aria-live="polite"
  >
    <span className="canvas-loader" aria-hidden="true" />
    <span className="sr-only">Loading…</span>
  </div>
);

/** The landing page. Kept separate so it can own the home-page meta tags. */
const Home = () => {
  usePageMeta();

  return (
    <main id="main-content" tabIndex={-1}>
      <div className="relative z-0 bg-primary">
        <Suspense fallback={null}>
          <StarsCanvas fixed />
        </Suspense>
        <div className="relative z-10 bg-no-repeat bg-center">
          <Hero />
        </div>
        <div className="relative z-10">
          <About />
        </div>
        <div className="relative z-10">
          <Experience />
        </div>
        <div className="relative z-10">
          <Tech />
          <Works />
        </div>
        <div className="relative z-10">
          <Feedbacks />
        </div>
        <div className="relative z-10">
          <Contact />
        </div>
        <Footer />
      </div>
    </main>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />

      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Portfolio Route */}
          <Route path="/" element={<Home />} />

          {/* Auth Pages */}
          <Route
            path="/login"
            element={
              <div className="min-h-screen pt-28">
                <Login />
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <div className="min-h-screen pt-28">
                <Register />
              </div>
            }
          />

          {/* Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <div className="relative z-0 bg-primary min-h-screen pt-28">
                <Dashboard />
              </div>
            }
          />

          {/* Blog Route */}
          <Route
            path="/blog"
            element={
              <div className="relative z-0 bg-primary min-h-screen pt-28">
                <Blog />
              </div>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
