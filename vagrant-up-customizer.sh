#!/bin/bash

# Run common scripts for all projects
if [ -f /tmp/foo.txt ]; then
    sh ./customizations/scripts-common.sh
fi

# Run project specific scripts
if [ -f /tmp/foo.txt ]; then
    sh ./customizations/scripts-project.sh
fi
