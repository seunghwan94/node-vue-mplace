<template>
  <div>
    <div class="main-body">
      <div v-if="countdown > 0" class="countdown" :style="{ color: countdownRunning ? 'red' : 'black' }">
        {{ formatCountdown(countdown) }}
      </div>
      <div v-else class="countdown">
        00:00
      </div>
      <div style="width: 80%; margin-bottom: 15px;max-width: 800px;">
        <div @click="ColorPickinput" style="border: 1px solid black; border-bottom-color: transparent; border-radius: 5px 5px 0 0;">색상 선택</div>

        <input type="color" ref="colorPick" v-model="selectedColor" style=" width: 100%; border: 1px solid black;border-top-color: transparent; border-radius: 0 0 5px 5px;">
      </div>
      <div class="canvas-container">
        <canvas id="canvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  name: 'MainView',
  data() {
    return {
      selectedColor: '#000000',
      countdown: 0,
      countdownInterval: null,
      canvasClickable: true,
      countdownRunning: false,
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

    const countdownCookie = this.getCookie('countdownActive');
    if (countdownCookie) {
      this.countdown = parseInt(countdownCookie, 10);
      this.startClickCooldown();
    }

    socket.on('init', (data) => {
      this.pixels = data; // 서버로부터 받은 초기 픽셀 데이터를 저장합니다.
      this.pixels.forEach((row, x) => {
        row.forEach((color, y) => {
          this.drawPixel(ctx, x, y, color);
        });
      });
      this.drawGrid(ctx, canvasSize);
    });

    socket.on('update', (data) => {
      const { x, y, color } = data;
      this.drawPixel(ctx, x, y, color);
      if (!this.pixels[x]) this.pixels[x] = [];
      this.pixels[x][y] = color; // 업데이트된 픽셀 데이터를 저장합니다.
    });

    canvas.addEventListener('click', (event) => {
      if (!this.canvasClickable) return;

      const x = Math.floor(event.offsetX / this.cellSize);
      const y = Math.floor(event.offsetY / this.cellSize);
      const color = this.selectedColor;

      this.drawPixel(ctx, x, y, color);
      socket.emit('draw', { x, y, color });

      if (!this.pixels[x]) this.pixels[x] = [];
      this.pixels[x][y] = color; // 클릭으로 변경된 픽셀 데이터를 저장합니다.

      this.startClickCooldown();
    });
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
    startClickCooldown() {
      this.canvasClickable = false;
      this.countdown = 2;
      this.countdownRunning = true;
      this.countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.countdownInterval);
          this.canvasClickable = true;
          this.countdownRunning = false;
          this.deleteCookie('countdownActive');
        } else {
          this.setCookie('countdownActive', this.countdown.toString(), this.countdown);
        }
      }, 1000);
    },
    formatCountdown(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    setCookie(name, value, seconds) {
      const d = new Date();
      d.setTime(d.getTime() + (seconds * 1000));
      const expires = "expires=" + d.toUTCString();
      document.cookie = name + "=" + value + ";" + expires + ";path=/";
    },
    getCookie(name) {
      const cname = name + "=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(cname) === 0) {
          return c.substring(cname.length, c.length);
        }
      }
      return "";
    },
    deleteCookie(name) {
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    },
    ColorPickinput() {
      this.$refs.colorPick.click();
    }
  },
  beforeUnmount() {
    clearInterval(this.countdownInterval);
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

.countdown {
  font-size: 24px;
  margin: 10px 0;
  text-align: center;
  font-weight: bold;
}
</style>
