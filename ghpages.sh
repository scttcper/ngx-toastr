#!/bin/bash

if [[ $TRAVIS_BRANCH != 'master' ]]; then
	# Not master branch aborting
	exit 0
fi
yarn build
yarn global add gh-pages
echo "Pushing to github pages"
gh-pages -r "https://$PUSH_TOKEN@github.com/$TRAVIS_REPO_SLUG.git" -d dist -x
git clone https://github.com/scttcper/angular-cli.git
