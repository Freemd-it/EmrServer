# Freemed Emr
this is freemed Emr page.
inc freemd.

## Env
 - Node.js
 - javascript & jQuery
 - webpack
 - mysql
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

### Database (mysql)
```

현재 AWS RDS를 이용하고 있으므로 IT기획본부 인프라정보 및 계정정보 확인

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
docker-compuse up --build -d
```
yarn docker
```

2. server 실행
```
cd /app/emr-web
yarn start => 디벨롭 환경에서 nodemon을 기반으로 실행된다.

yarn start:pm2 => 디벨롭 환경에서 pm2를 기반으로 실행된다.

yarn start:prod => 서비스 환경에서 pm2를 기반으로 실행된다
(도커 실행 -> pm2 실행 -> pm2 log 실행)
```

### docker 명령어
docker image 확인
```
docker images
```
docker container 확인 
```
docker ps, docker ps -a
```
docker 접근
```
docker exec -it emr-web bash 
```
docker remove container
```
docker rm "container-name"
```
docker remove image
```
docker rmi "image-name" 
```

### TODO
- [ ] verision 관리
- [ ] csrf 오류 해결하기
- [ ] document 작업

### Description For Database permission
```
각각의 권한은 해당 4자리의 정수 코드를 따른다.

```
doctor 6000
3partLeader 7000
pharmacist 8000
super 9000
```
