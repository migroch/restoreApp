//external-account-config.js
// Configuration of external account authentication services

ServiceConfiguration.configurations.upsert(
  { service: 'google' },
  {
    $set: {
	loginStyle: "popup",
	clientId: "t.apps.googleusercontent.com",
	secret: "",
    }
  }
);

