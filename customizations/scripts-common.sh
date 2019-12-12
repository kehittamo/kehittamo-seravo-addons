#!/bin/bash

# Major revision to be used for theme and library.
MAJOR="3"

# Create default .env.example if not found
if [ ! -f .env.example ]; then
  touch .env.example
  echo "ENABLE_DEBUG=true" >> .env.example
  echo "DISABLE_DEBUG_NOTICES=true" >> .env.example
fi

# Copy ENV if not copied yet
if [ -f .env.example ] && [ ! -f .env ]; then
  echo '==> ksa: Copying .env.example => .env'
  cp .env.example .env
fi

# Yarn
echo '==> ksa: Running yarn & yarn build'
yarn
yarn build

# Information
echo '==> ksa: roots/bedrock documentation available at https://roots.io/bedrock/'
echo '==> ksa: kehittamo-seravo-addons documentation available at https://bitbucket.org/kehittamo/kehittamo-seravo-addons'
echo '==> ksa: Start browsersync server & asset watching by running: yarn serve'
