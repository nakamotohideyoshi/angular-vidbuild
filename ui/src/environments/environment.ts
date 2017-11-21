// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  stripeKey: 'pk_test_mAtTgNJm3I2lrS1UOlEU5nrR',
  preventAngularBoostraping: true,
  preventAngularBoostrapingPassword: 'v*2$5X0e41US',
  debounceTime: 400,
  firebase: {
    apiKey: "AIzaSyBeEbJem1s2yT_Gsu-uHUO0ujr5Z7AWbvM",
    authDomain: "vidbuild-61b8e.firebaseapp.com",
    databaseURL: "https://vidbuild-61b8e.firebaseio.com",
    projectId: "vidbuild-61b8e",
    storageBucket: "vidbuild-61b8e.appspot.com",
    messagingSenderId: "340922004102"
  },
  getty: {
    client_id: "pj3ke3sdtqseuf2wqmpszqft",
    client_secret: "Z86PSzcUMCxua2KaABhBTUnWuNrBQnCMa2uYeNEMu8Jek",
    grant_type: "client_credentials",
    baseUrl: "https://api.gettyimages.com/",
    apiKey: "pj3ke3sdtqseuf2wqmpszqft"
  },
  audioblocks: {
    baseUrl: 'https://api.audioblocks.com/'
  },
  BASE_OPENSHOT_URL: 'http://35.176.151.11', // 'http://cloud.openshot.org', // 'http://35.176.183.215',
  BASE_OPENSHOT_PROXY: 'openshot'
};
