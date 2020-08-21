#!/usr/bin/env bash

# abort on errors
set -e

# install
npm install

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
 git push -f git@github.com:MyEtherWallet/MEWconnect-web-client.git master:gh-pages

cd -