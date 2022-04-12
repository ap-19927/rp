require('dotenv').config();
const axios = require('axios').default;

module.exports = gH = (data) => {
  const key = process.env.GH_KEY;
  const points = JSON.parse(data)
  console.log(points)
  const url = `https://graphhopper.com/api/1/route?point=${points.y1},${points.x1}&point=${points.y2},${points.x2}&profile=${points.profile}&key=${key}`
  return axios.get(url).then(res => {return res;}).catch(e => {console.log(e.message);});
}
