/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_USE_MOCK_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare var process: {
  env: {
    readonly [key: string]: string | undefined;
    readonly VITE_API_BASE_URL?: string;
  };
};
