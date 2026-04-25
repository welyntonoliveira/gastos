import { supabase } from '../supabaseClient'; 
import './Style.css';

function Auth() {
  const handleGoogleLogin = async () => {
    const siteUrl = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_SITE_URL 
    : window.location.origin;

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: siteUrl + '/' } // redireciona para home após login
    });
  };

  return (
    <div className="auth-container">
      <h2>Gastou, Marcou</h2>
      <p>Entre com sua conta Google</p>
      <button onClick={handleGoogleLogin} className="login-with-google-btn">
        Entrar com Google
      </button>
    </div>
  );
}

export default Auth;