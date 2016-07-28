#!/usr/bin/env bash

set -ex

for package in ./deploy/*
do
  npm publish ${package}
done
