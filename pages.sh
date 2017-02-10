#!/bin/bash

yarn build
yarn global add gh-pages
gh-pages -r https://$PUSH_TOKEN@github.com/$TRAVIS_REPO_SLUG.git -d dist
