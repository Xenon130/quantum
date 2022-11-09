#!/bin/bash

# run mode is passed as an argument:
#
#	mode			        | source	|	execution  | exec
#	------------------------------------------------------------
# 	debug		         	| host		|	host       | node
# 	debug2		         	| host		|	host       | pm2
# 	development (default)	| host		|	container  | pm2
# 	production		        | container |	container  | pm2
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
if [ "$1" = "debug" ] || [ "$1" = "debug2" ]; then

	# make sure node.js is installed /loaded
	if [ -z "which node" ]; then
		echo "Installing node ..."
		curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
		. ~/.nvm/nvm.sh
		nvm install 16.0.0
	fi

	# run quantum on the host using node
	if [ "$1" = "debug" ]; then
		export NODE_ENV='development'
		echo "Starting DEBUG mode / running node"
		node node/server.js

	# run quantum on the host using pm2
	else
		cd node
		# make sure pm2 is installed
		if [ -z "which pm2" ]; then
			echo "Installing prerequisites ..."
			npm install -g express
			npm install -g pm2 && pm2 update
			pm2 install pm2-logrotate
			pm2 set pm2-logrotate:compress true
			pm2 set pm2-logrotate:retain 5
		fi

		export NODE_ENV='development'
		echo "Starting DEBUG mode / running pm2"
		pm2 start pm2.config.js
		echo ""
		echo "> stream logs  : pm2 logs quantum"
		echo "> exit app     : pm2 stop quantum"
		echo "> monitor app  : pm2 monit"
		echo ""
		cd ..
	fi


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
		echo -n "Starting DEVELOPER mode "
		docker run -d -t 		\
		 --name quantum         \
		 --env-file secrets.env \
		 -v $(pwd)/node:/node/  \
		 -p 3000:3000           \
		 --entrypoint /bin/bash xenon130/quantum > /dev/null
	fi

	# wait 5 seconds
	for i in 1 2 3
	do
		sleep 1.5s
		echo -n "."
	done
	echo " "

	# show status
	printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
	docker ps -a
	printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -

fi
