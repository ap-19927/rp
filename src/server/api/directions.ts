import protectRoutes from "~/server/protectRoutes";

const config = useRuntimeConfig();
const key = config.ghSecretKey;

export default defineEventHandler( async (event) => {
  await protectRoutes(event);

  const x1 = getQuery(event).x1;
  const y1 = getQuery(event).y1;
  const x2 = getQuery(event).x2;
  const y2 = getQuery(event).y2;
  const ghURL = `https://graphhopper.com/api/1/route?point=${x1},${y1}&point=${x2},${y2}&key=${key}`
  let polyline = await $fetch(ghURL);
  return polyline;
});
