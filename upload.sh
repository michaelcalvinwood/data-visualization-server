#!/bin/bash

rsync -a . --exclude="node_modules" root@dv-sql.pymnts.com:/home/data-visualization/
