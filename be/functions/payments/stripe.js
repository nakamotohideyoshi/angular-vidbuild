const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')('sk_test_dktidDoEiKIl0rRRibYLbI5N'); //functions.config().stripe.testkey

 exports.createStripeCustomer = functions.auth.user().onCreate(event => {
    // user auth data
    const user = event.data;
    // register Stripe user
    return stripe.customers.create({
        email: user.email
    })
        .then(customer => {
            /// update database with stripe customer id
            const data = { customerId: customer.id };
            const updates = {};
            updates["/customers/" + customer.id] = user.uid;
            updates["/users/" + user.uid + "/customerId"] = customer.id;
            updates["/users/" + user.uid + "/credits"] = 0;
            updates["/users-purchases/" + user.uid + "/credits"] = [];
            updates["/users-purchases/" + user.uid + "/builds"] = [];
            return admin.database().ref().update(updates);
        });
});


exports.createSubscription = functions.database.ref('/users/{userId}/membership/token').onWrite(event => {
    const tokenId = event.data.val();
    const userId = event.params.userId;
    if (!tokenId)
        throw new Error('token missing');
    return admin.database()
        .ref('/users/' + userId)
        .once('value')
        .then(snapshot => snapshot.val())
        .then((user) => {
            admin.database()
                .ref('/users/' + userId + '/membership')
                .update({
                    status: 'processing'
                });
            return user;
        })
        .then(user => {
            return stripe.subscriptions.create({
                customer: user.customerId,
                source: tokenId,
                items: [
                    {
                        plan: user.membership.plan,
                    },
                ],
            });
        })
        .then((sub) => {
            return admin.database()
                .ref('/users/' + userId + '/membership')
                .update({
                    subId: sub.id,
                    status: 'active',
                    timestamp: Date.now(),
                    current_period_end: sub.current_period_end,
                    current_period_start: sub.current_period_start
                });
        })
        .catch(err => console.log(err));
});

exports.updateSubscription = functions.database.ref('/users/{userId}/membership/plan').onWrite(event => {
    const plan = event.data.val();
    const userId = event.params.userId;
    if (!plan)
        throw new Error('plan missing');
    else if (plan === "canceled") {
        return admin.database()
            .ref('/users/' + userId)
            .once('value')
            .then(snapshot => snapshot.val())
            .then(user => {
                return stripe.subscriptions.del(user.membership.subId,
                    //{ at_period_end: true },
                    (err, confirmation) => {
                        // asynchronously called
                    }
                );
                //return stripe.subscriptions.del(user.membership.tokenId);
            })
            .then((sub) => {
                const updates = {};
                updates["/users/" + user.uid + "/membership"] = { status: 'inactive', timestamp: Date.now() };
                updates["/users/" + user.uid + "/credits"] = 0;
                return admin.database().ref().update(updates);
            })
            .catch(err => console.log(err));
    } else {
        return admin.database()
            .ref('/users/' + userId)
            .once('value')
            .then(snapshot => snapshot.val())
            .then(user => {
                if (!user.membership.subId) {
                    return false;
                }
                var subscription = stripe.subscriptions.retrieve(user.membership.subId,
                    (err, subscription) => {
                        // asynchronously called
                        var item_id = subscription.items.data[0].id;
                        return stripe.subscriptions.update(user.membership.subId, {
                            items: [{
                                id: item_id,
                                plan: user.membership.plan,
                            }],
                        }, (err, subscription) => {
                            // asynchronously called
                            console.log(err);
                        });
                    });
            })
            .catch(err => console.log(err));
    }
});

exports.recurringPayment = functions.https.onRequest((req, res) => {
    const hook = req.body.type;
    const data = req.body.data.object;
    if (!data)
        throw new Error('missing data');
    return admin.database()
        .ref('/customers/' + data.customer)
        .once('value')
        .then(snapshot => snapshot.val())
        .then(userId => {
            const ref = admin.database().ref('/users/' + userId + '/membership');
            // Handle successful payment webhook
            if (hook === 'invoice.payment_succeeded') {
                return ref.update({ status: 'active', timestamp: Date.now() });
            }
            // Handle failed payment webhook
            if (hook === 'invoice.payment_failed') {
                return ref.update({ status: 'pastDue', timestamp: Date.now() });
            }
        })
        .then(() => res.status(200).send('successfully handled ' + hook))
        .catch(err => res.status(400).send('error handling ' + hook));
});
