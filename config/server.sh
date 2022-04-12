cd ..
npm stop
rm -r dist
git pull
npm run build
cp map/jquery.min.js dist/jquery.min.js
npm start
