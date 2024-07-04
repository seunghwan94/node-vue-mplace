const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mariadb = require('mysql');
const ServerHost = require('./config.json');

// 데이터베이스 연결 설정
const conn = mariadb.createConnection({
  host: ServerHost.database.host,
  port: ServerHost.database.port,
  user: ServerHost.database.user,
  password: ServerHost.database.password,
  database: ServerHost.database.database
});

const app = express();
const server = http.createServer(app);

// CORS 설정 객체 정의
const corsOptions = {
  origin: `http://${ServerHost.Server.host}`,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};
// Socket.IO에 CORS 설정 적용
const io = new Server(server, {
  cors: corsOptions
});
console.log(corsOptions);
// Express에 CORS 설정 적용
app.use(cors(corsOptions));
app.use(express.json());

const canvasSize = 50;
let canvas = Array(canvasSize).fill().map(() => Array(canvasSize).fill('#FFFFFF'));

// 전날 데이터 뿌려주기
const loadCanvasData = () => {
  const query = 'SELECT x, y, color FROM canvas_pixels_day';
  conn.query(query, (err, results) => {
    if (err) {
      console.error('Database select error:', err);
      return;
    }
    results.forEach((row) => {
      canvas[row.x][row.y] = row.color;
    });
    console.log('Canvas data loaded from database');
  });
};

// 초기 캔버스 데이터 로드
loadCanvasData();

io.on('connection', (socket) => {
  const clientIP = socket.handshake.address;
  console.log(`A user connected: ${clientIP}`);

  // 초기 캔버스 상태 전송
  socket.emit('init', canvas);

  // 클라이언트로부터의 픽셀 그리기 요청 처리
  socket.on('draw', (data) => {
    const { x, y, color } = data;
    canvas[x][y] = color;
    // 변경된 픽셀 정보를 모든 클라이언트에게 전송
    io.emit('update', { x, y, color });
    // 변경된 픽셀 정보를 데이터베이스에 저장
    const query = 'INSERT INTO canvas_pixels_log (x, y, color, addr_ip) VALUES (?, ?, ?, ?)';
    
    conn.query(query, [x, y, color, clientIP], (err, result) => {
      if (err) {
        console.error('insert err:', err);
      } else {
        console.log(`insert ID: ${result.insertId}`);
      }
    });
  });

  socket.on('drawView', () => {
    const query = 'SELECT x, y, color FROM canvas_pixels_log ORDER BY id ASC';
    conn.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching pixel logs:', err);
        return;
      }
      // 결과를 클라이언트에게 한 줄씩 전송
      results.forEach((row, index) => {
        setTimeout(() => {
          console.log(row)
          socket.emit('update', row);
        }, index * 100); // 1초 간격으로 전송 (index * 1000 milliseconds)
      });
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// 클라이언트에게 픽셀 데이터 제공하는 API 엔드포인트
app.get('/getPixelLogs', (req, res) => {
  const query = 'SELECT x, y, color FROM canvas_pixels_log ORDER BY id ASC';
  conn.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching pixel logs:', err);
      res.status(500).json({ error: 'Failed to fetch pixel logs' });
      return;
    }
    res.json(results);
  });
});

// 캔버스 데이터 저장 API 엔드포인트
app.get('/save', (req, res) => {
  const query = 'INSERT INTO canvas_pixels_day (x, y, color) VALUES ?';
  const values = [];

  for (let x = 0; x < canvasSize; x++) {
    for (let y = 0; y < canvasSize; y++) {
      values.push([x, y, canvas[x][y]]);
    }
  }

  conn.query(query, [values], (err, result) => {
    if (err) {
      console.error('Data save error:', err);
      res.status(500).json({ error: 'Failed to save canvas data' });
      return;
    }
    console.log(`Data save total: ${result.affectedRows}`);
    res.json({ message: 'Canvas data saved successfully' });
  });
});

// 서버 시작
server.listen(ServerHost.Server.BackPort, () => {
  console.log(`Server is listening on port ${ServerHost.Server.BackPort}`);
});
