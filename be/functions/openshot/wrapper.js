const functions = require('firebase-functions');
const rp = require('request-promise');
const constants = require('../utils/constants');

//project
exports.project = functions.https.onRequest((request, response) => {
  const options = constants.BASE_OS_DEV_REQUEST;
  options.url = `${constants.OPENSHOT_URL}projects/?format=json`;
  options.formData = {
    name: request.body.userId,
    json: '{}'
  };

  rp
    .post(options)
    .then((res) => {
      response.json(res.body);
    })
    .catch((err) => {
      response.json(err.error);
    })
});

exports.updateProject = functions.https.onRequest((req, res) => {
  return {}
});

//file

//clip

//export

