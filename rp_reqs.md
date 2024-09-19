# RP stack

## BACKEND:
supabase for auth (OAuth - providers: github), postgresql (user data)
stripe for payment

nuxt api to connect driver and passenger (check signatures ?)
graphhopper, geoapify api for directions

## FRONTEND:
leaflet, openlayers? haven't decided which map library to use on frontend and integrate with vue
keep it simple with nuxt/vue for now. map and frontend is low priority


## INFRA:
docker for container
nginx for reverse proxy
certbot for ssl certs
opentofu and github actions for CI/CD
datadog for logs
