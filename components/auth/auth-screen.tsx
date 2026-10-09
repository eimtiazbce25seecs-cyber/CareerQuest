'use client';
import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/auth-provider';
import { CHARACTERS } from '@/lib/data/characters';
import { AuthError, validateSignUp } from '@/lib/auth';

export function AuthScreen() {
  const { user, panel, signUp, logIn, guest, closeAuth } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(panel ?? 'login');
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [character, setCharacter] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const switchMode = (next: 'login' | 'signup') => { setMode(next); setStep(1); setError(''); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && step === 1) {
      const problem = validateSignUp(name, email, password);
      if (problem) return setError(problem);
      return setStep(2);
    }
    setBusy(true);
    try {
      if (mode === 'login') await logIn(email, password);
      else await signUp({ name, email, password, character });
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.');
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-art" aria-hidden="true">
        <div className="logo"><div className="logo-mark"><Sprout size={22} /></div><div>Career<span className="accent">Quest</span></div></div>
        <img src="/images/quest-world.jpg" alt="" width={1536} height={640} />
        <div className="auth-quote">“Every adventure starts with a character. Pick one, answer a few questions, and try careers before you commit.”<small>Yuki, your sensei</small></div>
      </section>
      <main className="auth-panel">
        <div className="auth-card">
          {user && <Button variant="ghost" size="sm" className="mb-4 -ml-3" onClick={closeAuth}><ArrowLeft />Back to my quest</Button>}
          {mode === 'signup' && step === 2 ? (
            <form onSubmit={submit}>
              <h1>Pick your character</h1>
              <p>Choose the one that feels most like you today. It’s a starting point, not a label.</p>
              <div className="picker" role="group" aria-label="Characters">
                {CHARACTERS.map((c, i) => (
                  <button type="button" key={c.id} aria-pressed={character === i} onClick={() => setCharacter(i)}>
                    <div className="art"><img src={c.image} alt="" /></div><strong>{c.name}</strong><small>{c.tag}</small>
                  </button>
                ))}
              </div>
              {error && <div className="form-error" role="alert">{error}</div>}
              <Button type="submit" className="w-full h-11" disabled={busy}>{busy ? 'Creating your account…' : 'Start my quest'} <ArrowRight /></Button>
              <Button type="button" variant="ghost" className="w-full mt-2" onClick={() => setStep(1)}>Back</Button>
            </form>
          ) : (
            <form onSubmit={submit} noValidate>
              <h1>{mode === 'login' ? 'Welcome back' : 'Start your quest'}</h1>
              <p>{mode === 'login' ? 'Pick up where you left off.' : 'Create an account to save your progress.'}</p>
              <div className="tabs" role="tablist" aria-label="Account">
                <button type="button" role="tab" aria-selected={mode === 'login'} onClick={() => switchMode('login')}>Log in</button>
                <button type="button" role="tab" aria-selected={mode === 'signup'} onClick={() => switchMode('signup')}>Sign up</button>
              </div>
              {mode === 'signup' && <div className="field"><label htmlFor="name">Your name</label><input id="name" className="text-input" autoComplete="given-name" value={name} onChange={e => setName(e.target.value)} /></div>}
              <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" className="text-input" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="pw-wrap">
                  <input id="password" type={show ? 'text' : 'password'} className="text-input" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" className="pw-toggle" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
                {mode === 'signup' && <span className="hint">At least 8 characters.</span>}
              </div>
              {error && <div className="form-error" role="alert">{error}</div>}
              <Button type="submit" className="w-full h-11" disabled={busy}>{busy ? 'Logging in…' : mode === 'login' ? 'Log in' : 'Next: choose a character'} <ArrowRight /></Button>
              {!user && <><div className="divider">or</div><Button type="button" variant="outline" className="w-full h-11" onClick={guest}>Explore as a guest</Button></>}
              <p className="text-xs mt-4" style={{ color: 'var(--muted-foreground)' }}>Accounts are saved in this browser, so progress stays on this device.</p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
