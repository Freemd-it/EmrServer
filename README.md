# Freemed Emr
this is freemed Emr page.
inc freemd.

## Env
 - nodejs
 - react
 - webpack
 - mariadb
 - nginx



## 실행방법
docker 기본적인 사용법

url :https://docs.docker.com/engine/reference/commandline/cli/

### 처음 할경우 (docker 설치 & docker build)
ubuntu docker install
```
sh server.sh
```

web docker build
```
docker build -t emr-web:0.1 .
```

### database (mariadb)
```
docker run -d --restart=always \
    -p 3306:3306 \
    --name emr-db \
    -v /etc/mysql/my.cnf:/etc/mysql/my.cnf \
    -v /var/lib/mysql:/var/lib/mysql \
    mariadb 
```
### prod
1. docker 실행 & server 실행
```
docker run -d  --restart=always \
    -p 3000:3000 \
    --name emr-web \
    -v `pwd`:/app/emr-web \
    emr-web:0.1 npm run start_prod
```
### local

1. docker 실행
```
docker run -it  --rm \
    -v `pwd`:/app/emr-web \
    -p 3000:3000 \
    --name emr-web \
    emr-web:0.1 bash
```
2. server 실행
```
cd /app/emr-web
npm run start:start
```

### docker
docker image 확인
```
docker images
```
docker container 확인 
```
docker ps
```
docker 접근
```
docker exec -it emr-web bash 
```


## TODO
- [ ] verision 관리

# Docker
해당 이미지

### docker hub 확인한다.
url :  https://hub.docker.com/

nodejs : https://hub.docker.com/_/node/

nginx : https://hub.docker.com/_/nginx/

mariadb : https://hub.docker.com/_/mariadb/

### docker image pull
```
docker pull [ image ]
```



