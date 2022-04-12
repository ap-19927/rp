const router = require('express').Router();
const api_post = require('../server/api');

router.get('/', (req, res) => {
  res.sendFile('/index.html',{ root: './dist' })
});

router.post('/api', api_post);

module.exports = router;
