import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const floatingPages = [
  {
    src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=700&fit=crop',
    alt: 'Portada de festival',
    style: { '--x': '4%', '--y': '8%', '--size': '160px', '--dx': '48px', '--dy': '40px', '--duration': '18s', '--delay': '0s' },
  },
  {
    src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=700&fit=crop',
    alt: 'Sesion de prensa',
    style: { '--x': '18%', '--y': '62%', '--size': '140px', '--dx': '42px', '--dy': '34px', '--duration': '22s', '--delay': '1.2s' },
  },
  {
    src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=700&fit=crop',
    alt: 'Escenario en vivo',
    style: { '--x': '82%', '--y': '10%', '--size': '150px', '--dx': '44px', '--dy': '38px', '--duration': '20s', '--delay': '0.6s' },
  },
  {
    src: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&h=700&fit=crop',
    alt: 'Publico concierto',
    style: { '--x': '75%', '--y': '66%', '--size': '165px', '--dx': '50px', '--dy': '44px', '--duration': '24s', '--delay': '1.8s' },
  },
  {
    src: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&h=700&fit=crop',
    alt: 'Visual live set',
    style: { '--x': '45%', '--y': '5%', '--size': '130px', '--dx': '36px', '--dy': '30px', '--duration': '19s', '--delay': '2.4s' },
  },
  {
    src: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=500&h=700&fit=crop',
    alt: 'Retrato editorial',
    style: { '--x': '6%', '--y': '40%', '--size': '120px', '--dx': '30px', '--dy': '26px', '--duration': '17s', '--delay': '1s' },
  },
  {
    src: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&h=700&fit=crop',
    alt: 'Foto media kit',
    style: { '--x': '88%', '--y': '42%', '--size': '125px', '--dx': '34px', '--dy': '28px', '--duration': '21s', '--delay': '2s' },
  },
  {
    src: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&h=700&fit=crop',
    alt: 'Documento presskit',
    style: { '--x': '33%', '--y': '76%', '--size': '135px', '--dx': '40px', '--dy': '32px', '--duration': '23s', '--delay': '2.8s' },
  },
];

function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      window.location.assign('/dashboard');
    } catch (err) {
      setError('No pudimos iniciar sesión con Google. Verifica tu configuración en Firebase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-20 text-zinc-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <div className="auth-floating-layer" aria-hidden="true">
        {floatingPages.map((item, index) => (
          <div key={`${item.alt}-${index}`} className="auth-floating-card" style={item.style}>
            <img src={item.src} alt="" />
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/15 bg-white/5 p-8 shadow-2xl backdrop-blur sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">Registro</p>
        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
          Crea tu cuenta y empieza tu Presskit
        </h1>
        <p className="mt-3 text-zinc-300">
          Accede con Google para crear, editar y compartir tu EPK profesional.
        </p>

        <button
          type="button"
          onClick={onGoogleSignIn}
          disabled={loading}
          className="mt-8 inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-base">G</span>
          {loading ? 'Conectando...' : 'Continuar con Google'}
        </button>

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

        <a href="/" className="mt-6 inline-block text-sm text-zinc-300 underline underline-offset-4">
          Volver al inicio
        </a>
      </div>
    </section>
  );
}

export default AuthPage;
