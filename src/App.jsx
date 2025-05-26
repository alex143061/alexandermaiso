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
  StarsCanvas,
  Footer,
} from "./components";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; // Import the Dashboard component

const App = () => {
  return (
    <BrowserRouter>
      {/* Navbar at top level so it's always visible */}
      <Navbar />

      <Routes>
        {/* Portfolio Route */}
        <Route
          path="/"
          element={
            <div className="relative z-0 bg-primary">
              <div className="relative z-10 bg-no-repeat bg-center">
                <Hero />
                <StarsCanvas />
              </div>
              <div className="relative z-10">
                <About />
                <StarsCanvas />
              </div>
              <div className="relative z-10">
                <Experience />
                <StarsCanvas />
              </div>
              <div className="relative z-10">
                <Tech />
                <Works />
                <StarsCanvas />
              </div>
              <div className="relative z-10">
                <Feedbacks />
                <StarsCanvas />
              </div>
              <div className="relative z-10">
                <Contact />
                <StarsCanvas />
              </div>
              <Footer />
            </div>
          }
        />

        {/* Auth Pages */}
        <Route
          path="/login"
          element={
            <div className="relative z-0 bg-primary min-h-screen pt-28">
              {/* Added pt-28 to offset for fixed navbar */}
              <Login />
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div className="relative z-0 bg-primary min-h-screen pt-28">
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
