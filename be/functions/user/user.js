const functions = require('firebase-functions');
const admin = require('firebase-admin');
let rp = require('request-promise');

const openshotUrl = 'http://34.248.157.129/';

exports.createOpenShotProject = functions.database.ref('/users-current-project/{userId}').onCreate(event => {
    let userId = event.params.userId;
    let updates = [];
    let options = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic a29sZXNrZXI6a29sZXNrZXIxMjM="
        },
        json: true,
        resolveWithFullResponse: true,
        url: openshotUrl + 'projects/?format=json',
        formData: {
            name: userId,
            json: '{}'
        }
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
        projectData: {},
        type: '',
        created: 0,
        status: '',
        exportResolution: 360
    };

    return admin.database().ref().update(updates);
});
