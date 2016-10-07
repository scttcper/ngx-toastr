#!/usr/bin/env bash
set -exu

# Stages a release by putting everything that should be packaged and released
# into the ./deploy folder. This script should be run from the root of the project

# Clear dist/ and deploy/ so that we guarantee there are no stale artifacts.
rm -rf ./dist/out-tsc
rm -rf ./deploy

# compile src directory and create d.ts files
tsc -p src -d

# deploy/ serves as a working directory to stage the release.
mkdir deploy

# Copy all lib/ to deploy/
cp -R ./dist/out-tsc/lib/* ./deploy/

# copy root readme and license to deployment folder
# for multiple
# for d in ./deploy/*; do cp README.md "$d"; done
# for d in ./deploy/*; do cp LICENSE "$d"; done
# single
cp README.md ./deploy
cp LICENSE ./deploy

# copy package.json files that are in lib folders
find src/lib -name 'package.json' -type f -exec cp {} ./deploy \;
