
## Quantum Dockerfile
## base system & updates

FROM --platform=linux/amd64 redhat/ubi9
RUN  yum swap -y fakesystemd systemd && \
	 yum -y update --setopt=tsflags=nodocs && \
	 yum -y install git wget nano make dos2unix 



## install node.js

### https://nodejs.org/en/download/package-manager/#enterprise-linux-and-fedora
### 
### start command: pm2-docker start $APP --watch &
### where $APP is the main file name (e.g. server.js) or can be specified at runtime
### for options to the --watch flag, add a config.json file to the build

RUN yum -y install nodejs  && \
	yum -y update --setopt=tsflags=nodocs && \
	npm install -g bower && \
	npm install -g gulp  && \
	npm install -g mean-cli && \
	npm install -g pm2 \
	npm install -g express


## install logrotate for pm2

RUN pm2 install pm2-logrotate && \
	pm2 set pm2-logrotate:compress true && \
	pm2 set pm2-logrotate:retain 7



## deploy quantum app

### create a directory node and copy the source code under /node
### node server should run on port 3000
### start command: pm2 start

# Create app directory
RUN  mkdir -p /node
WORKDIR /node

# Copy code contents and install app dependencies
COPY . /node
RUN npm install --no-save

# create a directory to store the uploaded files
RUN  mkdir -p /tmp/uploads

#**** add build argument to environment variable ****
# only environment variables can be used in CMD commands
ARG ENVIRONMENT
ENV ENVIRONMENT ${ENVIRONMENT}


##############################################################################	
	
#**** start servers with container deploy
# the last command can't exit, or the container will shutdown

EXPOSE 3000
CMD pm2 start ecosystem.config.js --env ${ENVIRONMENT} --no-daemon &
	
