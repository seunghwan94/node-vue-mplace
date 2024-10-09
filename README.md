# m/place 
Reddit에서 진행한 이벤트 r/place 모방한 짝퉁 사이트 m/place

### 플레이 동영상
[https://youtube.com/shorts/Rj8UQSbKMVA](https://youtube.com/shorts/Rj8UQSbKMVA?si=LryFGDX1n_2fb_4w)

## Project setup
```
npm install
```

### mPlace/api/config.json 수정
```
{
    "Server": {
        "host": "",
        "FrontPort": ,
        "BackPort": 
    },
    "database": {
        "host" :"",
        "port":"",
        "user":"",
        "password":"",
        "database":""
    }
}
```

### DB 테이블 셋팅
```
CREATE TABLE canvas_pixels_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    x INT,
    y INT,
    color VARCHAR(7),
    ip_addr VARCHAR(50),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 서버 실행 (BackEnd, FrontEnd 실행해야 됨)
```
npm run serve
node api/server.js
```
