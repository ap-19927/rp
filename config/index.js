const router = require('express').Router();
const path = require('path');
const gh = require('../lib/graphHopper')

router.get('/', (req, res) => {
  res.sendFile('/index.html',{ root: './dist' })
});

//https://stackoverflow.com/questions/23784614/node-js-ajax-sending-and-receiving-json
router.post('/api', (req, res) => {
  let store = '';
  req.on('data', (data) => { store += data; });
  req.on('end', async () =>  {
      const path = await gh(store);
      if(path) res.send(path.data);
  });
});

module.exports = router;
