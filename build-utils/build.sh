#!/bin/bash

cd `dirname $0`
cd ..

docker run \
    --rm \
    -v $(pwd):/root/ulauncher \
    -e NODE_ENV=production \
    -e CI=true \
    --env-file .env.staging \
    node:6 \
    bash -c "cd /root/ulauncher && yarn install && yarn test && yarn build"