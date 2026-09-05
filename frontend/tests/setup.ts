import '@testing-library/jest-dom';
import { server } from './server';
import { Blob, File } from 'buffer';

(global as any).Blob = Blob;
(global as any).File = File;

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
