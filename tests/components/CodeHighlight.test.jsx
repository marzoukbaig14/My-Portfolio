// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { CommandLine, CodeBlock, HighlightedDiffInput } from '../../src/app/components/CodeHighlight.js';

afterEach(cleanup);

describe('CommandLine', () => {
  it('renders the full command text and splits it into colored spans', () => {
    const { container } = render(<CommandLine text="$ git status" />);
    expect(container.textContent).toBe('$ git status');
    expect(container.querySelectorAll('span').length).toBeGreaterThan(0);
  });
});

describe('CodeBlock', () => {
  it('renders plain code losslessly, newlines included', () => {
    const code = 'def f():\n    return 1';
    const { container } = render(<CodeBlock code={code} lang="python" />);
    expect(container.textContent).toBe(code);
  });

  it('renders a diff and preserves every character (line breaks become block rows)', () => {
    const code = '@@ -1 +1 @@\n-old\n+new';
    const { container } = render(<CodeBlock code={code} diff lang="python" />);
    expect(container.textContent).toBe(code.replace(/\n/g, ''));
  });
});

describe('HighlightedDiffInput', () => {
  it('exposes an accessible textarea that opts out of Lenis', () => {
    render(<HighlightedDiffInput value="" onChange={() => {}} ariaLabel="Code diff input" />);
    const ta = screen.getByLabelText('Code diff input');
    expect(ta.tagName).toBe('TEXTAREA');
    expect(ta).toHaveAttribute('data-lenis-prevent');
  });

  it('calls onChange when the user types', () => {
    const onChange = vi.fn();
    render(<HighlightedDiffInput value="" onChange={onChange} ariaLabel="Code diff input" />);
    fireEvent.change(screen.getByLabelText('Code diff input'), { target: { value: '+x' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('mirrors the value into the highlight overlay', () => {
    const { container } = render(<HighlightedDiffInput value={'+added\n-removed'} onChange={() => {}} ariaLabel="diff" />);
    const overlay = container.querySelector('pre');
    expect(overlay.textContent).toContain('added');
    expect(overlay.textContent).toContain('removed');
  });
});
