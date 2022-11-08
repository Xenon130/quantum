#!/bin/bash

# run mode is passed as an argument:
#
#	mode			        | source	|	execution
#	------------------------------------------------------------
# 	debug		         	| host		|	host
# 	development (default)	| host		|	container
# 	production		        | container |	container
#

# default credentials / config
export NODE_ENV=development

export MONGO_DB_URL='mongodb://localhost:27017/quantum'
export MONGO_DB_USR=
export MONGO_DB_PWD=

export AUTH_PROVIDER='Mongo'
export AUTH_TENANT_ID=
export AUTH_CALLBACK_URL=
export AUTH_CLIENT_ID='sys.admin@localhost'
export AUTH_CLIENT_SECRET='2infinity'

# load secrets file if available
if [ -f ./secrets.env ]; then
	set -a
    source ./secrets.env
	set +a
fi


# --------------------------------------------------------------

# run local (debug mode)
if [ "$1" = "debug" ]; then
	export NODE_ENV='development'
	echo "Starting DEBUG mode"
	node node/server.js


# run container
else
	echo "Stopping old instances ..."
	docker stop quantum > /dev/null 2>&1
	docker rm   quantum > /dev/null 2>&1

	# production mode
	if [ "$1" = "production" ]; then
		echo "Starting PRODUCTION mode"
		echo "EXIT - not yet implemented"

	# developer mode (default)
	else
		echo "Starting DEVELOPER mode"

		docker run -d -t 		\
		 --name quantum         \
		 --env-file secrets.env \
		 -v $(pwd)/node:/node/  \
		 -p 3000:3000           \
		 xenon130/quantum > /dev/null

	fi

	printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
	docker ps -a
	printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -

fi
