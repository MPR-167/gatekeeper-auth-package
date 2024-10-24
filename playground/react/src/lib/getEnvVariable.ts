export const getEnvVariable = (key: string) => {
  // If we're in a Node.js environment (backend), use process.env
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }

  // Otherwise, in Vite frontend, use import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key as keyof ImportMetaEnv];
  }

  return undefined;
};

export const getPublicEnvVariables = () => {
  return {
    clientSecret: getEnvVariable('VITE_GATEKEEPER_CLIENT_SECRET'),
    clientId: getEnvVariable('VITE_GATEKEEPER_CLIENT_ID'),
  };
};

