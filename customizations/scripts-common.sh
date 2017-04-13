#!/bin/bash

# Actually pull database from production
read -r -p "==> ksa: Actually pull database from production? (no): " response
case "$response" in
  [yY][eE][sS]|[yY])
    vagrant ssh -- -t 'ruby /data/wordpress/customizations/insecure-wp-pull-production-db && ruby /data/wordpress/customizations/create-vagrant-admin'
    ;;
  *)
    echo '==> ksa: Production database not pulled.'
    ;;
esac

# Copy ENV if not copied yet
if [ -f .env.example ] && [ ! -f .env ]; then
  echo '==> ksa: Copying .env.example => .env'
  cp .env.example .env
fi

# Yarn
echo '==> ksa: Running yarn'
yarn

# Information
echo '==> ksa: roots/bedrock documentation available at https://roots.io/bedrock/'
echo '==> ksa: kehittamo-seravo-addons documentation available at https://bitbucket.org/kehittamo/kehittamo-seravo-addons'
echo '==> ksa: Start browsersync server & asset watching by running: gulp serve'
