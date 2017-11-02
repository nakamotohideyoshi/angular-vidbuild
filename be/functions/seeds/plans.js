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
    updates['/plans/starter'] = { plan: "starter", name: "Starter", description: "Starter Plan", stripePrice: 1900, credits: 10, storage: 5, frequency: 'month', price: '19' };
    updates['/plans/basic'] = { plan: "basic", name: "Basic", description: "Basic Plan", stripePrice: 2900, credits: 16, storage: 10, frequency: 'month', price: '29' };
    updates['/plans/popular'] = { plan: "popular", name: "Popular", description: "Popular Plan", stripePrice: 5900, credits: 40, storage: 20, frequency: 'month', price: '59' };
    updates['/plans/gold'] = { plan: "gold", name: "Gold", description: "Gold Plan", stripePrice: 11900, credits: 80, storage: 40, frequency: 'month', price: '119' };
    updates['/plans/platinum'] = { plan: "platinum", name: "Platinum", description: "Platinum Plan", stripePrice: 25000, credits: 200, storage: 50, frequency: 'month', price: '250' };

    updates['/plans/starter-year'] = { plan: "starter-year", name: "Starter", description: "Starter Plan per Year", stripePrice: 20520, credits: 10, storage: 5, frequency: 'year', price: '17.10' };
    updates['/plans/basic-year'] = { plan: "basic-year", name: "Basic", description: "Basic Plan per Year", stripePrice: 31320, credits: 16, storage: 10, frequency: 'year', price: '26.10' };
    updates['/plans/popular-year'] = { plan: "popular-year", name: "Popular", description: "Popular Plan  per Year", stripePrice: 63720, credits: 40, storage: 20, frequency: 'year', price: '53.10' };
    updates['/plans/gold-year'] = { plan: "gold-year", name: "Gold", description: "Gold Plan  per Year", stripePrice: 1282520, credits: 80, storage: 40, frequency: 'year', price: '107.10' };
    updates['/plans/platinum-year'] = { plan: "platinum-year", name: "Platinum", description: "Platinum Plan  per Year", stripePrice: 270000, credits: 200, storage: 50, frequency: 'year', price: '225' };

    return admin.database()
      .ref()
      .update(updates)
      .catch(err => console.log(err));
  }
});
