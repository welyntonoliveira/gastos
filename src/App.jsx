import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Marcou from './pages/Marcou';
import Timeline from './pages/Timeline';
import Auth from './pages/Auth';
import './App.css';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica sessão atual ao carregar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listener para mudanças de autenticação
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rota pública de autenticação */}
      <Route
        path="/auth"
        element={session ? <Navigate to="/" /> : <Auth />}
      />

      {/* Rotas protegidas */}
      <Route
        path="/"
        element={
          session ? (
            <div className="app-container">
              <Marcou user={session.user} />
            </div>
          ) : (
            <Navigate to="/auth" />
          )
        }
      />

      <Route
        path="/timeline"
        element={
          session ? (
            <Timeline user={session.user} />
          ) : (
            <Navigate to="/auth" />
          )
        }
      />
    </Routes>
  );
}

export default AppWrapper;