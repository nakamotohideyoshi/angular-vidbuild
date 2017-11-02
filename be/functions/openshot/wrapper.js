const functions = require('firebase-functions');
const admin = require('firebase-admin');
var rp = require('request-promise');
const _ = require('lodash')
const openshotUrl = 'http://35.176.151.11/';


//proyect
exports.project = functions.https.onRequest((request, response) => {
    //call to openshot -> success ->

    //get

    //post

    //put

    //delete

    
    var options = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic a29sZXNrZXI6a29sZXNrZXIxMjM="
        },
        json: true,
        resolveWithFullResponse: true,
        url: openshotUrl + 'projects/?format=json',
        formData: {
            name: request.body.userId,
            json: '{}'
        }
    };
    rp
    .post(options)
    .then((res)=>{
        console.log(res.body);
        response.json(res.body);
    })
    .catch((err) => {
        console.log(err.error);
        response.json(err.error);
    })
});

exports.updateProject = functions.https.onRequest((req, res) => {
    return {}
});

//file

//clip

//export

