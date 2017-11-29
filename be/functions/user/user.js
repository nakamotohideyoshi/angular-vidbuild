const functions = require('firebase-functions');
const admin = require('firebase-admin');
let rp = require('request-promise');
const constants = require('../utils/constants');

exports.createOpenShotProject = functions.database.ref('/users-current-project/{userId}').onCreate(event => {
    let userId = event.params.userId;
    const options = constants.BASE_OS_DEV_REQUEST;
    options.url = `${constants.OPENSHOT_URL}projects/?format=json`;
    options['formData'] = {
      name: userId,
      json: '{}'
    };

    rp
    .post(options)
    .then((res)=>{
        return admin.database().ref(`/users-current-project/${userId}`).update({ OpenSId: res.body.id });
    })
    .catch((err) => {
        return err;
    })
});

exports.createUserEntities = functions.auth.user().onCreate(event => {
    const user = event.data;
    const updates = {};
    updates[`/users-current-project/${user.uid}`] = {
        OpenSId: 0,
        files: [],
        audioClips: [],
        textClips: [],
        videoClips: [],
        voiceClips: [],
        duration: 30,   // secs
        exports: [],
        effects:[],
        type: 'preview',
        created: 0,
        status: 'created',
        width: 640,
        height: 360,
        fps_num: 25,
        fps_den: 1,
        sample_rate: 44100,
        channels: 2,
        channel_layout: 3,
        json: {}
    };

    return admin.database().ref().update(updates);
});
