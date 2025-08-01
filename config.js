const ENV = "LOCAL";

const configs = {
  LOCAL: {
    apiBaseUrl: "http://localhost:3001/"
  }
};

const config = () => configs[ENV];

const configModule = { config };

export default configModule;
