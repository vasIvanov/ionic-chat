import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.chationic.app",
  appName: "chationic",
  webDir: "build",
  server: {
    url: "http://localhost:8100",
    cleartext: true,
  },
};

export default config;
