#!/usr/bin/env sh
set -e
echo ======================== Install packages ================
npm install
echo ======================== Info ================
echo "user: $(whoami)"
echo "npm: $(npm -v)"
echo "node: $(node -v)"
echo "docker: $(docker -v)"
echo ======================== Keep alive ================
tail -f /dev/null