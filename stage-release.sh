#!/usr/bin/env bash
set -exu

# Stages a release by putting everything that should be packaged and released
# into the ./deploy folder. This script should be run from the root of the project

# Clear dist/ and deploy/ so that we guarantee there are no stale artifacts.
rm -rf dist
rm -rf deploy
rm -rf waste

# compile src directory and create d.ts files
./node_modules/.bin/ngc -p ./lib/tsconfig.json -d
# create umd
./node_modules/.bin/rollup -c rollup.js

# copy root readme and license to deployment folder
# for multiple
# for d in ./deploy/*; do cp README.md "$d"; done
# for d in ./deploy/*; do cp LICENSE "$d"; done
# single
cp README.md ./deploy
cp LICENSE ./deploy

# copy package.json files that are in lib folders
# find src/lib -name 'package.json' -type f -exec cp {} ./deploy \;
cp ./lib/package.json ./deploy
cp ./lib/toastr.css ./deploy
