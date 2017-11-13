const functions = require('firebase-functions');
const admin = require('firebase-admin');
let rp = require('request-promise');
const constants = require('../utils/constants');

exports.create = functions.database.ref('/users-current-project/{userId}/clips/{clipId}').onCreate(event => {
    let userId = event.params.userId;
    let clipId = event.params.clipId;

    const snapshot = event.data;
    const clip = snapshot.val();

    const options = constants.BASE_OS_DEV_REQUEST;
    //options.url = `${constants.OPENSHOT_URL}clips/?format=json`;
    options.url = `${constants.OPENSHOT_URL}projects/${clip.projectId}/clips/?format=json`;
    options['formData'] = {
        file: `${constants.OPENSHOT_URL}files/${clip.fileId}/?format=json`,
        project: `${constants.OPENSHOT_URL}projects/${clip.projectId}/?format=json`,
        position: clip.timelinePos || 0,
        start: clip.clipStartAt || 0,
        end: clip.clipEndAt || 10,
        layer: clip.layer || 1,
        json: '{}'
    };

    console.log(options)

    rp.post(options)
        .then((res) => {
            console.log(res.body)
            return admin.database().ref(`/users-current-project/${userId}/clips/${clipId}`).update({ OpenSClipId: res.body.id, status: "created" });
        })
        .catch((err) => {
            console.log(err)
            return err;
        })
});

//PUT[id]
exports.update = functions.database.ref('/users-current-project/{userId}/clips/{clipId}').onUpdate(event => {
    let userId = event.params.userId;
    let clipId = event.params.clipId;

    const snapshot = event.data;
    const clip = snapshot.val();

    const options = constants.BASE_OS_DEV_REQUEST;
    options.url = `${constants.OPENSHOT_URL}projects/${clip.projectId}/clips/${clip.OpenSClipId}?format=json`;
    options['formData'] = {
        file: `${constants.OPENSHOT_URL}files/${clip.fileId}/?format=json`,
        project: `${constants.OPENSHOT_URL}projects/${clip.projectId}/?format=json`,
        position: clip.timelinePos || 0,
        start: clip.clipStartAt || 0,
        end: clip.clipEndAt || 10,
        layer: clip.layer || 1,
        json: '{}'
    };

    console.log(options)

    rp
        .put(options)
        .then((res) => {
            return admin.database().ref(`/users-current-project/${userId}/clips/${clipId}`).update({ status: "created" });
        })
        .catch((err) => {
            return err;
        })
});

//DELETE[id]
exports.delete = functions.database.ref('/users-current-project/{userId}/clips/{clipId}').onDelete(event => {
    let userId = event.params.userId;
    let clipId = event.params.clipId;

    const options = constants.BASE_OS_DEV_REQUEST;
    options.url = `${constants.OPENSHOT_URL}clips/?format=json`;
    options['formData'] = {
        name: userId,
        json: '{}'
    };

    rp
        .post(options)
        .then((res) => {
            return admin.database().ref(`/users-current-project/${userId}`).update({ OpenSId: res.body.id });
        })
        .catch((err) => {
            return err;
        })
});

