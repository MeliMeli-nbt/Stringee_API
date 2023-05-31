var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
router.post('/generate_answer_url_project', (req, res) => {
  const from = req.body.from;
  const to = req.body.to || '';
  const fromInternal = req.body.fromInternal || '';
  const userId = req.body.userId || '';
  const projectId = req.body.projectId || '';
  const custom = req.body.custom || '';

  const answerUrl = 'answer_url_project?from=' + from + '&to=' + to + '&fromInternal=' + fromInternal + '&userId=' + userId + '&projectId=' + projectId + '&custom=' + custom;

  res.json(answerUrl);
})

router.post('/generate_answer_url_number', (req, res) => {
  const from = req.body.from || '';
  const to = req.body.to || '';
  const record = req.body.record || '';
  const appToPhone = req.body.appToPhone || '';

  const answerUrl = 'answer_url_number?from=' + from + '&to=' + to  + '&record=' + record + '&appToPhone=' + appToPhone;

  res.json(answerUrl);
})

router.get('/answer_url_project', (req, res) => {
  const from = req.query.from || '';
  const to = req.query.to || '';
  const fromInternal = req.query.fromInternal || '';
  const userId = req.query.userId || '';
  const projectId = req.query.projectId || '';
  const custom = req.query.custom || '';

  const decodeFrom = decodeURIComponent(from);
  const decodeTo = decodeURIComponent(to);
  const decodeCustom = decodeURIComponent(custom);

  const toInt = parseInt(to);

  let toType = '';
  if (toInt < 60000) {
    toType = 'internal';
  } else {
    toType = 'external';
  }

  const connectAction = {
    action: 'connect',
    from: {
      type: 'internal',
      number: decodeFrom,
      alias: ''
    },
    to: {
      type: toType,
      number: decodeTo,
      alias: ''
    },
    customData: `custom-data-from-server-${decodeCustom}`,
    timeout: 45,
    maxConnectTime: 0,
    peerToPeerCall: false
  };

  const recordAction = {
    action: 'record',
    eventUrl: '',
    format: 'mp3'
  };

  const sccos = [connectAction];
  res.json(sccos);
});

router.get('/answer_url_number', (req, res) => {
  const from = req.query.from || '';
  const to = req.query.to || '';

  const decodeFrom = decodeURIComponent(from);
  const decodeTo = decodeURIComponent(to);

  const scco = [{
    "action": "connect",
    
    "from": {
      "type": "internal",
      "number": decodeFrom,
      "alias": ''
    },
    
    "to": {
      "type": "external",
      "number": decodeTo,
      "alias": ''
    },
    "customData": "",
    "timeout": 60,
    "maxConnectTime": 0,
    "peerToPeerCall": false
  }];

  res.json(scco);
})

router.get('/generate_access_token', (req, res) => {
  const apiKeySid = 'SK.0.GGW3Gi4XrOUQp3N78gBdCVpyFbb7FyH2';
  const apiKeySecret = 'TnVGTG1vYWU3bjlKWnpMR0trbXg1T1g4clc0UkxvOWY=';
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

module.exports = router;
