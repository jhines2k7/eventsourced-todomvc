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

# modify the value of the domain object in the config file
sed -i "s/domain: 'localhost'/domain: 'rocketscores-api'/g" dist/bundle.js

# copy index.html to dist directory
cp index.html dist

# change the src property of the script tag to bundle.js
sed -i 's/dist\/bundle.js/bundle.js/g' dist/index.html

docker build -t jhines2017/riot-eventsourcing .

date; echo;
