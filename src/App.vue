<template>
  <div id="app">
    <MainHeader :is_main="is_main" @BackButton="BackButton" @testButton="testButton"/>
    <div v-if="is_main==0" style="margin-top:20px;display:flex;align-items: center;flex-direction: column;">
      <p>Reddit 사이트에서 운영한 r/Place를 카피한 사이트 입니다.</p>
      <div style="width: 80%;">
        <video ref="video" src="./assets/video.mp4" autoplay muted loop playsinline class="video-style"></video>
        <p style="margin:0px;"><a href="https://www.reddit.com/r/place/">출처 [Reddit 공식사이트 ]</a></p>
        <button class="start-button" @click="startButton">m/Place Start</button>
      </div>
    </div>
    <div v-else-if="is_main==1" >
      <MainTest/>
    </div> 
    <div v-else>
      <MainView/>
    </div> 
    
  </div>
</template>

<script>
import MainView from './components/MainView.vue';
import MainHeader from './components/MainHeader.vue';
import MainTest from './components/MainTest.vue';


export default {
  name: 'App',
  data(){
    return{
      is_main: 0
    };
  },  
  components: {
    MainView,
    MainHeader,
    MainTest,
  },
  methods: {
    startButton() {
      this.is_main= 2;
    },
    BackButton() {
      this.is_main= 0;
    },
    testButton() {
      this.is_main= 1;
    }
  }
}
</script>

<style>
body {
  margin:0;
  background: rgb(255, 255, 255);
}
.start-button {
  background-color: #4c65af; /* Green background */
  border: none; /* Remove borders */
  color: white; /* White text */
  padding: 15px 32px; /* Some padding */
  text-align: center; /* Center the text */
  text-decoration: none; /* Remove underline */
  display: inline-block; /* Get the element to fit the content */
  font-size: 16px; /* Increase font size */
  margin: 20px 2px; /* Some margin */
  cursor: pointer; /* Pointer/hand icon */
  border-radius: 8px; /* Rounded corners */
  transition: background-color 0.3s ease; /* Smooth transition */
}

.start-button:hover {
  background-color: #3e5391; /* Darker green on hover */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
  animation: appear 0.5s ease-in-out;
}

.video-style {
  width: 100%;
  max-width: 500px;
}

@keyframes fall {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes appear {
  0% {
    transform: translateZ(-1000px);
    opacity: 0;
  }
  100% {
    transform: translateZ(0);
    opacity: 1;
  }
}
</style>
