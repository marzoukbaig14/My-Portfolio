'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { examples } from './examples';
import { generateMessage, pingHealth, usingMock } from './api';

// Tunables — the human can adjust these once the real model/limits are known.
const COLD_START_HINT_MS = 4000;   // after this long with no reply, show the "waking" copy
const REQUEST_TIMEOUT_MS = 90_000; // give a cold Space room to wake before giving up
const MAX_DIFF_CHARS = 6000;       // rough proxy for the training token cap (single-file diffs)
const TYPE_SPEED_MS = 16;          // typewriter reveal speed, per character

// Conventional Commit subject grammar: type(scope)!: subject
// We use this twice — to render the "well-formed" badge and to highlight the
// type/scope. A match means the syntax is valid; it does NOT mean the type is
// the right call. We never claim more than "well-formed".
const CC_RE = /^([a-z]+)(\(([^)]+)\))?(!)?:\s(.+)$/i;

function isWellFormed(msg) {
  return CC_RE.test(msg.trim());
}

// Count the file headers in a diff. Committed only saw single-file diffs, so
// more than one is worth a gentle nudge.
function fileCount(diff) {
  const m = diff.match(/^diff --git /gm) || diff.match(/^\+\+\+ /gm) || [];
  return m.length;
}

export default function CommittedDemo() {
  const [diff, setDiff] = useState('');
  const [status, setStatus] = useState('idle'); // idle | generating | result | error
  const [coldStart, setColdStart] = useState(false);
  const [warm, setWarm] = useState(false);
  const [result, setResult] = useState('');
  const [typed, setTyped] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const abortRef = useRef(null);
  const coldTimerRef = useRef(null);
  const typeTimerRef = useRef(null);

  // Honor reduced-motion: it gates the typewriter and the blinking cursor.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = (e) => setReduceMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Pre-warm the Space on mount so the first real generate is more likely warm.
  useEffect(() => {
    let cancelled = false;
    pingHealth().then((ok) => { if (!cancelled && ok) setWarm(true); });
    return () => { cancelled = true; };
  }, []);

  // Clean up timers / in-flight request on unmount.
  useEffect(() => () => {
    clearTimeout(coldTimerRef.current);
    clearInterval(typeTimerRef.current);
    abortRef.current?.abort();
  }, []);

  const trimmed = diff.trim();
  const tooMany = fileCount(diff) > 1;
  const tooLong = diff.length > MAX_DIFF_CHARS;
  const isGenerating = status === 'generating';

  const loadExample = (ex) => {
    setDiff(ex.diff);
    setStatus('idle');
    setResult('');
    setTyped('');
    setErrorMsg('');
  };

  const runTypewriter = (full) => {
    clearInterval(typeTimerRef.current);
    if (reduceMotion) { setTyped(full); return; }
    setTyped('');
    let i = 0;
    typeTimerRef.current = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(typeTimerRef.current);
    }, TYPE_SPEED_MS);
  };

  const handleGenerate = async () => {
    if (!trimmed || isGenerating) return;

    setStatus('generating');
    setColdStart(!warm); // if health hasn't confirmed warm yet, assume a cold start
    setResult('');
    setTyped('');
    setErrorMsg('');
    setCopied(false);

    // If the reply is slow, surface the cold-start message even if we thought warm.
    clearTimeout(coldTimerRef.current);
    coldTimerRef.current = setTimeout(() => setColdStart(true), COLD_START_HINT_MS);

    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const message = await generateMessage(trimmed, controller.signal);
      setWarm(true);
      setResult(message);
      setStatus('result');
      runTypewriter(message);
    } catch (err) {
      if (controller.signal.aborted) {
        setErrorMsg('The model took too long to respond. It may still be waking up — try again in a moment.');
      } else {
        // A blocked browser call is almost always CORS, fixed on the backend side.
        setErrorMsg('Could not reach the model. If this is the hosted demo, the Space may be asleep or blocking the request (CORS). Try again shortly.');
      }
      setStatus('error');
    } finally {
      clearTimeout(timeout);
      clearTimeout(coldTimerRef.current);
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
  const renderHighlighted = (msg) => {
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
          <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--text-muted)', marginLeft: '4px' }}>committed — generate</span>
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
              {/* PLACEHOLDER examples — the human curates the real ones from the test split. */}
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

          {/* Diff input */}
          <textarea
            value={diff}
            onChange={e => setDiff(e.target.value)}
            placeholder={'Paste a single-file diff here, or pick an example above…\n\n@@ -1,3 +1,4 @@'}
            spellCheck={false}
            aria-label="Code diff input"
            rows={12}
            style={{
              width: '100%',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '14px 16px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '13px',
              lineHeight: 1.6,
              outline: 'none',
              resize: 'vertical',
              transition: 'border-color 0.2s',
              whiteSpace: 'pre',
              overflowWrap: 'normal',
              overflowX: 'auto',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
          />

          {/* Input meta: char count + gentle nudges */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '10px', minHeight: '20px' }}>
            <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: tooLong ? '#e0b752' : 'var(--text-muted)' }}>
              {diff.length.toLocaleString()} chars
              {tooMany && <span style={{ color: '#e0b752', marginLeft: '12px' }}>· multiple files detected — Committed was trained on single-file diffs</span>}
              {tooLong && <span style={{ color: '#e0b752', marginLeft: '12px' }}>· long input — the model only saw diffs under its token cap</span>}
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
                    ? <span>waking the model — first run can take ~30–60s{blinkCursor}</span>
                    : <span>thinking{blinkCursor}</span>}
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
                <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', color: '#f87171', lineHeight: 1.6 }}>
                  {errorMsg}
                </div>
              )}
            </motion.div>
          )}

          {/* Privacy line — honest about the network round-trip vs. the offline model. */}
          <p style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.7, marginTop: '1.25rem' }}>
            This hosted demo sends your diff over the network to the model Space to generate a message.
            The model itself is small and runs fully offline — if you would rather not send code anywhere,{' '}
            <a href="#run-locally" style={{ color: 'var(--accent)', textDecoration: 'none' }}>run it locally</a>.
          </p>
        </div>
      </div>

      <style>{`@keyframes cblink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }`}</style>
    </div>
  );
}
