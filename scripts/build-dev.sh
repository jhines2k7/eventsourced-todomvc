#!/usr/bin/env bash
# clean the dist directory
if [ -d dist ]; then
  rm -rf dist
fi

mkdir dist

# clean the .tmp directory
if [ -d .tmp ]; then
  rm -rf .tmp
fi

mkdir .tmp

cp js/*.js .tmp

# js compile and transform
node_modules/.bin/webpack --config=webpack.config.js

# timestamp=$(date "+%Y%m%d_%H%M%S")
# append # to end of js file for cache busting
# mv dist/bundle.js dist/bundle-$timestamp.js
# mv dist/bundle.js.map dist/bundle-$timestamp.js.map

# change the src property of the script tag to app.js
#sed -i "s/dist\/bundle.js/dist\/bundle-\${timestamp}.js/g" index.html

date; echo;
