import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.yuyao.hsefrontier",
  appName: "安全边界",
  webDir: "out",
  backgroundColor: "#0c1b25",
  android: {
    backgroundColor: "#0c1b25",
    allowMixedContent: false,
  },
};

export default config;
