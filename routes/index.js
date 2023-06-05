var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/answer_url_project', (req, res) => {
  const from = req.query.from || '';
  const to = req.query.to || '';
  const appToPhone = req.query.appToPhone || '';
  const userId = req.query.userId || '';

  const decodeFrom = decodeURIComponent(from);
  const decodeTo = decodeURIComponent(to);

  let location = '';
  let typeForm = '';
  let typeTo = '';

  if(appToPhone == 'true'){
    location = 'external';
    typeForm = decodeFrom;
    typeTo = decodeTo;
  }
  else {
    location = 'internal';
    typeForm = userId;
    typeTo = decodeTo;
  }

  const connectAction = {
    action: 'connect',
    from: {
      type: 'internal',
      number: typeForm,
      alias: typeForm
    },
    to: {
      type: location,
      number: typeTo,
      alias: typeTo
    },
    customData: '',
    timeout: 60,
    maxConnectTime: 0,
    peerToPeerCall: false
  };

  const sccos = [connectAction];
  res.json(sccos);
});

router.get('/answer_url_number', (req, res) => {
  const from = req.query.from || '';
  const to = req.query.to || '';
  const to_number = req.query.to_number || '';
  const stringeeNumber = req.query.stringeeNumber || '';
  const phoneToPhone = req.query.phoneToPhone || '';

  let location = '';
  let numberFrom = '';
  let aliasFrom = '';
  let numberTo = '';
  let aliasTo = '';

  if(phoneToPhone == 'true'){
    location = 'external';
    numberFrom = from;
    aliasFrom = stringeeNumber;
    numberTo = to_number;
    aliasTo = 'Call_to_' + to;
  } else {
    location = 'internal'
    numberFrom = from;
    aliasFrom = from;
    numberTo = to_number;
    aliasTo = 'Call_to_' + to
  }
  
  const scco = [{
    "action": "connect",
    "from": {
        "type": "external",
        "number": numberFrom,
        "alias": aliasFrom
    },
    "to": {
        "type": location,
        "number": numberTo,
        "alias": aliasTo
    },
    "continueOnFail": false,
    "onFailEventUrl": "",
    "customData": null
  }];

  res.json(scco);
})

router.get('/generate_access_token', (req, res) => {
  const apiKeySid = 'SK.0.IRN4bChwmGm9nLDIaq5lgMxucffqRkm';
  const apiKeySecret = 'Qk14MHBmZE5jdEhNQnhMcDBEenFKbzh4bXNLV2VpSDg=';
  const header = { cty: 'stringee-api;v=1' };

  const userId = req.query.userId;
  const now = Date.now();
  const exp = now + 100000000;

  let payload = {};
  if (userId) {
    const jti = apiKeySid + '-' + now;
    const iss = apiKeySid;
    payload = { jti, iss, exp, userId };
  }
  const clientAccessToken = jwt.sign(payload, apiKeySecret, {
    algorithm: 'HS256',
    header,
  });

  res.json(clientAccessToken);
})

router.get('/generate_access_token_pcc', (req, res) => {
  const apiKeySid = 'SK.0.IRN4bChwmGm9nLDIaq5lgMxucffqRkm';
  const apiKeySecret = 'Qk14MHBmZE5jdEhNQnhMcDBEenFKbzh4bXNLV2VpSDg=';
  const header = { cty: 'stringee-api;v=1' };

  const userId = req.query.userId;
  const now = Date.now();
  const exp = now + 100000000;

  let payload = {};
  if (userId) {
    const jti = apiKeySid + '-' + now;
    icc_api = true;
    const iss = apiKeySid;
    payload = { jti, iss, exp, icc_api, userId };
  }
  const clientAccessToken = jwt.sign(payload, apiKeySecret, {
    algorithm: 'HS256',
    header,
  });

  res.json(clientAccessToken);
})
module.exports = router;
