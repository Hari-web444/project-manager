const ENV = "LOCAL";

const configs = {
  LOCAL: {
    apiBaseUrl: "http://localhost:3001/"
  },
  DEV: {
    apiBaseUrl: "https://dev-api.vaithiyarpoovafoundation.com/"
  },
  PROD: {
    apiBaseUrl: "https://dev-api.vaithiyarpoovafoundation.com/",
  },
};

const config = () => configs[ENV];

const configModule = { config };

export default configModule;
