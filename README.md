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
<<<<<<< HEAD
- [x] csrf 오류 해결하기
- [ ] document 작업
- [ ] ocs 신규회원과 기존 수혜자를 구분할 수 있도록 만들어야할 수도(의기팀와 논의필요)
- [x] validation 중 정수만 받게 되어있는 부분 => 실수로 수정 필요
- [ ] 외용제에 대해서는 복용일 수 입력 막기 (do or not)
- [ ] 진료소 기록 복구
- [ ] 접수번호 입력 할 수 있는 구간이 있으면 좋을 듯
- [ ] 파트1 접수시 자동으로 인덱스되는 번호가 아닌 트랜스퍼가 수혜자에게  준 번호표에 대한 접수번호를 입력할 수 있는 구간
- [x] 약국 한통당 포장단위 max 1000
- [ ] 복약지도 완료시 network Status 오류 현상 파악해야함.
- [x] 파트1, 파트2 통합으로 인한 과거력 입력 부분 예진으로 이동


### 파트 개편으로 인해 해야하는 일 - 고칠꺼 개많은데..?

- [x] 접수 탭에 있는 과거력 부분 예진으로 옮기기
- [x] 접수탭 접근시 과거력 정보를 가져올 필요가 없다.
- [x] 예진 탭 진입시 환자 정보에 따른 과거력 가져오기
- [x] 예진 완료시 과거력 정보 업데이트 하기
- [x] 기능 이전 완료시 접수탭 과거력 부분 제거

    예진으로 보내는 api가 발생할 경우
    
    # 수혜자 정보에 대한 탐색이 우선 발생한다
    
    case1: 환자 정보가 있는 경우 histroy table과 join을 이				 용해 정보를 가져온다.
    	
    case2: 기존 환자 정보가 존재하지 않는 경우 접수에서 넘어온 데				 이터를 기반으로 histroy 테이블에 새로운 과거력을 추					 가하게 된다.
    
    => 환자의 정보가 있던지 없던지 상관없이, history 관련 내용은 예진으로 넘어간다.
    
    
    # 예진 탭에 접근할 때, 환자의 히스토리 정보도 함께 가져온다.
    - 이미 접수를 통해 정보가 입력된 환자 이므로 과거 이력은 무조건 존재 한다, 다만 값이 없는 경우가 있을 수 있다.



### 무진본부

    1. 신규, 기존 수혜자랑 구분할 수 있도록 수정
    	기존 엑셀 파일 기준으로 수혜자 번호 등록 할 수 있게 변경 필요
    
    2. 원하는 환자에 대한 그래프 볼 수 있게


### Description For Database permission

각각의 권한은 해당 4자리의 정수 코드를 따른다.

- [ ] csrf 오류 해결하기
- [ ] document 작업

### Description For Database permission

각각의 권한은 해당 4자리의 정수 코드를 따른다.

```
doctor 6000
3partLeader 7000
pharmacist 8000
super 9000
```
