import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.yuyao.safedrop",
  appName: "安全落点",
  webDir: "www",
  bundledWebRuntime: false,
  android: {
    backgroundColor: "#06110c",
    allowMixedContent: false
  }
};

export default config;
