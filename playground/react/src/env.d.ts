// env.d.ts
interface ImportMetaEnv {
  readonly VITE_GATEKEEPER_REACT_KEY: string;
  readonly VITE_GATEKEEPER_REACT_IV: string;
  readonly VITE_GATEKEEPER_REACT_SECRET: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
