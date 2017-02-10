#!/bin/bash

if [[ $TRAVIS_BRANCH != 'master' ]]; then
	# Not master branch aborting
	exit 0
fi
yarn ghpages
yarn global add gh-pages
echo "Pushing to github pages"
gh-pages -r "https://$PUSH_TOKEN@github.com/$TRAVIS_REPO_SLUG.git" -d dist -x
