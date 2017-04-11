#!/bin/bash

# Pull production db for real
read -r -p "Really pull production db? [y/N] " response
case "$response" in
    [yY][eE][sS]|[yY])
        vagrant ssh -- -t 'ruby /data/wordpress/customizations/insecure-wp-pull-production-db'
        ;;
    *)
        echo 'Production db not pulled.'
        ;;
esac

# Yarn
yarn
