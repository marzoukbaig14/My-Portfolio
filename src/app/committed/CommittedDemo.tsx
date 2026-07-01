'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { examples } from './examples';
import { generateMessage, pingHealth, usingMock, type ModelId } from './api';
import { HighlightedDiffInput } from '../components/CodeHighlight';
import { CC_RE, isWellFormed, fileCount } from './cc';

// Tunables: the human can adjust these once the real model/limits are known.
const HEALTH_TIMEOUT_MS = 4000;    // a slow/hanging /health ping means the Space is cold or asleep
const HEALTH_COLD_POLL_MS = 5000;  // while cold, re-check often to catch the wake-up (and nudge it awake)
const HEALTH_WARM_POLL_MS = 20_000;// while warm, re-check lazily in case the Space dozes off
const REQUEST_TIMEOUT_MS = 90_000; // give a cold Space room to wake before giving up
const MAX_DIFF_CHARS = 6000;       // rough proxy for the training token cap (single-file diffs)
const TYPE_SPEED_MS = 16;          // typewriter reveal speed, per character

// Model selector options: human-facing label -> API value. Order is display
// order; the first entry is the default selection and matches the server default.
const MODEL_OPTIONS: { value: ModelId; label: string }[] = [
  { value: '1.7b', label: 'Qwen3-1.7B' },
  { value: '0.6b', label: 'Qwen3-0.6B' },
];

