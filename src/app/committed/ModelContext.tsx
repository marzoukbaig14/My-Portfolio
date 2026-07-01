'use client';
// Shared model selection. Lets the demo (which model generates your message)
// and the results comparison (which model is spotlighted) stay in sync from one
// two-button toggle. Defaults to "1.7b" — the flagship and the server default.
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { ModelId } from './api';

interface ModelCtx {
  model: ModelId;
  setModel: (m: ModelId) => void;
}

// Default value keeps consumers safe if ever rendered outside the provider
// (they just won't sync) — no throw, which suits a portfolio page.
const ModelContext = createContext<ModelCtx>({ model: '1.7b', setModel: () => {} });

export function ModelProvider({ children }: { children: ReactNode }) {
  const [model, setModel] = useState<ModelId>('1.7b');
  return <ModelContext.Provider value={{ model, setModel }}>{children}</ModelContext.Provider>;
}

export function useModel() {
  return useContext(ModelContext);
}
