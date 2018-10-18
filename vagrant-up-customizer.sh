#!/bin/bash

set -e # If a subscript fails, exit with error.

# Run common scripts for all projects
if [ -f ./customizations/scripts-common.sh ]; then
    sh ./customizations/scripts-common.sh
fi

# Run project specific scripts
if [ -f ./customizations/scripts-project.sh ]; then
    sh ./customizations/scripts-project.sh
fi
