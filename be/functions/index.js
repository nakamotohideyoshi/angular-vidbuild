const functions = require('firebase-functions');
const admin = require('firebase-admin');

const auth = require('./auth/auth');
const stripe = require('./payments/stripe');
const credits = require('./payments/credits');
const plans = require('./seeds/plans');
const build = require('./build/build');
const wrapper = require('./openshot/wrapper');
const user = require('./user/user');
const clips = require('./openshot/clips');

const audios = require('./storyblocks/audios');
const cors = require('cors')({origin: true});

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
exports.checkStatus = build.checkStatus;
exports.validateCompleteQueue = build.validateCompleteQueue;
exports.createClip = clips.create;
exports.updateClip = clips.update;

//wrapper
exports.project = wrapper.project;

//audioblocks
exports.getAudioFromStoryBlocks = audios.getAudioFromStoryBlocks;
