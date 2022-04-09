const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  //res.sendFile('/map/index.html', { root: '.' });
  render('index')
})

module.exports = router
