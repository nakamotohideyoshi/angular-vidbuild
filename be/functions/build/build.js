const functions = require('firebase-functions');
const admin = require('firebase-admin');
var rp = require('request-promise');
const _ = require('lodash')

getUserCredits = function (userId) {
    return admin.database()
        .ref('/users/' + userId + '/credits')
        .once('value')
        .then(snapshot => snapshot.val())
}

let calculateProjectCredits = new Promise((resolve, reject) => {
    resolve(10);
});

//clearQueue 

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
    const snapshot = event;
    const val = snapshot.val();
    if (val.status == 'valid') {
        let updates = [];
        val.files.forEach((element) => {
            updates[`/users-files-queue/${userId}/files`] = { src: 'fileUrlPreview', clipIdToReplace: '', status: 'pending', type: "new || update", projectId: val.projectId };
        });
        return admin.database().ref().update(updates);
    }
})


// Run Queue
exports.runQueue = functions.database.ref('/users-files-queue/{userId}/files/{fileId}').onWrite(event => {
    let userId = event.params.userId;
    let fileId = event.params.fileId;
    const snapshot = event;
    const val = snapshot.val();
    let updates = [];

    ////////////////////////////////////////////////////////////////////////////////
    ///            iterate all records for find if all are downloaded...         ///
    ///////////////////////////////////////////////////////////////////////////////

    // const purchases = event.data.val();
    // const lastPurchaseKey = _.last(_.keys(purchases));
    // const purchase = _.pick(purchases, [lastPurchaseKey]);

    // IF //
    //  /users-purchases/{userId}/builds.update()
    // if (false) {
    //     return admin.database().ref(`users-purchases/${userId}/builds`)
    //         .push({ timestamp: date(), projectId: val.projectId, amount: credits });
    // }
    // ELSE //

    ///////////////////////////
    //   get last record...  //
    //////////////////////////

    //check status
    if (val.status == "pending" || val.status == "fail") {
        if (val.type === 'new') {
            var options = {
                method: 'POST',
                uri: 'https://dev-api.vidbuild.com/files',
                body: {
                    project: val.projectId,
                    src: val.src
                },
                json: true // Automatically stringifies the body to JSON
            };
        } else {
            var options = {
                method: 'PUT',
                uri: 'https://dev-api.vidbuild.com/files/' + val.videoId,
                body: {
                    project: val.projectId,
                    src: val.src
                },
                json: true // Automatically stringifies the body to JSON
            };
        }


        rp(options)
            .then((parsedBody) => {
                // POST succeeded...
                updates[`/users-files-queue/${userId}/files/${fileId}`] = { status: 'uploaded' };
                return admin.database().ref().update(updates);

            })
            .catch(function (err) {
                // POST failed...
                updates[`/users-files-queue/${userId}/files/${fileId}`] = { status: 'fail' };
                return admin.database().ref().update(updates);
            });
    }
});




// get request project exporting status (projectID)
exports.validateCompleteQueue = functions.database.ref('/users-files-queue/{userId}/files').onUpdate(event => {
    const snapshot = event;
    const files = snapshot.val();
    let allCompleted = true;

    const setExportResolution = (resolution) => {
        return new Promise((resolve, reject) => {
            // call openshot to set resolution
            if (true) {
                resolve("Stuff worked!");
            } else {
                reject(Error("It broke"));
            }
        });
    }

    const callOpenshotExport = (projectId) => {
        return new Promise((resolve, reject) => {
            // call openshot to export
            if (true) {
                resolve("Stuff worked!");
            } else {
                reject(Error("It broke"));
            }
        });
    }

    const validateAllCompleted = ()=>{
        return files.some((file)=>{file.status !== 'uploaded'});
    }

    if (validateAllCompleted()) {
        let project = admin.database().ref(`/users-current-project/${userId}`).snapshot.val();

        if (project.type === "preview") {
            //set resolution 360
            setExportResolution(360).then(() => {
                callOpenshotExport(project.projectId).then((res) => {
                    console.log(res);
                })
            })
        } else {
            //set resolution to project.exportResolution
            setExportResolution(project.exportResolution)
            .then(() => {
                callOpenshotExport(project.projectId).then((res) => {
                    console.log(res);
                })
            })
        }
    }
})

// request -> openshot export () -> if status completed, progress 100% -> output -> url

// result -> fileURL -> lambda(fileURL) -> move to s3 -> result -> s3URL

// users - files - queue / uid / files.empty
// users - current - builds / uid / buildId.delete