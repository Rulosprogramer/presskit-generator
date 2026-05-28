import { useEffect, useState } from 'react';
import { verifyBeforeUpdateEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-zinc-600">{hint}</p>}
    </div>
  );
}

function SettingsModal({ user, onClose }) {
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.uid) return;
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setPhone(data.phone || '');
        setBirthYear(data.birthYear || '');
      }
    });
  }, [user?.uid]);

  const handleSave = async () => {
    setMessage('');
    setError('');
    setSaving(true);

    try {
      await setDoc(doc(db, 'users', user.uid), { phone, birthYear }, { merge: true });

      if (email && email !== user.email) {
        await verifyBeforeUpdateEmail(auth.currentUser, email);
        setMessage('Se envió un correo de verificación a la nueva dirección. Confirma el cambio desde ese correo.');
      } else {
        setMessage('Configuración guardada correctamente.');
      }
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        setError('Por seguridad, cierra sesión, vuelve a iniciar y luego cambia el correo.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El correo ingresado no es válido.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Ese correo ya está en uso por otra cuenta.');
      } else {
        setError('No se pudo guardar. Intenta de nuevo.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-zinc-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Configuración</h2>
            <p className="mt-0.5 text-xs text-zinc-500">Actualiza tu información personal</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <Field
            label="Correo electrónico"
            hint="Se enviará un correo de verificación a la nueva dirección."
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-cyan-300/50 focus:ring-1 focus:ring-cyan-300/30"
            />
          </Field>

          <Field label="Número de celular">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+57 300 000 0000"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-cyan-300/50 focus:ring-1 focus:ring-cyan-300/30"
            />
          </Field>

          <Field label="Año de nacimiento">
            <input
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="1990"
              min="1900"
              max={new Date().getFullYear()}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-cyan-300/50 focus:ring-1 focus:ring-cyan-300/30"
            />
          </Field>
        </div>

        {message && (
          <p className="mt-4 rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-400 transition hover:bg-white/8 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-cyan-300 px-5 py-2 text-sm font-bold text-zinc-950 transition hover:bg-cyan-200 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
