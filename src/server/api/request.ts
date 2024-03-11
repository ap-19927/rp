const config = useRuntimeConfig();
const key = config.ghSecretKey;
export default defineEventHandler( async (event) => {
  const x1 = getQuery(event).x1;
  const y1 = getQuery(event).y1;
  const x2 = 41; //request these from available drivers
  const y2 = -112;
  const ghURL = `https://graphhopper.com/api/1/route?point=${x1},${y1}&point=${x2},${y2}&key=${key}`
  let polyline = await $fetch(ghURL);
  // get distance from this, return reasonably distanced drivers
  return polyline;
});
