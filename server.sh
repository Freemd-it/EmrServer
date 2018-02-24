
# aws micro 실행할 bashfile
# ubuntu server 
# sh server.sh
echo "env setting"

apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu xenial stable"
apt-key fingerprint 0EBFCD88
 
# docker install
apt-get update
echo "docker install"
apt-get install docker-ce -y
  
service docker start