/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as FooterSTDefault,
  Centered as FooterSTCentered,
} from '@/components/site-three/FooterST';

// Mock FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, width, height }: any) => (
    <span
      data-testid="font-awesome-icon"
      data-icon={icon.iconName}
      data-width={width}
      data-height={height}
    />
  ),
}));

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag: Tag = 'span', ...props }: any) => <Tag {...props}>{field?.value || ''}</Tag>,
  RichText: ({ field, ...props }: any) => <div {...props}>{field?.value || ''}</div>,
  Link: ({ field, children, ...props }: any) => (
    <a href={field?.value?.href || '#'} {...props}>
      {children}
    </a>
  ),
  Placeholder: ({ name }: any) => <div data-testid={`placeholder-${name}`} />,
}));

describe('FooterST', () => {
  const mockProps = {
    rendering: {
      uid: 'footer-uid',
      componentName: 'FooterST',
    },
    params: {
      styles: 'test-styles',
      DynamicPlaceholderId: 'test-id',
    },
    fields: {
      Title: {
        value: 'Footer Title',
      },
      CopyrightText: {
        value: '© 2025 Company Name. All rights reserved.',
      },
      FacebookLink: {
        value: {
          href: 'https://facebook.com/company',
          text: 'Facebook',
        },
      },
      InstagramLink: {
        value: {
          href: 'https://instagram.com/company',
          text: 'Instagram',
        },
      },
      LinkedinLink: {
        value: {
          href: 'https://linkedin.com/company',
          text: 'LinkedIn',
        },
      },
    },
  };

  describe('Default variant', () => {
    it('renders footer with title', () => {
      render(<FooterSTDefault {...mockProps} />);
      expect(screen.getByText('Footer Title')).toBeInTheDocument();
    });

    it('renders social media links', () => {
      render(<FooterSTDefault {...mockProps} />);
      const icons = screen.getAllByTestId('font-awesome-icon');
      expect(icons.length).toBe(3);
    });

    it('renders copyright text', () => {
      render(<FooterSTDefault {...mockProps} />);
      expect(screen.getByText('© 2025 Company Name. All rights reserved.')).toBeInTheDocument();
    });

    it('renders placeholders', () => {
      render(<FooterSTDefault {...mockProps} />);
      expect(screen.getByTestId('placeholder-footer-primary-links-test-id')).toBeInTheDocument();
      expect(screen.getByTestId('placeholder-footer-secondary-links-test-id')).toBeInTheDocument();
    });
  });

  describe('Centered variant', () => {
    it('renders footer with title', () => {
      render(<FooterSTCentered {...mockProps} />);
      expect(screen.getByText('Footer Title')).toBeInTheDocument();
    });

    it('renders social media links with icons', () => {
      render(<FooterSTCentered {...mockProps} />);
      const icons = screen.getAllByTestId('font-awesome-icon');
      expect(icons).toHaveLength(3);
    });

    it('renders copyright text', () => {
      render(<FooterSTCentered {...mockProps} />);
      expect(screen.getByText('© 2025 Company Name. All rights reserved.')).toBeInTheDocument();
    });

    it('renders placeholders', () => {
      render(<FooterSTCentered {...mockProps} />);
      expect(screen.getByTestId('placeholder-footer-primary-links-test-id')).toBeInTheDocument();
      expect(screen.getByTestId('placeholder-footer-secondary-links-test-id')).toBeInTheDocument();
    });
  });
});
