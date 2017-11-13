// public createClip(clip: OpenShot.Clip) {
//     const headers: Headers = new Headers();
//     // headers.append('Authorization', `Basic ${btoa('demo-cloud:demo-password')}`);
//     const options: RequestOptionsArgs = { headers };
//     const resource = 'clips';
//     const url = `${this.hostname}/${resource}${this.formatJson}`;
//     clip.file = `${this.hostnameProxy}/files/${clip.file}/`;
//     clip.project = `${this.hostnameProxy}/projects/${clip.project}/`;
//     return this.http.post(url, clip, options)
//       .map((res: Response) => console.log(res.json()))
//       .catch((error: any) => Observable.throw(error));
//   }

const functions = require('firebase-functions');
const admin = require('firebase-admin');
let rp = require('request-promise');
const constants = require('../utils/constants');

exports.create = functions.database.ref('/users-current-project/{userId}/clips/{clipId}').onCreate(event => {
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
    .then((res)=>{
        return admin.database().ref(`/users-current-project/${userId}`).update({ OpenSId: res.body.id });
    })
    .catch((err) => {
        return err;
    })
});

//PUT[id]
exports.update = functions.database.ref('/users-current-project/{userId}/clips/{clipId}').onUpdate(event => {
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
    .then((res)=>{
        return admin.database().ref(`/users-current-project/${userId}`).update({ OpenSId: res.body.id });
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
    .then((res)=>{
        return admin.database().ref(`/users-current-project/${userId}`).update({ OpenSId: res.body.id });
    })
    .catch((err) => {
        return err;
    })
});

