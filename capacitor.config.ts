
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4329eb57f89c4ae7972344e8813eeb77',
  appName: 'bleacher-banter-buzz',
  webDir: 'dist',
  server: {
    url: 'https://4329eb57-f89c-4ae7-9723-44e8813eeb77.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
    }
  }
};

export default config;
