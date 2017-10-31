const functions = require('firebase-functions');
const admin = require('firebase-admin');
var rp = require('request-promise');
const _ = require('lodash')

getUserCredits = function (userId) {
    return admin.database()
        .ref('/users/' + userId + '/coins')
        .once('value')
        .then(snapshot => snapshot.val())
}

let calculateProjectCredits = new Promise((resolve, reject) => {
    resolve(10);
});

//Validate Processs 
exports.validateProcessType = functions.database.ref('/users-current-project/{userId}').onWrite(event => {
    let userId = event.params.userId;
    //let objRef =  functions.database.ref(`/users-current-project/${userId}`)
    const snapshot = event.resource;
    const val = snapshot.val();
    let updates = [];

    if (snapshot.type == 'export' && snapshot.status == "validating") {

        //check credits
        getUserCredits(userId).then(creditsAvailable => {
            calculateProjectCredits().then(creditsRequired => {
                if (creditsRequired > creditsAvailable) {
                    updates[`/users-current-project/${userId}/status`] = 'insufficient funds';
                } else {
                    updates[`/users-current-project/${userId}/status`] = 'valid';
                }
            })
        })
        return admin.database().ref().update(updates);
    }

    if (snapshot.type == 'preview' && snapshot.status == "validating") {
        updates[`/users-current-project/${userId}/status`] = 'valid';
        return admin.database().ref().update(updates);
    }

});

//Generate Project Files Queue
exports.generateQueue = functions.database.ref('/users-current-project/{userId}').onWrite(event => {
    let userId = event.params.userId;
    const snapshot = event.resource;
    const val = snapshot.val();
    if (val.status == 'valid' && val.type == "preview") {
        let files = admin.database().ref('/users-current-project/{userId}/projectData/files').snapshot().val();
        let updates = [];
        files.forEach((element) => {
            updates[`/users-files-queue/${userId}/files`] = { src: 'fileUrlPreview', clipIdToReplace: '', status: 'pending', projectId: val.projectId };
        });
        return admin.database().ref().update(updates);
    }

    if (val.status == 'valid' && val.type == "preview") {
        let files = admin.database().ref('/users-current-project/{userId}/projectData/files').snapshot().val();
        let updates = [];
        files.forEach((element) => {
            updates[`/users-files-queue/${userId}/files`] = { src: 'fileUrlHighQuality', clipIdToReplace: '', status: 'pending', projectId: val.projectId };
        });
        return admin.database().ref().update(updates);
    }
})


// Run Queue
exports.generateQueue = functions.database.ref('/users-files-queue/{userId}/files/{fileId}').onWrite(event => {
    let userId = event.params.userId;
    let fileId = event.params.fileId;
    const snapshot = event.resource;
    const val = snapshot.val();
    let updates = [];

    ////////////////////////////////////////////////////////////////////////////////
    ///            iterate all records for find if all are downloaded...         ///
    ///////////////////////////////////////////////////////////////////////////////

    // IF //
    //  /users-purchases/{userId}/builds.update()
    if (false) {
        return admin.database().ref(`users-purchases/${userId}/builds`)
            .push({ timestamp: date(), projectId: val.projectId, amount: coins });
    }
    // ELSE //

    ///////////////////////////
    //   get last record...  //
    //////////////////////////

    //check status
    if (val.status == "pending" || val.status == "fail") {
        if (val.clipIdToReplace === null) {
            var options = {
                method: 'POST',
                uri: 'http://api.posttestserver.com/post',
                body: {
                    project: val.projectId,
                    src: val.src
                },
                json: true // Automatically stringifies the body to JSON
            };
        } else {
            var options = {
                method: 'PUT',
                uri: 'http://api.posttestserver.com/post',
                body: {
                    project: val.projectId,
                    clip: val.clipIdToReplace,
                    src: val.src
                },
                json: true // Automatically stringifies the body to JSON
            };
        }


        rp(options)
            .then((parsedBody) => {
                // POST succeeded...
                updates[`/users-files-queue/${userId}/files/${fileId}`] = { status: 'donwloaded' };
                return admin.database().ref().update(updates);

            })
            .catch(function (err) {
                // POST failed...
                updates[`/users-files-queue/${userId}/files/${fileId}`] = { status: 'fail' };
                return admin.database().ref().update(updates);
            });

    }
});