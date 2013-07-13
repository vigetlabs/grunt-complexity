#!/bin/bash

echo "Installing node packages..."
npm install -d

echo
echo "Fetching submodules..."
git submodule init
git submodule update
cd test/grunt.0.4
npm install
cd ..

echo
echo "Running tests...."
grunt

echo
echo "Done!"