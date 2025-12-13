import { useEffect, useState } from "react";
import Background from "./components/Background";
import GlassBoard from "./components/GlassBoard";
import { Floating } from "./components/floating";
import TodoList from "./components/Tdo";
import GlassNotesBoard from "./components/GlassNotesBoard";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/Signup";
import LogoutButton from "./components/LogoutButton";
import ProtectedRoute from "./components/ProtectedRoute";
import { supabase } from "./components/supabaseClient";

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Listen to login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="glass p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          backgroundColor: "black",
        }}
      >
        <Background />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {/* Routes */}
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={session ? <Navigate to="/notes" replace /> : <Login />}
            />
            <Route
              path="/signup"
              element={session ? <Navigate to="/notes" replace /> : <Signup />}
            />

            {/* Protected Routes */}
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <GlassNotesBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/todo"
              element={
                <ProtectedRoute>
                  <TodoList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scrum"
              element={
                <ProtectedRoute>
                  <GlassBoard />
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route
              path="/"
              element={
                session ? <Navigate to="/notes" replace /> : <Navigate to="/login" replace />
              }
            />

            {/* Catch all - redirect to login or notes */}
            <Route
              path="*"
              element={
                session ? <Navigate to="/notes" replace /> : <Navigate to="/login" replace />
              }
            />
          </Routes>

          {/* Show Floating Navigation only if logged in */}
          {session && (
            <div className="fixed bottom-0 left-0 z-50 w-full">
              <Floating />
            </div>
          )}

          {/* Global Logout Button */}
          {session && <LogoutButton />}
        </div>
      </div>
    </Router>
  );
}

export default App;
