#!/bin/sh
export NODE_OPTIONS=--openssl-legacy-provider
echo before npm install
npm install

npm run build

node -v
npm -v
echo after finish
