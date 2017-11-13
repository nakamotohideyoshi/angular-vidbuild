exports.OPENSHOT_URL = "http://lb-openshot-rds-efs-ireland-2071558844.eu-west-1.elb.amazonaws.com/";
exports.AWS_URL = 'https://dev-api.vidbuild.com/';

exports.BASE_OS_DEV_REQUEST = {
  'url': 'http://lb-openshot-rds-efs-ireland-2071558844.eu-west-1.elb.amazonaws.com/',
  'headers': {
    'Content-Type': 'application/json',
    'Authorization': 'Basic a29sZXNrZXI6a29sZXNrZXIxMjM='
  },
  'json': true,
  'resolveWithFullResponse': true
};

exports.BASE_AWS_DEV_REQUEST = {
  'url': 'https://dev-api.vidbuild.com/',
  'headers':{
    'Content-Type': 'application/json',
  },
  'json': true,
  'resolveWithFullResponse': true
};
