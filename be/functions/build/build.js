const functions = require('firebase-functions');
const admin = require('firebase-admin');
const rp = require('request-promise');
const _ = require('lodash');

getUserCredits = function (userId) {
  return admin.database()
    .ref('/users/' + userId + '/credits')
    .once('value')
    .then(snapshot => snapshot.val())
};

let calculateProjectCredits = new Promise((resolve, reject) => {
  resolve(10);
});

//clearQueue

//Validate Processs
exports.validateProcessType = functions.database.ref('/users-current-project/{userId}').onWrite(event => {
  let userId = event.params.userId;
  let project = {};
  admin.database()
    .ref(`/users-current-project/${userId}`)
    .once('value')
    .then(snapshot => {
      project = snapshot.val();

      if (project && project.type === 'export' && project.status === "validating") {

        //check credits
        let result = '';
        getUserCredits(userId).then(creditsAvailable => {
          calculateProjectCredits().then(creditsRequired => {
            if (creditsRequired > creditsAvailable) {
              result = 'insufficient funds';
            } else {
              result = 'valid';
            }
          })
        });
        return admin.database().ref(`/users-current-project/${userId}`).update({status: result});
      }

      if (project && project.type === 'preview' && project.status === "validating") {
        return admin.database().ref(`/users-current-project/${userId}`).update({status: 'valid'});
      }

    })
    .catch(error => console.log('error in validateProcessType', error))
});

//Generate Project Files Queue
exports.generateQueue = functions.database.ref('/users-current-project/{userId}').onWrite(event => {
  let userId = event.params.userId;
  let project = {};
  admin.database()
    .ref(`/users-current-project/${userId}`)
    .once('value')
    .then(snapshot => {
      project = snapshot.val();
      if (project.status === 'valid') {
        const updates = {};
        const projectfiles = project.projectData.files;
        const finalFiles = {};

        for (let file in projectfiles) {
          finalFiles[file] = {
            src: projectfiles[file].file.display_sizes[0].uri,
            clipIdToReplace: '',
            status: 'pending',
            type: "new", //new or update
            projectId: project.OpenSId
          }
        }
        updates[`/users-files-queue/${userId}`] = finalFiles;

        return admin.database().ref().update(updates);
      }
    })
    .catch(error => console.log('generateQueue error', error))
});


// Run Queue
exports.runQueue = functions.database.ref('/users-files-queue/{userId}').onWrite(event => {
  let userId = event.params.userId;
  const files = event.data.val();

  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    resolveWithFullResponse: true,
    json: true
  };

  for(let file in files){
    if (files[file].status === 'pending' || files[file].status === 'fail') {
      if (files[file].type === 'new') {
        options['method'] = 'POST';
        options['uri'] = 'https://dev-api.vidbuild.com/files';
        options['body'] = {
          project: files[file].projectId,
          src: files[file].src
        }
      } else {
        options['method'] = 'PUT';
        options['uri'] = 'https://dev-api.vidbuild.com/files/' + files[file].fileId;
        options['body'] = {
          project: files[file].projectId,
          src: files[file].src
        }
      }
      const updates = {};
      const updateKey = `/users-files-queue/${userId}/${file}`;
      rp(options)
        .then((parsedBody) => {
          //updates[`/users-files-queue/${userId}/files/${fileId}`] = {status: 'uploaded', fileId: parsedBody.id, type: 'nonew'};
          updates[updateKey] = {status: 'uploaded', fileId: parsedBody.id, type: 'nonew'};
          return admin.database().ref().update(updates);
        })
        .catch(function (err) {
          updates[updateKey] = {status: 'fail'};
          //updates[`/users-files-queue/${userId}/files/${fileId}`] = {status: 'fail'};
          return admin.database().ref().update(updates);
        });
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ///                              The magic begin be here                     ///
  ///////////////////////////////////////////////////////////////////////////////

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
  };

  const callOpenshotExport = (projectId) => {
    return new Promise((resolve, reject) => {
      // call openshot to export
      if (true) {
        resolve("Stuff worked!");
      } else {
        reject(Error("It broke"));
      }
    });
  };

  const validateAllCompleted = () => {
    return files.some((file) => file.status !== 'uploaded');
  };

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
});

// request -> openshot export () -> if status completed, progress 100% -> output -> url

// result -> fileURL -> lambda(fileURL) -> move to s3 -> result -> s3URL

// users - files - queue / uid / files.empty
// users - current - builds / uid / buildId.delete
