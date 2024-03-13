const config = useRuntimeConfig();
const key = config.geoapifyKey;

export default defineEventHandler( async (event) => {
  const text = getQuery(event).text;
  const geocodeURL = `https://api.geoapify.com/v1/geocode/search?text=${text}&apiKey=${key}`
  let data = await $fetch(geocodeURL);
  return data;
});
