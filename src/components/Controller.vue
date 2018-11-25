<template>
  <div class="setting-panel container">
    <div class="row justify-content-between">
          <span>剩余雷数: <span>{{controller.remainingBombs}} </span>个</span>
          <span>持续时间: <span>{{timer}} </span>秒</span>
    </div>
    <h4 class="row">难度选择：</h4>
    <div class="row align-items-center justify-content-between radio-group">          
      <!-- <ul style="list-style: none;" class="p-0">
        <li><input type="radio" name="mode" id="primary" checked/> 初级 (10*10)</li>
        <li><input type="radio" name="mode" id=""/> 中级 (15*15)</li>
        <li><input type="radio" name="mode" id="master"/> 高级 (20*20)</li>
      </ul> -->
      <span v-for="(item, index) in controller.radios" :key="index">
        <input type="radio" :value="item.value" v-model="picked">
        <label :for="item.value">{{item.type}}</label>  
      </span>      
    </div>
    <h4 class="row">提示：</h4>
    <div class="row text-left">
      <p>1、点击“开始游戏”
          游戏开始计时</p>
      <p>2、游戏过程中点击
          “开始游戏”,将开始新游戏</p>      
    </div>
    <div class="row">
      <button class="btn-primary btn btn-block" @click="startOrPauseGame">{{`${controller.isStart ? '开始' : '暂停'}游戏`}}</button>
      <button class="btn-danger btn btn-block" @click="endGame">结束游戏</button>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    timer() {
      return new Date()
    }
  },
  data() {
    return {
      controller: {
        picked: 10,
        radios: [
          {
            value: 10,
            type: '初级',
          },
          {
            value: 15,
            type: '中级',
          },
          {
            value: 20,
            type: '高级'
          }
        ],
        remainingBombs: 0,
        isStart: true
      }
    }
  },
  methods: {
    startOrPauseGame() {
      this.resetController(this.controller)
      this.initPlayGround()
    },
    resetController(controller) {
      if (!controller.isStart) { // 暂停
        controller.isStart = true
      }
    }
  },
  watch: {
    picked(val) {
      console.log(val, 'val in picked');
      
      this.$emit('classChange', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.row {
  margin-bottom: 20px;
  .radio-group label{
    margin-bottom: 0;
  }
}
</style>
