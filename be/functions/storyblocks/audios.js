const functions = require('firebase-functions');
const admin = require('firebase-admin');

var crypto = require('crypto');
var url = require('url');
let rp = require('request-promise');



exports.getAudioFromStoryBlocks = functions.https.onRequest((req, res) => {
    const idToken = req.header('Authorization');

    admin.auth()
        .verifyIdToken(idToken)
        .then(function (decodedToken) {
            var uid = decodedToken.uid;

            // authentication keys provided by VideoBlocks
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

            // make the API request
            // request(requestOptions, function ​(err, httpResponse, response) {
            //     if (!err && httpResponse.statusCode === 200) {
            //         console.info('Received VideoBlocks API response:', response);
            //         res.json(response)
            //     } else {
            //         console.error('Error communicating with VideoBlocks API');
            //         res.json({ result: 'invalid request'})
            //     }
            // });

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


        }).catch(function (error) {
            // Handle error
            res.json({ result: 'invalid token', code: '1002' })
        });
});