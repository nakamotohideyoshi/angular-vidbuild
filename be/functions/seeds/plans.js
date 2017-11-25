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
    updates['/plans/starter'] = { 
      plan: "starter", 
      name: "Starter", 
      description: "Starter Plan", 
      stripePrice: 1500, 
      priceWithVat: 1800, 
      credits: 5, 
      storage: 5, 
      frequency: 'month', 
    };

    updates['/plans/basic'] = {
      plan: "basic",
      name: "Basic",
      description:"Basic Plan",
      stripePrice: 3000,
      priceWithVat: 3600,
      credits: 12,
      storage: 10,
      frequency: 'month',
    };

    updates['/plans/popular'] = { 
      plan: "popular",
      name: "Popular",
      description: "Popular Plan",
      stripePrice: 4000,
      priceWithVat: 4800,
      credits: 20,
      storage: 20,
      frequency: 'month',
    };

    updates['/plans/gold'] = {
      plan: "gold",
      name: "Gold",
      description: "Gold Plan",
      stripePrice: 6000,
      priceWithVat: 7200,
      credits: 35,
      storage: 40,
      frequency: 'month',
    };

    updates['/plans/platinum'] = { 
      plan: "platinum", 
      name: "Platinum", 
      description: "Platinum Plan", 
      stripePrice: 15000, 
      priceWithVat: 18000, 
      credits: 100, 
      storage: 50, 
      frequency: 'month',
    };

    // updates['/plans/starter-year'] = { plan: "starter-year", name: "Starter", description: "Starter Plan per Year", stripePrice: 20520, priceWithVat: 1800, credits: 10, storage: 5, frequency: 'year', price: '17.10' };
    // updates['/plans/basic-year'] = { plan: "basic-year", name: "Basic", description: "Basic Plan per Year", stripePrice: 31320, priceWithVat: 1800, credits: 16, storage: 10, frequency: 'year', price: '26.10' };
    // updates['/plans/popular-year'] = { plan: "popular-year", name: "Popular", description: "Popular Plan  per Year", stripePrice: 63720, priceWithVat: 1800, credits: 40, storage: 20, frequency: 'year', price: '53.10' };
    // updates['/plans/gold-year'] = { plan: "gold-year", name: "Gold", description: "Gold Plan  per Year", stripePrice: 1282520, priceWithVat: 1800, credits: 80, storage: 40, frequency: 'year', price: '107.10' };
    // updates['/plans/platinum-year'] = { plan: "platinum-year", name: "Platinum", description: "Platinum Plan  per Year", stripePrice: 270000, priceWithVat: 1800, credits: 200, storage: 50, frequency: 'year', price: '225' };

    return admin.database()
      .ref()
      .update(updates)
      .catch(err => console.log(err));
  }
});
