import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'tr.yzasistani.chat',
  appName: 'YZ Asistanı',
  webDir: 'www',
  server: {
    url: 'https://sohbet.yzasistani.tr',
    cleartext: false,
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#f5f7fb'
  }
};

export default config;
