'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app = express();
var crypto = require('crypto');
var url = require('url');
let rp = require('request-promise');

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = (req, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !req.cookies.__session) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <Firebase ID Token>',
        'or by passing a "__session" cookie.');
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  }
  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    next();
  }).catch(error => {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
  });
};

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);
app.get('/getAudioFromStoryBlocks', (req, res) => {

    var VB_API_PUBLIC_KEY = 'p0QltE6gCkv0TdTtlOilmrMDo66EcJtAHllmrnEjINTq8j60Qlb7qdWzfKCfOy8u';
    var VB_API_PRIVATE_KEY = 'LC5kUXrHjFx8djxa1Xfy700WeHLYiemMpFMHngkV8eLhH6xBcs0AKPQCDqtqHNS3';
    var resource = '/api/v1/stock-items/search/';
    var audioBlocksUrl = 'https://api.audioblocks.com' + resource;
    // Generate HMAC for VideoBlocks API Authentication
    var unixTimeInSeconds = Math.floor(Date.now() / 1000);
    var hmac = crypto.createHmac('sha256', VB_API_PRIVATE_KEY + unixTimeInSeconds);
    hmac.update(resource);
    var hmacString = hmac.digest('hex');

    // set up query options
    var urlParms = {
        //Search params
        keywords: req.query.keywords,
        page: req.query.page,
        number_results: req.query.number_results,
        //HMAC params
        EXPIRES: unixTimeInSeconds,
        APIKEY: VB_API_PUBLIC_KEY,
        HMAC: hmacString
    };

    // generate the request module options
    var requestOptions = {
        url: audioBlocksUrl,
        qs: urlParms,
        useQuerystring: true,
        json: true,
        method: 'GET'
    };

    rp(requestOptions)
        .then(response => {
            //TODO Continue logic to download resource...
            console.info('Received VideoBlocks API response:', response);

            //var downladerId = 'CarCloudVentures';
            //var resource = `/api/v1/stock-items/download/${stockItemId}/${downloaderId}`;

            //utils.response.success(callback, response.body, response.statusCode);
            res.json(response)
        })
        .catch(error => res.json(error));
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.getAudioFromStoryBlocks = functions.https.onRequest(app);

// exports.getAudioFromStoryBlocks = functions.https.onRequest((req, res) => {

//     cors((req, res, () => {
//         // const idToken = req.header('Authorization');

//         // admin.auth()
//         //     .verifyIdToken(idToken)
//         //     .then(function (decodedToken) {
//         //         var uid = decodedToken.uid;

//         // authentication keys provided by VideoBlocks
//         var VB_API_PUBLIC_KEY = 'p0QltE6gCkv0TdTtlOilmrMDo66EcJtAHllmrnEjINTq8j60Qlb7qdWzfKCfOy8u';
//         var VB_API_PRIVATE_KEY = 'LC5kUXrHjFx8djxa1Xfy700WeHLYiemMpFMHngkV8eLhH6xBcs0AKPQCDqtqHNS3';
//         var resource = '/api/v1/stock-items/search/';
//         var audioBlocksUrl = 'https://api.audioblocks.com' + resource;
//         // Generate HMAC for VideoBlocks API Authentication
//         var unixTimeInSeconds = Math.floor(Date.now() / 1000);
//         var hmac = crypto.createHmac('sha256', VB_API_PRIVATE_KEY + unixTimeInSeconds);
//         hmac.update(resource);
//         var hmacString = hmac.digest('hex');

//         // set up query options
//         var urlParms = {
//             //Search params
//             keywords: req.query.keywords,
//             page: req.query.page,
//             number_results: req.query.number_results,
//             //HMAC params
//             EXPIRES: unixTimeInSeconds,
//             APIKEY: VB_API_PUBLIC_KEY,
//             HMAC: hmacString
//         };

//         // generate the request module options
//         var requestOptions = {
//             url: audioBlocksUrl,
//             qs: urlParms,
//             useQuerystring: true,
//             json: true,
//             method: 'GET'
//         };

//         // make the API request
//         // request(requestOptions, function ​(err, httpResponse, response) {
//         //     if (!err && httpResponse.statusCode === 200) {
//         //         console.info('Received VideoBlocks API response:', response);
//         //         res.json(response)
//         //     } else {
//         //         console.error('Error communicating with VideoBlocks API');
//         //         res.json({ result: 'invalid request'})
//         //     }
//         // });

//         rp(requestOptions)
//             .then(response => {
//                 //TODO Continue logic to download resource...
//                 console.info('Received VideoBlocks API response:', response);

//                 //var downladerId = 'CarCloudVentures';
//                 //var resource = `/api/v1/stock-items/download/${stockItemId}/${downloaderId}`;

//                 //utils.response.success(callback, response.body, response.statusCode);
//                 res.json(response)
//             })
//             .catch(error => res.json(error));

//         // }).catch(function (error) {
//         //     // Handle error
//         //     res.json({ result: 'invalid token', code: '1002' })
//         // });
//     }));
// });