#!/usr/bin/env bash
set -exu

# Stages a release by putting everything that should be packaged and released
# into the ./deploy folder. This script should be run from the root of the
# material2 repo.

# Make sure you are not running `ng serve` or `ng build --watch` when running this.


# Clear dist/ and deploy/ so that we guarantee there are no stale artifacts.
rm -rf ./dist
rm -rf ./deploy

# Perform a build with the modified tsconfig.json.
npm run ng build

# deploy/ serves as a working directory to stage the release.
mkdir deploy

# Copy all components/ to deploy/
cp -R ./dist/components/* ./deploy/

# copy readme
for d in ./deploy/*; do cp README.md "$d"; done


# To test the packages, simply `npm install` the package directories.
