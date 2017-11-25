FROM ubuntu
MAINTAINER nsml <xodltus@navercorp.com>
# Set the working directory
WORKDIR /app  

USER root

# Run upgrades
RUN apt-get update

# Install
RUN apt-get install apt-utils -y
RUN apt-get install chkconfig 
RUN apt-get install python-pip -y
RUN apt-get install wget
RUN apt-get install vim -y
RUN apt-get install iputils-ping -y 

# Nodejs
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

# Docker
RUN curl -fsSLO https://get.docker.com/builds/Linux/x86_64/docker-17.04.0-ce.tgz \
  && tar xzvf docker-17.04.0-ce.tgz \
  && mv docker/docker /usr/local/bin \
  && rm -r docker docker-17.04.0-ce.tgz

# First, install dependencies to improve layer caching
WORKDIR /app
COPY ./package.json ./ 
RUN npm install

# Add the code 
COPY . /app


# Run the tests and build, to make sure everything is working nicely
RUN echo 'node version : ' && node --version 
RUN echo 'npm  version : ' &&  npm --version

# Build  
WORKDIR /app
RUN echo 'npm run build:prod'
RUN npm run build:prod   

EXPOSE 3000 
# EXPOSE 443