const functions = require('firebase-functions');
const admin = require('firebase-admin');


exports.setPlanResetWorker = () => {
  const updates = {};
  updates['/workers/plans/resets'] = false;

  return admin.database()
    .ref()
    .update(updates)
    .catch(err => console.log(err));
};

exports.planResetWorkers = functions.database.ref('/workers/plans/resets').onWrite(event => {
  const currentStatus = event.data.val();
  if (currentStatus) {
    const updates = {};
    updates['/plans/starter'] = {credits: 10, storage: 5, frequency: 'monthly', price: '19.00'};
    updates['/plans/basic'] = {credits: 16, storage: 10 , frequency: 'monthly', price: '29.00'};
    updates['/plans/popular'] = {credits: 40, storage: 20, frequency: 'monthly', price: '59.00' };
    updates['/plans/gold'] = {credits: 80, storage: 40, frequency: 'monthly', price: '119.00'};
    updates['/plans/platinum'] = {credits: 200, storage: 50, frequency: 'monthly', price: '250.00'};

    updates['/plans/starter-year'] = {credits: 10, storage: 5, frequency: 'year', price: '17.10'};
    updates['/plans/basic-year'] = {credits: 16, storage: 10, frequency: 'year', price: '26.10'};
    updates['/plans/popular-year'] = {credits: 40, storage: 20, frequency: 'year', price: '53.10'};
    updates['/plans/gold-year'] = {credits: 80, storage: 40, frequency: 'year', price: '107.10'};
    updates['/plans/platinum-year'] = {credits: 200, storage: 50, frequency: 'year', price: '225.00'};

    return admin.database()
      .ref()
      .update(updates)
      .catch(err => console.log(err));
  }
});
