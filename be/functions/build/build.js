const functions = require('firebase-functions');
const admin = require('firebase-admin');
const rp = require('request-promise');
const constants = require('../utils/constants');

getUserCredits = function (userId) {
  return admin.database()
    .ref('/users/' + userId + '/credits')
    .once('value')
    .then(snapshot => snapshot.val())
    .catch(error => console.log('getUserCredits error', error));
};

let calculateProjectCredits = new Promise((resolve, reject) => {
  resolve(10);
});

const changeProjectStatus = (status, userId) => {
  return admin
    .database()
    .ref(`/users-current-project/${userId}`)
    .update({ status });
}

const validateProcessType = (userId, project, status) => {

  console.log("validateProcessType", userId, project, status)
  admin.database()
    .ref(`/users-current-project/${userId}`)
    .once('value')
    .then(snapshot => {
      project = snapshot.val();

      if (project && project.exporting && project.type === 'export') {
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
        return changeProjectStatus(result, userId);
      }

      if (project && project.type === 'preview') {
        return changeProjectStatus('valid', userId);
      }

    })
    .catch(error => console.log('error in validateProcessType', error))
}

const generateQueue = (userId, project, status) => {
  console.log("generateQueue", userId, project, status)
  admin.database()
    .ref(`/users-current-project/${userId}`)
    .once('value')
    .then(snapshot => {
      project = snapshot.val();

      //check project files status uploaded

      if (project.resourcesUploaded) {
        return changeProjectStatus('creating ' + project.type, userId);
      } else {

        changeProjectStatus('generating queue', userId);
        const updates = {};
        const projectfiles = project.files;
        const finalFiles = {};

        for (let file in projectfiles) {
          finalFiles[file] = {
            src: projectfiles[file].file.display_sizes[0].uri,
            replaceSrc: '',
            status: 'pending',
            type: "new", //new or update
            projectId: project.OpenSId,
            attempts: 0
          }
          changeProjectStatus('generated queue', userId);
        }

        return admin.database().ref(`/users-files-queue/${userId}`).update(finalFiles);

      }

    })
    .catch(error => console.log('generateQueue error', error))
}

const checkFilesStatus = (files, userId) => {
  for (let file in files) {
    console.log(files[file])
    if (files[file].attempts < 4 && (files[file].status === 'pending' || files[file].status === 'fail')) {
      const options = constants.BASE_AWS_DEV_REQUEST;
      options['method'] = 'POST';
      options.url = `${constants.AWS_URL}files`;
      options['body'] = {
        projectId: files[file].projectId,
        fileUrl: files[file].src
      }

      rp(options)
        .then((parsedBody) => {
          admin.database().ref(`/users-current-project/${userId}/files/${file}`).update({
            status: 'uploaded',
            fileId: parsedBody.body.id
          });
          return admin.database().ref(`/users-files-queue/${userId}/${file}`).update({
            status: 'uploaded',
            fileId: parsedBody.body.id,
            type: 'update'
          });
        })
        .catch(function (error) {
          return admin.database().ref(`/users-files-queue/${userId}/${file}`).update({
            status: 'fail',
            attempts: files[file].attempts + 1
          });
        });
    }
  }
}

const runQueue = (userId, project) => {
  changeProjectStatus('running queue', userId);

  admin.database()
    .ref(`/users-files-queue/${userId}`)
    .once('value')
    .then(snapshot => {
      files = snapshot.val();
      return checkFilesStatus(files, userId);
    });
};

