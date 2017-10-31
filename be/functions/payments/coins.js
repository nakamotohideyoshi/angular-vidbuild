const functions = require('firebase-functions');
const admin = require('firebase-admin');
const _ = require('lodash')

exports.addCoinsForSubscription = functions.database.ref('/users/{userId}/membership/timestamp').onWrite(event => {
    let userId = event.params.userId;
    let userPlan = '';
    let newCoins = 0;
    return admin.database()
        .ref('/users/' + userId)
        .once('value')
        .then(snapshot => snapshot.val())
        .then(user => {
            let updates = {};
            let currentCoins = user.coins || 0;
            userPlan = user.membership.plan;
            let userPlanStatus = user.membership.status;
            if (userPlanStatus) {
                switch (userPlan) {
                    case 'starter':
                        newCoins = 10;
                        break;
                    case 'basic':
                        newCoins = 16;
                        break;
                    case 'popular':
                        newCoins = 40;
                        break;
                    case 'gold':
                        newCoins = 80;
                        break;
                    case 'platinum':
                        newCoins = 200;
                        break;
                }
            }
            updates['/users/' + userId + '/coins'] = currentCoins + newCoins;
            return admin.database().ref().update(updates);
        })
        .catch(err => console.log(err));
});

exports.addCoinsOnDemand = functions.database.ref('/users-purchases/{userId}/coins').onWrite(event => {
    const purchases = event.data.val();
    const lastPurchaseKey = _.last(_.keys(purchases));
    const purchase = _.pick(purchases, [lastPurchaseKey]);

    let userId = event.params.userId;
    let newCoins = 0;
    return admin.database()
        .ref('/users/' + userId)
        .once('value')
        .then(snapshot => snapshot.val())
        .then(user => {
            let updates = {};
            let currentCoins = user.coins;
            purchaseAmount = purchase[lastPurchaseKey].amount;
            let userPlanStatus = user.membership.status;
            if (userPlanStatus == 'active') {
                switch (purchaseAmount) {
                    case '1coin':
                        newCoins = 1;
                        break;
                    case '5coins':
                        newCoins = 5;
                        break;
                    case '10coins':
                        newCoins = 10;
                        break;
                    case '20coins':
                        newCoins = 20;
                        break;
                    case '50coins':
                        newCoins = 50;
                        break;
                    case '100coins':
                        newCoins = 100;
                        break;
                }
            }
            updates['/users/' + userId + '/coins'] = currentCoins + newCoins;
            return admin.database().ref().update(updates);
        })
        .catch(err => console.log(err));
});


exports.removeCoinsOnDemand = functions.database.ref('/users-purchases/{userId}/builds').onWrite(event => {
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
            let currentCoins = user.coins;
            purchaseAmount = purchase[lastPurchaseKey].amount;
            if (currentCoins - purchaseAmount < 0) {
                throw Error('Insuficient Coins');
            } else {
                updates['/users/' + userId + '/coins'] = currentCoins - purchaseAmount;
                return admin.database().ref().update(updates);
            }
        })
        .catch(err => console.log(err));
});