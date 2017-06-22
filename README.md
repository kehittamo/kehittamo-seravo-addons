#Kehittamo Seravo Addons

Sugar for `vagrant up` when using [Seravo/wordpress](https://github.com/Seravo/wordpress).

##Usage
Clone [Seravo/wordpress](https://github.com/kehittamo/wordpress)
Edit your composer.json:
```
{
	"repositories": [
	    {
            "type": "vcs",
            "url": "https://github.com/kehittamo/kehittamo-seravo-addons"
        }
    ],
    "requireDev": {
        "kehittamo/kehittamo-seravo-addons": "dev-master"
    },
    "extra": {
		"dropin-paths": {
			".": ["type:kehittamo-seravo-addons"]
		}
	}
}
```
Remove your composer.lock.
Run `vagrant up`

##Features
* [Kage](https://github.com/kehittamo/kage) starter theme initialization
* Master gulpfile asset pipeline with
-- Error notifications
-- SASS/LESS preprocessing
-- CSS source maps and minification
-- Styles and scripts revisioning
-- Image minification
-- .pot file creation
-- Style guide creation
-- Livereload server
* A working pull production database script
* .env initialization
* Yarn execution
* Support for project specific scripts

##Prerequisites
* [Yarn](https://yarnpkg.com/en/docs/install)
* [Bower](https://bower.io/)

##Troubleshooting
The assumption is your project directory and the project name in config.yml are the same. If not, edit your gulp.config.js proxy address to match your project name.
