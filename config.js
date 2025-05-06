const ENV = "LOCAL";

const configs = {
  LOCAL: {
    apiBaseUrl: "http://localhost:3001/"
  },
  DEV: {
    apiBaseUrl: "https://api.vaithiyarpoova.dev/"
  },
  PROD: {
    apiBaseUrl: "https://api.vaithiyarpoova.ai/",
  },
};

const config = () => configs[ENV];

const configModule = { config };

export default configModule;
