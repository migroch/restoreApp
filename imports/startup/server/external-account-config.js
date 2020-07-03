//external-account-config.js
// Configuration of external account authentication services

ServiceConfiguration.configurations.upsert(
  { service: 'google' },
  {
    $set: {
        loginStyle: "popup",
        clientId: "748182856727-g8mf23sfhchrtlklgqes4ji022f644b3.apps.googleusercontent.com",
        secret: "scGBoZR8FvIw0GXvtSF8mTMp",
    }
  }
);

