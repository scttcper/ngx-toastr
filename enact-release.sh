#!/usr/bin/env bash

set -ex

# multiple packages
# for package in ./deploy/*
# do
#   npm publish ${package}
# done

# single package
cd ./deploy
npm publish
