// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// next/link needs the App Router runtime; for a render smoke test a plain
// anchor stand-in is enough.
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

import Projects from '../../src/app/components/Projects';

afterEach(cleanup);

describe('Projects', () => {
  it('renders project titles from the data file', () => {
    render(<Projects />);
    expect(screen.getByText('GPT from Scratch')).toBeInTheDocument();
    expect(screen.getByText('Neural Networks from Scratch')).toBeInTheDocument();
    expect(screen.getByText('Listening to Southern Maine')).toBeInTheDocument();
  });
});
