import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/home'); // ✅ Redirect to AppLayout
    } else {
      navigate('/login'); // 🔁 Fallback to login if token missing
    }
  }, [navigate]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '1.2rem',
      color: '#fff',
      backgroundColor: '#111'
    }}>
      Logging you in... 🎵
    </div>
  );
}