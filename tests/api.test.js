import { describe, it, expect, vi, afterEach } from 'vitest';
import { pingHealth, generateMessage } from '../src/app/committed/api.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

const mockFetch = (impl) => vi.stubGlobal('fetch', vi.fn(impl));

describe('pingHealth', () => {
  it('reports modelLoaded when health returns model_loaded:true', async () => {
    mockFetch(async () => ({ ok: true, json: async () => ({ model_loaded: true }) }));
    expect(await pingHealth()).toEqual({ ok: true, modelLoaded: true });
  });

  it('treats a non-200 as cold', async () => {
    mockFetch(async () => ({ ok: false, json: async () => ({}) }));
    expect(await pingHealth()).toEqual({ ok: false, modelLoaded: false });
  });

  it('never throws on a network failure', async () => {
    mockFetch(async () => { throw new Error('network'); });
    expect(await pingHealth()).toEqual({ ok: false, modelLoaded: false });
  });

  it('is ok-but-cold when the body is not valid JSON', async () => {
    mockFetch(async () => ({ ok: true, json: async () => { throw new Error('bad json'); } }));
    expect(await pingHealth()).toEqual({ ok: true, modelLoaded: false });
  });
});

describe('generateMessage', () => {
  it('returns the message string on success', async () => {
    mockFetch(async () => ({ ok: true, json: async () => ({ message: 'feat: x' }) }));
    expect(await generateMessage('diff')).toBe('feat: x');
  });

  it('throws the backend detail on a 4xx and carries the status', async () => {
    mockFetch(async () => ({ ok: false, status: 400, json: async () => ({ detail: 'not a diff' }) }));
    const err = await generateMessage('x').catch((e) => e);
    expect(err.message).toBe('not a diff');
    expect(err.status).toBe(400);
  });

  it('falls back to a generic message when the error body has no detail', async () => {
    mockFetch(async () => ({ ok: false, status: 500, json: async () => { throw new Error('no body'); } }));
    const err = await generateMessage('x').catch((e) => e);
    expect(err.message).toBe('Backend responded 500');
    expect(err.status).toBe(500);
  });

  it('rejects a malformed success body', async () => {
    mockFetch(async () => ({ ok: true, json: async () => ({ nope: 1 }) }));
    await expect(generateMessage('x')).rejects.toThrow('Malformed response');
  });
});
