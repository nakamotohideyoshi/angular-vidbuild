const functions = require('firebase-functions');
const admin = require('firebase-admin');

const auth = require('./auth/auth')
const stripe = require('./payments/stripe');
const coins = require('./payments/coins');
const plans = require('./seeds/plans');
const build = require('./build/build');
admin.initializeApp(functions.config().firebase);
plans.setPlanResetWorker();

//exports.loginIntoAws = functions.auth.user();
//exports.createUserVideosCollection = auth.createUserVideosCollection;

exports.validateUserToken = auth.validateUserToken;
exports.createUserEntities = auth.createUserEntities;

//stripe
exports.createStripeCustomer = stripe.createStripeCustomer;
exports.createSubscription = stripe.createSubscription;
exports.recurringPayment = stripe.recurringPayment;
exports.updateSubscription = stripe.updateSubscription;

//coins
exports.addCoinsForSubscription = coins.addCoinsForSubscription;
exports.addCoinsOnDemand = coins.addCoinsOnDemand;
exports.removeCoinsOnDemand = coins.removeCoinsOnDemand;
exports.planResetWorkers = plans.planResetWorkers;

//build
exports.validateProcessType = build.validateProcessType;