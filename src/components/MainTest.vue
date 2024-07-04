<template>
    <div class="main-body">
      <div class="canvas-container">
        <canvas id="canvas"></canvas>
      </div>
    </div>
  </template>
  
  <script>
  import { io } from 'socket.io-client';
  
  
  export default {
    name: 'MainView',
    data() {
      return {
        cellSize: 0,
        pixels: [] // 픽셀 데이터를 저장하기 위한 배열
      };
    },
    mounted() {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      const socket = io(`http://magolee.shop:3000`);
      const canvasSize = 50;
  
      const setCanvasSize = () => {
        const containerWidth = canvas.parentElement.clientWidth;
        const ratio = window.devicePixelRatio || 1;
        canvas.width = containerWidth * ratio;
        canvas.height = containerWidth * ratio;
        canvas.style.width = `${containerWidth}px`;
        canvas.style.height = `${containerWidth}px`;
        ctx.scale(ratio, ratio);
        this.cellSize = canvas.width / canvasSize / ratio;
        this.drawGrid(ctx, canvasSize);
        this.redrawPixels(ctx); // 픽셀 데이터를 다시 그립니다.
      };
  
      setCanvasSize();
      window.addEventListener('resize', setCanvasSize);
  
      socket.on('update', (data) => {
        const { x, y, color } = data;
        this.drawPixel(ctx, x, y, color);
        if (!this.pixels[x]) this.pixels[x] = [];
        this.pixels[x][y] = color; // 업데이트된 픽셀 데이터를 저장합니다.
      });
  
      socket.emit('drawView');
    },
    methods: {
      drawGrid(ctx, canvasSize) {
        ctx.strokeStyle = 'lightgray';
        ctx.lineWidth = 1;
        for (let i = 0; i <= canvasSize; i++) {
          ctx.beginPath();
          ctx.moveTo(i * this.cellSize, 0);
          ctx.lineTo(i * this.cellSize, canvasSize * this.cellSize);
          ctx.stroke();
  
          ctx.beginPath();
          ctx.moveTo(0, i * this.cellSize);
          ctx.lineTo(canvasSize * this.cellSize, i * this.cellSize);
          ctx.stroke();
        }
      },
      drawPixel(ctx, x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
      },
      redrawPixels(ctx) {
        if (!this.pixels) return;
        this.pixels.forEach((row, x) => {
          row.forEach((color, y) => {
            this.drawPixel(ctx, x, y, color);
          });
        });
      },
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.setCanvasSize);
    },
  };
  </script>
  
  <style>
  .main-body {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
  }
  
  .canvas-container {
    width: 80%;
    max-width: 800px;
  }
  
  canvas {
    width: 100%;
    height: auto;
    border: 1px solid black;
    background: white;
  }
  </style>
  