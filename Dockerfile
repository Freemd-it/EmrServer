FROM ubuntu
MAINTAINER nsml <xodltus@naver.com>
# Set the working directory
RUN mkdir -p /app/emr-web
WORKDIR /app/emr-web

USER root

# Run upgrades
RUN apt-get update

# Install
RUN apt-get install -y \
    curl \
    wget \
    vim \
    iputils-ping

# Nodejs
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

# First, install dependencies to improve layer caching
COPY package.json ./ 
RUN npm install

# Add the code 
COPY . /app/emr-web

# Run the tests and build, to make sure everything is working nicely
RUN echo 'node version : ' && node --version 
RUN echo 'npm  version : ' &&  npm --version

# Build
RUN echo 'npm run build:prod'
RUN npm run build:prod

EXPOSE 3000 
