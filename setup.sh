#!/bin/bash

echo "---------------------------------------------------------------------------"


# install git-crypt

### https://dev.to/heroku/how-to-manage-your-secrets-with-git-crypt-56ih
### official build fails with openssl 3.x > use below 
### https://rhel.pkgs.org/8/epel-x86_64/git-crypt-0.6.0-7.el8.x86_64.rpm.html

path_to_exec=$(which git-crypt)
if [ -x "$path_to_exec" ] ; then
    echo "found git-crypt at $path_to_exec"
else	
    echo "Installing git-crypt ..."	
	wget https://download-ib01.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/g/git-crypt-0.6.0-7.el8.x86_64.rpm
	sudo yum install git-crypt-0.6.0-7.el8.x86_64.rpm
	rm git-crypt-0.6.0-7.el8.x86_64.rpm	
fi


# install docker, and set to auto-start

path_to_exec=$(which docker)
if [ -x "$path_to_exec" ] ; then
    echo "found docker at    $path_to_exec"
else	
    echo "Installing docker ..."	
	sudo yum install docker
	sudo groupadd docker
	sudo usermod -aG docker $USER	
fi
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
sudo systemctl start docker


# build app container

echo "building quantum image ..."
sudo docker rmi xenon130/quantum
sudo docker build -t xenon130/quantum -f docker/Dockerfile node
echo "---------------------------------------------------------------------------"
sudo docker image ls