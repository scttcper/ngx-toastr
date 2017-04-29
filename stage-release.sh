#!/usr/bin/env bash
set -exu

# Stages a release by putting everything that should be packaged and released
# into the ./deploy folder. This script should be run from the root of the project

yarn cleanup
NGC="node node_modules/.bin/ngc"

# Run Angular Compiler
$NGC -p ./src/lib/tsconfig.flat.json -d
./node_modules/.bin/rollup -c rollup.es.js

# Repeat the process for es5 version
$NGC -p ./src/lib/tsconfig.lib.json -d
# create umd
./node_modules/.bin/rollup -c rollup.js

# copy root readme and license to deployment folder
cp README.md ./deploy
cp LICENSE ./deploy

# copy package.json files that are in lib folders
# find src/lib -name 'package.json' -type f -exec cp {} ./deploy \;
cp ./src/lib/package.json ./deploy
cp ./src/lib/toastr.css ./deploy

# Copy non-js files from build
rsync -a build/ deploy
