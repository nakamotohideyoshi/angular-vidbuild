const functions = require('firebase-functions');
const admin = require('firebase-admin');

const auth = require('./auth/auth')
const stripe = require('./payments/stripe');
const credits = require('./payments/credits');
const plans = require('./seeds/plans');
const build = require('./build/build');
const wrapper = require('./openshot/wrapper');
const user = require('./user/user');

admin.initializeApp(functions.config().firebase);
plans.setPlanResetWorker();

//auth
exports.validateUserToken = auth.validateUserToken;

//user
exports.createUserEntities = user.createUserEntities;
exports.createOpenShotProject = user.createOpenShotProject;

//stripe
exports.createStripeCustomer = stripe.createStripeCustomer;
exports.createSubscription = stripe.createSubscription;
exports.recurringPayment = stripe.recurringPayment;
exports.updateSubscription = stripe.updateSubscription;

//credits
exports.addCreditsForSubscription = credits.addCreditsForSubscription;
exports.addCreditsOnDemand = credits.addCreditsOnDemand;

//workers
exports.planResetWorkers = plans.planResetWorkers;

//build
exports.validateProcessType = build.validateProcessType;
exports.generateQueue = build.generateQueue;
exports.runQueue = build.runQueue;
exports.validateProcessType = build.validateProcessType;

//wrapper
exports.project = wrapper.project;