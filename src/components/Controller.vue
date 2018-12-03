<template>
  <div class="setting-panel container">
    <div class="row justify-content-between">
          <span>剩余雷数: <span>{{remainingBombs}} </span>个</span>
          <span>持续时间: <span>{{controller.counter}} </span>秒</span>
    </div>
    <h4 class="row">难度选择：</h4>
    <div class="row align-items-center justify-content-between radio-group">          
      <span v-for="(item, index) in controller.radios" :key="index">
        
        <label :for="item.value" style="cursor: pointer" :class="{disable: controller.isDisabled}"><input :disabled="controller.isDisabled" type="radio" style="cursor: pointer" :value="item.value" v-model="controller.picked" :id="item.value">{{item.type}}</label>  
      </span>      
    </div>
    <h4 class="row">提示：</h4>
    <div class="row text-left">
      <p>1. 游戏未开始时，方块不可点击</p>     
      <p>2. 点击 “开始游戏” 游戏开始计时, 游戏在进行中时无法切换难度</p>     
    </div>
    <div class="row btn-group">
      <button class="btn-primary btn btn-block" @click="set_nextAction(start(controller))" v-if="nextAction === 'start'">开始游戏</button>
      <button class="btn-success btn btn-block" @click="set_nextAction(pausing(controller))" v-if="nextAction === 'pausing'">暂停游戏</button>
      <button class="btn-warning btn btn-block" @click="set_nextAction(resume(controller, startTimer))" v-if="nextAction === 'resume'">继续游戏</button>
      <button class="btn-secondary btn btn-block" @click="restart(set_nextAction, controller)" v-if="nextAction === 'restart'">重新开始</button>
      <button class="btn-danger btn btn-block" @click="set_nextAction(end(controller))">结束游戏</button>
    </div>
  </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'

export default {
  computed: {
    ...mapState(['remainingBombs', 'nextAction']),
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
        timer: null,
        counter: 0,
        isDisabled: false
      }
    }
  },
  methods: {
    ...mapMutations(['set_nextAction']),
    pausing(controller) {
      clearTimeout(controller.timer)
      return 'resume'
    },
    start(controller) {      
      const nextAction = this.resetController(controller)
      controller.isDisabled = true
      this.startTimer(controller)
      return nextAction
    },
    restart(set_nextAction, controller) {
      set_nextAction(this.end(controller))
      this.$nextTick(() => {
        set_nextAction(this.start(controller))
      })
    },
    resume(controller, startTimer) {
      startTimer(controller)
      return 'pausing'
    },
    end(controller) {
      this.resetController(controller)
      clearTimeout(controller.timer)
      return 'start'
    },
    resetController(controller) {
      controller.isDisabled = false
      controller.counter = 0
      return 'pausing'
    },
    startTimer(controller, interval = 1000) {
      controller.timer = setTimeout(() => {
        controller.counter++;
        this.startTimer(controller)
      }, interval)
    }
  },
  watch: {
    'controller.picked': function(val) {
      this.$emit('levelChange', val)
    },
    nextAction(action) {
      if (action === 'restart') {
        clearTimeout(this.controller.timer)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.setting-panel {
  position: relative; 
  height: 100%;
}
.row {
  margin-bottom: 20px;
  .radio-group label{
    margin-bottom: 0;
  }
  &.btn-group {
    position: absolute;
    bottom: 0;
    width: 100%;
    margin-bottom: 0;    
  }
}
.disable {
  pointer-events: none;
}
</style>
