const functions = require('firebase-functions');
const admin = require('firebase-admin');
const _ = require('lodash');

exports.addCreditsForSubscription = functions.database.ref('/users/{userId}/membership/timestamp').onWrite(event => {
    let userId = event.params.userId;
    let userPlan = '';
    let newCredits = 0;
    return admin.database()
        .ref('/users/' + userId)
        .once('value')
        .then(snapshot => snapshot.val())
        .then(user => {
            let updates = {};
            let currentCredits = user.credits || 0;
            userPlan = user.membership.plan;
            let userPlanStatus = user.membership.status;
            if (userPlanStatus) {
                switch (userPlan) {
                    case 'starter':
                        newCredits = 10;
                        break;
                    case 'basic':
                        newCredits = 16;
                        break;
                    case 'popular':
                        newCredits = 40;
                        break;
                    case 'gold':
                        newCredits = 80;
                        break;
                    case 'platinum':
                        newCredits = 200;
                        break;
                }
            }
            updates['/users/' + userId + '/credits'] = currentCredits + newCredits;
            return admin.database().ref().update(updates);
        })
        .catch(err => console.log(err));
});

exports.addCreditsOnDemand = functions.database.ref('/users-purchases/{userId}/credits').onWrite(event => {
    const purchases = event.data.val();
    const lastPurchaseKey = _.last(_.keys(purchases));
    const purchase = _.pick(purchases, [lastPurchaseKey]);

    let userId = event.params.userId;
    let newCredits = 0;
    return admin.database()
        .ref('/users/' + userId)
        .once('value')
        .then(snapshot => snapshot.val())
        .then(user => {
            let updates = {};
            let currentCredits = user.credits;
            purchaseAmount = purchase[lastPurchaseKey].amount;
            let userPlanStatus = user.membership.status;
            if (userPlanStatus === 'active') {
                switch (purchaseAmount) {
                    case '1coin':
                        newCredits = 1;
                        break;
                    case '5credits':
                        newCredits = 5;
                        break;
                    case '10credits':
                        newCredits = 10;
                        break;
                    case '20credits':
                        newCredits = 20;
                        break;
                    case '50credits':
                        newCredits = 50;
                        break;
                    case '100credits':
                        newCredits = 100;
                        break;
                }
            }
            updates['/users/' + userId + '/credits'] = currentCredits + newCredits;
            return admin.database().ref().update(updates);
        })
        .catch(err => console.log(err));
});


exports.removeCreditsOnDemand = functions.database.ref('/users-purchases/{userId}/builds').onWrite(event => {
    const purchases = event.data.val();
    const lastPurchaseKey = _.last(_.keys(purchases));
    const purchase = _.pick(purchases, [lastPurchaseKey]);
    const userId = event.params.userId;

    return admin.database()
        .ref('/users/' + userId)
        .once('value')
        .then(snapshot => snapshot.val())
        .then(user => {
            let updates = {};
            let currentCredits = user.credits;
            const purchaseAmount = purchase[lastPurchaseKey].amount;
            if (currentCredits - purchaseAmount < 0) {
                throw Error('Insuficient Credits');
            } else {
                updates['/users/' + userId + '/credits'] = currentCredits - purchaseAmount;
                return admin.database().ref().update(updates);
            }
        })
        .catch(err => console.log(err));
});
