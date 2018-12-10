# Kehittamo Seravo Addons
Sugar for `vagrant up` when using [Seravo/wordpress](https://github.com/Seravo/wordpress).

## Installation
$ `composer require --dev kehittamo/kehittamo-seravo-addons:^2.0.0`

$ `vagrant up`

## Usage
During $ `vagrant up`, you will have new options to choose from (see [features](#features)).

Develop the theme's assets in:
`htdocs/wp-content/themes/THEMENAME/assets`

The following scripts are available for theme development:
$ `yarn serve` BrowserSync + reload
$ `yarn build` Builds files for production (used in pipelines)
$ `yarn lint` Lint the project's theme (scss & js, used in pipelines)
$ `yarn lint:scss` Lint scss
$ `yarn lint:js` Lint js
$ `yarn fix` Fix the project's theme (scss & js)
$ `yarn fix:scss` Fix scss
$ `yarn fix:js` Fix js

## Features
* [Kage](https://github.com/kehittamo/kage) starter theme initialization (during vagrant up).
* Master gulpfile asset pipeline with
  * Error notifications
  * SASS/LESS preprocessing
  * CSS source maps and minification
  * JavaScript processing and bundling with Webpack
  * Styles and scripts linting
  * Image minification
  * .pot file creation
  * Style guide creation
  * Livereload server
* Asset building on production and staging (with BitBucket pipelines).
* Adds tags in the production and staging environments automatically, incrementing the latest SEMVER tag available.
* A working pull production database script (during vagrant up).
* .env initialization
* Yarn execution
* Support for project specific scripts
* Optionally adds Kehittamo Seravo Library during theme generation (during vagrant up).

## Prerequisites
* [Yarn](https://yarnpkg.com/en/docs/install)

## Troubleshooting
The assumption is your project directory and the project name in config.yml are the same. If not, edit your gulp.config.js proxy address to match your project name.

Currently automatic tagging is tied to the production and staging servers. The tags are used for cache busting. If tagging fails a fast fix may be to clear the tags after connecting via ssh:
$ `git tag -d $(git tag | grep "production\|staging")`

The kage theme and Kehittamo Seravo Library are currently version constrained with ^2.0.0.

