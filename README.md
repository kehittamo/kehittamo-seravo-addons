# Kehittamo Seravo Addons
Sugar for `vagrant up` when using [Seravo/wordpress](https://github.com/Seravo/wordpress).

## Features
* [Kage](https://github.com/kehittamo/kage) starter theme initialization (during vagrant up).
* A working pull production database script (during vagrant up).
* .env initialization
* Yarn execution & asset building
* Support for project specific scripts

## Prerequisites
* [Vagrant 2.0.4](https://seravo.com/docs/development/how-to-install/)
* [Yarn](https://yarnpkg.com/en/docs/install)
* A [Seravo/wordpress](https://seravo.com/docs/development/how-to-install/) project

## Installation
$ `composer require --dev kehittamo/kehittamo-seravo-addons:^3.0.0`

$ `vagrant up`

## Usage
During $ `vagrant up`, you will have new options to choose from (see [features](#features)).
