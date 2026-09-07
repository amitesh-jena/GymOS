import '@testing-library/jest-dom';
import { server } from './server';
import { Blob, File } from 'buffer';

(global as any).Blob = Blob;
(global as any).File = File;

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Suppress Recharts ResponsiveContainer warnings in JSDOM
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  const React = require('react');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => 
      React.createElement('div', { style: { width: 800, height: 400 } }, children)
  };
});

