// Single source of truth for the Committed eval numbers and model metadata.
//
// Both models share an identical pipeline (data, filter, QLoRA recipe, grammar,
// serving) — only the base model differs, and therefore only the numbers do.
// So all model-specific content lives here as data; the page renders it once.
//
// Numbers: v2-i1 eval, DeepSeek (deepseek-chat) judge, deployment-reweighted to
// the test split's true commit-type distribution, 442-example sample. All four
// arms were judged by the SAME judge, so every cross-model delta is
// apples-to-apples. (These are NOT comparable to earlier Gemini-judged figures.)

import type { ModelId } from './api';

export interface ModelMeta {
  id: ModelId;
  label: string; // human-facing, e.g. "Qwen3-1.7B"
  params: string; // "1.7B"
}

export const MODELS: Record<ModelId, ModelMeta> = {
  '1.7b': { id: '1.7b', label: 'Qwen3-1.7B', params: '1.7B' },
  '0.6b': { id: '0.6b', label: 'Qwen3-0.6B', params: '0.6B' },
};

// Display order for toggles/columns. First entry is the default selection.
export const MODEL_ORDER: ModelId[] = ['1.7b', '0.6b'];

export interface MetricRow {
  metric: string;
  hint?: string;
  base: Record<ModelId, string>;
  ft: Record<ModelId, string>;
  // feat-share is a diagnostic (base collapses to ~all-feat), not a "higher is
  // better" score, so it renders neutrally rather than as an accent win.
  neutral?: boolean;
}

export const METRICS: MetricRow[] = [
  { metric: 'Prefix-type accuracy', hint: 'reweighted; always-fix floor 0.489', base: { '1.7b': '0.131', '0.6b': '0.154' }, ft: { '1.7b': '0.637', '0.6b': '0.601' } },
  { metric: 'Type-correctness', base: { '1.7b': '0.296', '0.6b': '0.296' }, ft: { '1.7b': '0.778', '0.6b': '0.726' } },
  { metric: 'Faithfulness', base: { '1.7b': '0.491', '0.6b': '0.285' }, ft: { '1.7b': '0.848', '0.6b': '0.810' } },
  { metric: 'Completeness', base: { '1.7b': '0.543', '0.6b': '0.353' }, ft: { '1.7b': '0.776', '0.6b': '0.729' } },
  { metric: 'Specificity', base: { '1.7b': '0.814', '0.6b': '0.414' }, ft: { '1.7b': '0.667', '0.6b': '0.545' } },
  { metric: 'Conjunctive (all 4)', base: { '1.7b': '0.175', '0.6b': '0.101' }, ft: { '1.7b': '0.471', '0.6b': '0.359' } },
  { metric: 'Graded mean (0–3)', base: { '1.7b': '1.447', '0.6b': '0.777' }, ft: { '1.7b': '2.139', '0.6b': '2.094' } },
  { metric: 'feat-share of outputs', hint: 'diagnostic: base collapses to ~all-feat', base: { '1.7b': '95.5%', '0.6b': '86.7%' }, ft: { '1.7b': '8.4%', '0.6b': '9.7%' }, neutral: true },
];

export const EVAL_META = {
  sample: 442,
  judge: 'DeepSeek (deepseek-chat)',
  floor: '0.489',
};

// Short, model-aware summary shown as a focused readout that changes with the
// toggle. Values are the fine-tune column from METRICS above.
export const SUMMARY: Record<ModelId, { blurb: string; stats: { label: string; value: string }[] }> = {
  '1.7b': {
    blurb: 'The flagship: strongest on every judged axis, and the more specific of the two.',
    stats: [
      { label: 'graded mean (0–3)', value: '2.139' },
      { label: 'type-correctness', value: '0.778' },
      { label: 'faithfulness', value: '0.848' },
      { label: 'specificity', value: '0.667' },
    ],
  },
  '0.6b': {
    blurb: 'Nearly matches the 1.7B (graded 2.09 vs 2.14) at roughly a third the size; a touch vaguer (specificity 0.55 vs 0.67).',
    stats: [
      { label: 'graded mean (0–3)', value: '2.094' },
      { label: 'type-correctness', value: '0.726' },
      { label: 'faithfulness', value: '0.810' },
      { label: 'specificity', value: '0.545' },
    ],
  },
};
