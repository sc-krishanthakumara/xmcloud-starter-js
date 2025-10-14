/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock lucide-react to avoid ESM parsing in jest
jest.mock('lucide-react', () => ({
  Share2: () => <svg data-testid="icon-share" />,
  X: () => <svg data-testid="icon-x" />,
  CheckCircle: () => <svg data-testid="icon-check" />,
}));

// Mock framer-motion primitives used in the component to simple pass-throughs
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: (props: any) => <div {...props}>{props.children}</div>,
  },
  useMotionValue: (v: any) => ({ set: () => {}, get: () => v }),
  useTransform: () => 0,
  useSpring: (v: any) => v,
}));

import { FloatingDock } from '@/components/floating-dock/floating-dock.dev';

describe('FloatingDock', () => {
  it('renders trigger and toggles mobile menu', () => {
    const items = [
      { title: 'Share', icon: <span>i1</span>, href: '/s1' },
      { title: 'Email', icon: <span>i2</span>, href: '/s2' },
    ];

    render(<FloatingDock items={items} />);

    const trigger = screen.getByRole('button', { name: /open share menu/i });
    expect(trigger).toBeInTheDocument();

    // open menu
    fireEvent.click(trigger);

    // after open, menu items should be present (buttons with aria-label)
    expect(screen.getByRole('menuitem', { name: 'Share' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Email' })).toBeInTheDocument();
  });
});
