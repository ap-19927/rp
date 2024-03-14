import protectRoutes from "~/server/protectRoutes";

const config = useRuntimeConfig();
const key = config.ghSecretKey;
export default defineEventHandler( async (event) => {
  await protectRoutes(event);

  const startLat = getQuery(event).x1;
  const startLong = getQuery(event).y1;
  const driverLat = 41; //request these from available drivers
  const driverLong = -112;
  const ghDriverPassenger = `https://graphhopper.com/api/1/route?point=${startLat},${startLong}&point=${driverLat},${driverLong}&key=${key}`
  const driverPassengerRelation = await $fetch(ghDriverPassenger);
  // get distance from this, return reasonably distanced drivers

  // of those, return drivers willing to make the trip
  const endLat = getQuery(event).x2;
  const endLong = getQuery(event).y2;
  const ghTrip = `https://graphhopper.com/api/1/route?point=${startLat},${startLong}&point=${endLat},${endLong}&key=${key}`
  const trip = await $fetch(ghTrip);

  return [driverPassengerRelation, trip];
});
