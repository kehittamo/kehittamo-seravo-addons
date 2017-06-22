#!/bin/bash

# Initialize a new theme
read -r -p "==> ksa: Would you like to initialize a new theme? (no): " response
case "$response" in
  [yY][eE][sS]|[yY])
    read -e -p "==> ksa: What would you like to call the new theme? (kage): " themename
    [ -z "${themename}" ] && themename='kage'
    if [ ! -d htdocs/wp-content/themes/$themename ]; then
      echo '==> ksa: Cloning kage starter theme into themes directory and removing its .git directory'
      git clone git@github.com:kehittamo/kage.git htdocs/wp-content/themes/$themename
      rm -rf htdocs/wp-content/themes/$themename/.git
      if [ -f gulp.config.js.example ] && [ ! -f gulp.config.js ]; then
        cp gulp.config.js.example gulp.config.js
        sed -i '' -e "s/kage/$themename/g" gulp.config.js
      fi
      if [ ! $themename = "kage" ]; then
        echo "==> ksa: Setting up theme $themename"
        mv htdocs/wp-content/themes/$themename/lang/kage.pot htdocs/wp-content/themes/$themename/lang/$themename.pot
        sed -i '' -e "s/Kage/$themename/g" htdocs/wp-content/themes/$themename/style.css
        vagrant ssh -- -t "wp theme activate $themename"
      fi
      cd htdocs/wp-content/themes/$themename
      bower install
      cd ../../../../
      echo "==> ksa: Theme $themename succesfully initialized and activated."
    else
      echo "==> ksa: Theme $themename directory already exists. Theme not initialized."
    fi
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

# Create default .env.example if not found
if [ ! -f .env.example ]; then
  touch .env.example
  echo "ENABLE_DEBUG=true" >> .env.example
  echo "DISABLE_DEBUG_NOTICES=true" >> .env.example
fi

# Add to .gitignore. Use .env to determine if this has been done.
if [ -f .env.example ] && [ ! -f .env ]; then
  echo '==> ksa: Extending .gitignore with Kehittamo Seravo Addons'
  echo "" >> .gitignore
  echo "# Kehittamo Seravo Addons" >> .gitignore
  echo "package.json" >> .gitignore
  echo "gulpfile.js" >> .gitignore
  echo "gulp.config.js.example" >> .gitignore
  echo "vagrant-up-customizer.sh" >> .gitignore
  echo "customizations/*" >> .gitignore
  echo "!customizations/scripts-project.sh" >> .gitignore
fi

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
