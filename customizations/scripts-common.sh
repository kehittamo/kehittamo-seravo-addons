#!/bin/bash

# Pull production db for real
read -r -p "Really pull production db? [y/N] " response
case "$response" in
    [yY][eE][sS]|[yY])
      vagrant ssh -- -t 'ruby /data/wordpress/customizations/insecure-wp-pull-production-db && echo "Creating vagrant:vagrant admin" && wp user create vagrant vagrant@example.local --user_pass=vagrant --role=administrator && echo "Granting vagrant super-admin privileges (Error irrelevant if this is not a multisite install)" && wp super-admin add vagrant'
        ;;
    *)
        echo 'Production db not pulled.'
        ;;
esac

# Yarn
echo 'Running yarn'
yarn
