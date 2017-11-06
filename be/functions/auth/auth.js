const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.validateUserToken = functions.https.onRequest((req, res) => {
  const idToken = req.header('Authorization');

  admin.auth().verifyIdToken(idToken)
    .then(function (decodedToken) {
      var uid = decodedToken.uid;
      res.json({result: 'valid token', code: '1001'})
    }).catch(function (error) {
      // Handle error
      res.json({result: 'invalid token', code: '1002'})
    });
});


exports.validateOperation = functions.https.onRequest((req, res) => {
  const idToken = req.header('Authorization');
  const opType = req.body.opType;

  admin.auth().verifyIdToken(idToken)
    .then(function (decodedToken) {
      const uid = decodedToken.uid;
      const opType = req.body.opType;

      if(opType === "build"){
        projectId = req.body.projectId;
        const projectData =  admin.database().ref(`/users-projects/${uid}/${projectId}`);
      }

      //var availableCoins = admin.database().ref(`/users/${uid}/credits`);
      //res.json({result: 'valid token', operation: "valid",  code: '1001'})
    }).catch(function (error) {
      // Handle error
      res.json({result: 'invalid token', code: '1002'})
    });
});
