<template>
  <div style="min-height: 95px; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; flex-direction: column; align-items: center; width: 115px;" @click="backButton">
      <img src="../assets/logo.png" style="width: auto; height: 55px; display: block; cursor: pointer;">
      <!-- eslint-disable-next-line -->
      <div style="padding-left: 10px;">m/Place-korea</div>
      <!-- eslint-disable-next-line -->
      <div style="color: gray; font-size: 8px; padding-left: 10px;">dev.magoLee</div>
    </div>
    <div style="padding-left: 10px; font-weight: bold; font-size: 22px;cursor: pointer;" @click="backButton">m/Place-korea</div>
    <div style="width: 112px;"><MainModal :is_main="is_main" @testButton="testButton"/></div>
  </div>
</template>
<script>
import MainModal from './MainModal.vue';
export default{
  props:{
    is_main: Number,
  },
  components:{
    MainModal,
  },
  methods: {
    backButton() {
      this.$emit('BackButton');
    },
    testButton() {
      this.$emit('testButton');
    }
  }
}
</script>
<style>

</style>