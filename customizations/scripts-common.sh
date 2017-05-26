#!/bin/bash

# Initialize a new theme
read -r -p "==> ksa: Would you like to initialize a new theme? (no): " response
case "$response" in
  [yY][eE][sS]|[yY])
    read -e -p "==> ksa: What would you like to call the new theme? (kage): " themename
    [ -z "${themename}" ] && themename='kage'
    echo '==> ksa: Cloning kage starter theme into themes directory and removing its .git directory'
    git clone git@bitbucket.org:kehittamo/kage.git htdocs/wp-content/themes/$themename
    rm -rf htdocs/wp-content/themes/$themename/.git
    cp gulp.config.js.example gulp.config.js
    if [ ! $themename = "kage" ]; then
      echo "==> ksa: Setting up theme $themename"
      mv htdocs/wp-content/themes/$themename/lang/kage.pot htdocs/wp-content/themes/$themename/lang/$themename.pot
      sed -i -e "s/Kage/$themename/g" htdocs/wp-content/themes/$themename/style.css
      cp gulp.config.js.example gulp.config.js
      sed -i -e "s/kage/$themename/g" gulp.config.js
      vagrant ssh -- -t "wp theme activate $themename"
    fi
    echo "==> ksa: Theme $themename succesfully initialized and activated."
    ;;
  *)
    echo '==> ksa: Theme not initialized.'
    ;;
esac

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
