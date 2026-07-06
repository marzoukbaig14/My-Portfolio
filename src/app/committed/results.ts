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
    blurb: 'The bigger sibling. Same recipe on a larger base — a little more specific (0.67 vs 0.55) at about 3x the parameters. Reach for it when you want maximum specificity.',
    stats: [
      { label: 'graded mean (0–3)', value: '2.139' },
      { label: 'type-correctness', value: '0.778' },
      { label: 'faithfulness', value: '0.848' },
      { label: 'specificity', value: '0.667' },
    ],
  },
  '0.6b': {
    blurb: 'The default. It matches the 1.7B on commit-type and faithfulness at roughly a third the parameters — a smaller download and faster local inference. The honest trade: slightly vaguer messages (specificity 0.55 vs 0.67).',
    stats: [
      { label: 'graded mean (0–3)', value: '2.094' },
      { label: 'type-correctness', value: '0.726' },
      { label: 'faithfulness', value: '0.810' },
      { label: 'specificity', value: '0.545' },
    ],
  },
};

// Hero stat trio, model-aware (base -> fine-tune deltas). The narrative copy in
// the hero stays fixed; only these figures flip with the toggle.
export const HERO: Record<ModelId, { value: string; label: string; hint: string }[]> = {
  '1.7b': [
    { value: '0.13 → 0.64', label: 'commit-type accuracy', hint: 'vs. base, reweighted' },
    { value: '0.49 → 0.85', label: 'faithfulness', hint: 'vs. base model' },
    { value: '1.45 → 2.14', label: 'graded mean (0–3)', hint: 'LLM-judge score' },
  ],
  '0.6b': [
    { value: '0.15 → 0.60', label: 'commit-type accuracy', hint: 'vs. base, reweighted' },
    { value: '0.29 → 0.81', label: 'faithfulness', hint: 'vs. base model' },
    { value: '0.78 → 2.09', label: 'graded mean (0–3)', hint: 'LLM-judge score' },
  ],
};

// Judge <-> human agreement (n=50 blind hand-ratings, DeepSeek judge, validated
// on the 1.7B baseline candidates). Specificity is the weakest-agreement axis.
export const JUDGE_AGREEMENT = {
  n: 50,
  axes: [
    { axis: 'type-correctness', agreement: '0.82', kappa: '0.61' },
    { axis: 'faithfulness', agreement: '0.78', kappa: '0.56' },
    { axis: 'completeness', agreement: '0.80', kappa: '0.60' },
    { axis: 'specificity', agreement: '0.88', kappa: '0.34' },
  ],
};