const runExport = (userId, project, type) => {
  const options = constants.BASE_OS_DEV_REQUEST;

  admin.database()
  .ref(`/users-current-project/${userId}`)
  .once('value')
  .then(snapshot => {
    project = snapshot.val();

  options.url = `${constants.OPENSHOT_URL}exports/?format=json`;
  options['formData'] = {
    // "export_type": "video",
    // "video_format": "mp4",
    // "video_codec": "libx264",
    // "video_bitrate": 15000000,
    // "audio_codec": "ac3",
    // "audio_bitrate": 1920000,
    // "start_frame": 1,
    // "end_frame": 112,//from UI
    // "project": `${constants.OPENSHOT_URL}projects/${project.OpenSId}/`,
    // "json": "{}",
    project: `${constants.OPENSHOT_URL}projects/${project.OpenSId}/?format=json`,
    audio_bitrate: 192000,
    audio_codec: "libmp3lame",
    end_frame: 112,
    export_type: "video",
    start_frame: 1,
    video_bitrate: 4000000,
    video_codec: "libx264",
    video_format: "mp4",
    json: "{}"
  };

  return rp
    .post(options)
    .then((res) => {
      console.log(res)
      return changeProjectStatus(`exporting ${project.type}`, userId);
    })
    .catch((err) => {
      console.log(err)
      return err;
    })

  });
};

const runCheckExportStatus = (userId, project, type) => {

  admin.database()
  .ref(`/users-current-project/${userId}`)
  .once('value')
  .then(snapshot => {
    project = snapshot.val();

  const options = constants.BASE_OS_DEV_REQUEST;
  options.url = `${constants.OPENSHOT_URL}projects/${project.OpenSId}/exports?format=json`;
  let interval = setInterval(() => {}, 500);

  rp
    .get(options)
    .then((res) => {
      console.log("then",res.body)
      if (res.body.results[0].status === "completed") {
        return admin
        .database()
        .ref(`/users-current-project/${userId}`)
        .update({ exportStatus: res.body.results[0].progress, status: `exported ${project.type}`, outputUrl: res.body.results[res.body.results.length -1].output })
        .then(()=>{
          clearInterval(interval);
        });
      } else {
        return admin
          .database()
          .ref(`/users-current-project/${userId}`)
          .update({ exportStatus: res.body.results[0].progress });

        interval = setInterval(() => {
          runCheckExportStatus(userId, project, type);
        }, 500)
      }
    })
    .catch((err) => {
      console.log(err)
      return err;
    })

  });
};

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

//Validate Processs
exports.checkStatus = functions.database.ref('/users-current-project/{userId}/status')
  .onWrite(event => {
    let userId = event.params.userId;
    const snapshot = event.data;
    const eventValue = snapshot.val();
    let project = {};

    switch (eventValue) {
      case "validating":
        return validateProcessType(userId, project, eventValue);
        break;

      case "valid":
        return generateQueue(userId, project, eventValue);
        break;

      case "generated queue":
        return runQueue(userId, project);
        break;

      case "creating preview":
        return runExport(userId, project, "preview")
        break;

      case "creating export":
        return runExport(userId, project, "export")
        break;

      case "exporting preview":
        return runCheckExportStatus(userId, project, "preview")
        break;

      case "exporting export":
        return runCheckExportStatus(userId, project, "export")
        break;

      default:
        break;
    }
  });

exports.validateCompleteQueue = functions.database.ref('/users-files-queue/{userId}').onUpdate(event => {
  let userId = event.params.userId;
  const snapshot = event.data;
  const files = snapshot.val();
  let allCompleted = true;
  console.log(files);

  for (let file in files) {
    console.log(files[file])
    if (files[file].status !== 'uploaded') {
      allCompleted = false;
    }
  }

  if (allCompleted) {
    return admin
      .database()
      .ref(`/users-current-project/${userId}`)
      .update({ status: 'upload finished', resourcesUploaded: true });
  }
});

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


// get request project exporting status (projectID)


// let project = admin.database().ref(`/users-current-project/${userId}`).snapshot.val();

//     if (project.type === "preview") {
//       //set resolution 360
//       setExportResolution(360).then(() => {
//         callOpenshotExport(project.projectId).then((res) => {
//           console.log(res);
//         })
//       })
//     } else {
//       //set resolution to project.exportResolution
//       setExportResolution(project.exportResolution)
//         .then(() => {
//           callOpenshotExport(project.projectId).then((res) => {
//             console.log(res);
//           })
//         })
//     }

// request -> openshot export () -> if status completed, progress 100% -> output -> url

// result -> fileURL -> lambda(fileURL) -> move to s3 -> result -> s3URL

// users - files - queue / uid / files.empty
// users - current - builds / uid / buildId.delete
