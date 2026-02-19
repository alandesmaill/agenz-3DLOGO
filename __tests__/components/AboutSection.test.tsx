/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import AboutSection from '@/components/dom/AboutSection';

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock('gsap', () => ({
  gsap: {
    registerPlugin: jest.fn(),
    to: jest.fn(() => ({ kill: jest.fn() })),
    fromTo: jest.fn(() => ({ kill: jest.fn() })),
  },
}));
jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { refresh: jest.fn(), update: jest.fn() },
}));

jest.mock('@/components/dom/SmoothScrolling', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('@/components/dom/AnimatedText', () => ({
  __esModule: true,
  default: ({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
    <div className={className} style={style}>{children}</div>
  ),
}));
jest.mock('@/components/dom/Header', () => ({
  __esModule: true,
  default: () => <header data-testid="header" />,
}));
jest.mock('@/components/dom/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer" />,
}));
jest.mock('@/components/dom/MenuOverlay', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt ?? ''} />,
}));

// ── Browser API stubs ──────────────────────────────────────────────────────

beforeAll(() => {
  window.scrollTo = jest.fn();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

// ── Tests ──────────────────────────────────────────────────────────────────

describe('AboutSection — editorial redesign', () => {
  const renderComponent = () => render(<AboutSection />);

  it('renders AGENZ heading with gradient text classes', () => {
    renderComponent();
    const heading = screen.getByRole('heading', { name: /agenz/i });
    expect(heading).toHaveClass('bg-clip-text');
    expect(heading).toHaveClass('text-transparent');
  });

  it('renders the green accent rule above WELCOME TO', () => {
    renderComponent();
    const rule = document.querySelector('.hero-accent-rule');
    expect(rule).toBeInTheDocument();
  });

  it('renders Our Mission label with gradient text classes', () => {
    renderComponent();
    const label = screen.getByText(/our mission/i);
    expect(label).toHaveClass('bg-clip-text');
    expect(label).toHaveClass('text-transparent');
  });

  it('renders mission card with green left border', () => {
    renderComponent();
    const card = document.querySelector('.mission-card');
    expect(card).toHaveClass('border-l-4');
  });

  it('renders CTA watermark element', () => {
    renderComponent();
    const watermark = document.querySelector('.cta-watermark');
    expect(watermark).toBeInTheDocument();
  });

  it('renders CTA button with glow shadow', () => {
    renderComponent();
    const btn = screen.getByRole('link', { name: /get in touch/i });
    expect(btn.className).toMatch(/shadow-\[/);
  });
});
