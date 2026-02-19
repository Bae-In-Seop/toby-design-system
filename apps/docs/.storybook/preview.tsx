import React, { useEffect } from 'react';
import type { Preview } from '@storybook/react-vite';
import { ThemeProvider } from '@toby-design/components';
import type { Theme } from '@toby-design/components';
import '@toby-design/tokens/css';

const ThemeDecorator = ({ theme, children }: { theme: Theme; children: React.ReactNode }) => {
  useEffect(() => {
    document.documentElement.style.backgroundColor =
      theme === 'dark' ? '#0f172a' : '#ffffff';
  }, [theme]);

  return (
    <ThemeProvider defaultTheme={theme}>
      {children}
    </ThemeProvider>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme || 'light') as Theme;
      return (
        <ThemeDecorator theme={theme}>
          <Story />
        </ThemeDecorator>
      );
    },
  ],
};

export default preview;
