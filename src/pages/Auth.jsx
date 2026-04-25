import { supabase } from '../supabaseClient'; 
import './Style.css';

function Auth() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/' } // redireciona para home após login
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