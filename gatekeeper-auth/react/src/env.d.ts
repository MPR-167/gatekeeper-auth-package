// env.d.ts
interface ImportMetaEnv {
  readonly VITE_GATEKEEPER_PUBLISHABLE_KEY: string;
  readonly VITE_GATEKEEPER_DOMAIN: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
