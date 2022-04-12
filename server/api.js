const gh = require('./lib/graphHopper');


//https://stackoverflow.com/questions/23784614/node-js-ajax-sending-and-receiving-json
module.exports = api_post = (req, res) => {
  let store = '';
  req.on('data', (data) => { store += data; });
  req.on('end', async () =>  {
      const path = await gh(store);
      if(path) res.send(path.data);
  });
}