export default function CommittedDemo() {
  const [diff, setDiff] = useState('');
  const [status, setStatus] = useState<'idle' | 'generating' | 'result' | 'error'>('idle');
  const [coldStart, setColdStart] = useState(false);
  const [warm, setWarm] = useState(false);
  const [result, setResult] = useState('');
  const [typed, setTyped] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [suggestExamples, setSuggestExamples] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [model, setModel] = useState<ModelId>('1.7b');

  const abortRef = useRef<AbortController | null>(null);
  const typeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Honor reduced-motion: it gates the typewriter and the blinking cursor.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Read the model's real readiness from /health and keep it current. This,
  // not request latency, is what decides whether we show the "waking up"
  // notice. A fast 200 with model_loaded:true is warm; anything else (slow,
  // failing, asleep, or model_loaded:false) is cold. Polling also nudges an
  // asleep Space awake: fast while cold to catch the wake-up, lazy once warm.
  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
      const { modelLoaded } = await pingHealth(controller.signal);
      clearTimeout(t);
      if (cancelled) return;
      setWarm(modelLoaded);
      pollTimerRef.current = setTimeout(check, modelLoaded ? HEALTH_WARM_POLL_MS : HEALTH_COLD_POLL_MS);
    };

    check();
    return () => { cancelled = true; if (pollTimerRef.current) clearTimeout(pollTimerRef.current); };
  }, []);

  // Clean up timers / in-flight request on unmount.
  useEffect(() => () => {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    abortRef.current?.abort();
  }, []);

  const trimmed = diff.trim();
  const tooMany = fileCount(diff) > 1;
  const tooLong = diff.length > MAX_DIFF_CHARS;
  const isGenerating = status === 'generating';

  const loadExample = (ex: (typeof examples)[number]) => {
    setDiff(ex.diff);
    setStatus('idle');
    setResult('');
    setTyped('');
    setErrorMsg('');
  };

  const runTypewriter = (full: string) => {
    if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    if (reduceMotion) { setTyped(full); return; }
    setTyped('');
    let i = 0;
    typeTimerRef.current = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length && typeTimerRef.current) clearInterval(typeTimerRef.current);
    }, TYPE_SPEED_MS);
  };

  const handleGenerate = async () => {
    if (!trimmed || isGenerating) return;

    setStatus('generating');
    // Health (model_loaded), not latency, decides the copy: if the Space isn't
    // known-warm, this call will pay the cold-boot cost, so show the waking notice.
    setColdStart(!warm);
    setResult('');
    setTyped('');
    setErrorMsg('');
    setSuggestExamples(false);
    setCopied(false);

    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const message = await generateMessage(trimmed, model, controller.signal);
      setWarm(true); // a successful generate proves the model is loaded
      setResult(message);
      setStatus('result');
      runTypewriter(message);
    } catch (err) {
      const e = err as { message?: string; status?: number };
      if (controller.signal.aborted) {
        setErrorMsg('The model took too long to respond. It may still be waking up. Try again in a moment.');
      } else {
        // Prefer the backend's own message (surfaced by generateMessage on a
        // non-2xx); fall back to a generic line for true network/CORS failures.
        setErrorMsg(e.message || 'Could not reach the model. Please try again.');
        // A 4xx means the input itself was rejected (e.g. not a diff), so nudge
        // toward the ready-made examples. Network/5xx errors get no such hint.
        if (e.status !== undefined && e.status >= 400 && e.status < 500) setSuggestExamples(true);
      }
      setStatus('error');
    } finally {
      clearTimeout(timeout);
      abortRef.current = null;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; fail quietly rather than throwing in the UI.
    }
  };

  // Render the commit subject with the type and scope subtly highlighted.
  const renderHighlighted = (msg: string) => {
    const m = msg.match(CC_RE);
    if (!m) return <span style={{ color: 'var(--text-primary)' }}>{msg}</span>;
    const [, type, , scope, bang, subject] = m;
    return (
      <>
        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{type}</span>
        {scope && (
          <span style={{ color: 'var(--text-secondary)' }}>
            (<span style={{ color: '#22c55e' }}>{scope}</span>)
          </span>
        )}
        {bang && <span style={{ color: '#f87171', fontWeight: 700 }}>!</span>}
        <span style={{ color: 'var(--text-secondary)' }}>: </span>
        <span style={{ color: 'var(--text-primary)' }}>{subject}</span>
      </>
    );
  };

  const blinkCursor = (
    <span style={{ display: 'inline-block', width: '9px', height: '1.05em', background: 'var(--accent)', marginLeft: '2px', verticalAlign: 'text-bottom', animation: reduceMotion ? 'none' : 'cblink 0.8s steps(1) infinite' }} />
  );

  const dotColors = ['#e05252', '#e0b752', '#52e07a'];

  return (
    <div style={{ width: '100%' }}>
      {/* Terminal-window card, matching the site's project-thumbnail chrome. */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}>

        {/* Title bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {dotColors.map(c => <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c, opacity: 0.7 }} />)}
          </div>
          <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--text-muted)', marginLeft: '4px' }}>committed - generate</span>
          {/* Connection indicator: honest about whether we're on the mock or a live backend. */}
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: warm ? '#22c55e' : 'var(--text-muted)', boxShadow: warm ? '0 0 6px #22c55e' : 'none' }} />
            {usingMock ? 'mock' : (warm ? 'ready' : 'connecting')}
          </span>
        </div>

        <div style={{ padding: 'clamp(1rem, 3vw, 1.75rem)' }}>

          {/* Example chips */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              {/* PLACEHOLDER examples: the human curates the real ones from the test split. */}
              try an example
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {examples.map(ex => (
                <button key={ex.id} onClick={() => loadExample(ex)}
                  style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', padding: '5px 12px', borderRadius: '20px', background: 'var(--accent-muted)', color: 'var(--accent)', border: '1px solid rgba(var(--accent-rgb), 0.2)', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.2)'}
                >
                  {ex.label}
                  <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>{ex.language}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Model selector: which fine-tune generates the message. Maps to the
              API's optional `model` field (defaults to 1.7b = today's behavior). */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              model
            </div>
            <div role="radiogroup" aria-label="Model" style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
              {MODEL_OPTIONS.map((opt, i) => {
                const selected = model === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setModel(opt.value)}
                    disabled={isGenerating}
                    style={{
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '7px 16px',
                      border: 'none',
                      borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                      cursor: isGenerating ? 'not-allowed' : 'pointer',
                      background: selected ? 'var(--accent-muted)' : 'transparent',
                      color: selected ? 'var(--accent)' : 'var(--text-muted)',
                      transition: 'background 0.2s, color 0.2s',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {/* [placeholder] Add the eval comparison (quality/latency) here once
                known — keep it factual, no invented numbers. */}
            <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Same fine-tune recipe, two sizes — the 0.6B is smaller and faster.
            </div>
          </div>

          {/* Diff input: live syntax highlighting via a transparent textarea
              layered over a highlighted overlay (see HighlightedDiffInput). */}
          <HighlightedDiffInput
            value={diff}
            onChange={e => setDiff(e.target.value)}
            placeholder={'Paste a single-file diff here, or pick an example above…\n\n@@ -1,3 +1,4 @@'}
            rows={12}
            ariaLabel="Code diff input"
          />

          {/* Input meta: char count + gentle nudges */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '10px', minHeight: '20px' }}>
            <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: tooLong ? '#e0b752' : 'var(--text-muted)' }}>
              {diff.length.toLocaleString()} chars
              {tooMany && <span style={{ color: '#e0b752', marginLeft: '12px' }}>· multiple files detected: Committed was trained on single-file diffs</span>}
              {tooLong && <span style={{ color: '#e0b752', marginLeft: '12px' }}>· long input: the model only saw diffs under its token cap</span>}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!trimmed || isGenerating}
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '13px',
                fontWeight: 600,
                padding: '9px 22px',
                borderRadius: '8px',
                border: 'none',
                cursor: (!trimmed || isGenerating) ? 'not-allowed' : 'pointer',
                background: (!trimmed || isGenerating) ? 'var(--bg-secondary)' : 'var(--accent)',
                color: (!trimmed || isGenerating) ? 'var(--text-muted)' : '#fff',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { if (trimmed && !isGenerating) e.currentTarget.style.background = 'var(--accent-hover)'; }}
              onMouseLeave={e => { if (trimmed && !isGenerating) e.currentTarget.style.background = 'var(--accent)'; }}
            >
              {isGenerating ? 'generating…' : 'Generate ↵'}
            </button>
          </div>

          {/* Output area */}
          {status !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ marginTop: '1.25rem', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}
            >
              <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>$ committed</span>
                {status === 'result' && isWellFormed(result) && (
                  <span title="Output matches Conventional Commits syntax. This does not guarantee the type is correct."
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '2px 10px', borderRadius: '20px', background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', fontSize: '10px' }}>
                    ✓ well-formed
                  </span>
                )}
              </div>

              {status === 'generating' && (
                <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {coldStart
                    ? <span>waking the model, first run can take ~30–60s{blinkCursor}</span>
                    : <span>generating…{blinkCursor}</span>}
                </div>
              )}

              {status === 'result' && (
                <>
                  <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(14px, 2vw, 16px)', lineHeight: 1.6, wordBreak: 'break-word' }}>
                    {typed === result
                      ? renderHighlighted(result)
                      : <span style={{ color: 'var(--text-primary)' }}>{typed}{blinkCursor}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                    <button onClick={handleCopy}
                      style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', padding: '6px 14px', borderRadius: '7px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: copied ? '#22c55e' : 'var(--text-secondary)', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >{copied ? '✓ copied' : 'copy'}</button>
                  </div>
                </>
              )}

              {status === 'error' && (
                <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', lineHeight: 1.6 }}>
                  <span style={{ color: '#f87171' }}>{errorMsg}</span>
                  {suggestExamples && (
                    <div style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                      Try one of the example diffs above.
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Privacy line: honest about the network round-trip vs. the offline model. */}
          <p style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.7, marginTop: '1.25rem' }}>
            This hosted demo sends your diff over the network to the model Space to generate a message.
            The model itself is small and runs fully offline. If you would rather not send code anywhere,{' '}
            <a href="#run-locally" style={{ color: 'var(--accent)', textDecoration: 'none' }}>run it locally</a>.
          </p>
        </div>
      </div>

      <style>{`@keyframes cblink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }`}</style>
    </div>
  );
}
