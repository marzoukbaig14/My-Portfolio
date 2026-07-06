'use client';
// Shared model selection. Lets the demo (which model generates your message),
// the results comparison (which model is spotlighted), and the hero numbers all
// stay in sync from one two-button toggle. Defaults to "0.6b" — the flagship and
// (once the API default-flip lands) the server default.
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { ModelId } from './api';

interface ModelCtx {
  model: ModelId;
  setModel: (m: ModelId) => void;
}

// Default keeps consumers safe if ever rendered outside the provider (they just
// won't sync) — no throw, which suits a portfolio page.
const ModelContext = createContext<ModelCtx>({ model: '0.6b', setModel: () => {} });

export function ModelProvider({ children }: { children: ReactNode }) {
  const [model, setModel] = useState<ModelId>('0.6b');
  return <ModelContext.Provider value={{ model, setModel }}>{children}</ModelContext.Provider>;
}

export function useModel() {
  return useContext(ModelContext);
}
