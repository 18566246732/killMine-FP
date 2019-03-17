<template>
  <div class="container bg-info p-2 pt-4 text-white" style="padding-bottom: 40px !important;">
    <div class="row justify-content-center">
      <div style="font-size: 0;">
        <div class="playground" :style="{maxWidth: getMaxWidth(controller.bricks, 40), pointerEvents: getPointerEvents}">
          <span v-for="(item, index) in controller.bricks" 
            :key="index" class="brick" 
            :class="{'protection': item.protection}"
            @click="controller.nonBombBrickNum = handleClick(controller, item, index)" @contextmenu.prevent="controller.remainingBombs = tagBrick(item, controller.remainingBombs)">

            <img src="../assets/flag.png" alt="fl-ag" v-if="item.tagged">
            <img src="../assets/mine.png" class="mine" alt="mine" v-if="item.bombNum === -1">
            <span v-else>{{item.bombNum ? item.bombNum : ''}}</span>
          </span>
        </div>
      </div>
      <div style="max-width: 250px" class="ml-4">
        <div class="setting-panel container">
          <div class="row justify-content-between">
                <span>剩余雷数: <span>{{controller.remainingBombs}} </span>个</span>
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
            <button class="btn btn-block" :class="`btn-${controller.btnColor}`" @click="handleTopBtnClick(controller)">{{controller.btnText}}</button>
            <button class="btn-danger btn btn-block" @click="handleBottomBtnClick(controller)">结束游戏</button>
          </div>
        </div>   
      </div>
    </div>
  </div>
</template>

<script>
import fsm from './fsm.js';
export default {
  computed: {
    getMaxWidth() {
      return function (bricks, BRICK_BASIS) {        
        return Math.sqrt(bricks.length) * BRICK_BASIS + 'px';
      }
    },
    getPointerEvents() {
      return this.fsm.state === 'on' ? 'auto' : 'none'
    },
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
        isDisabled: false,
        btnText: '开始游戏',
        btnColor: 'primary',
        nonBombBrickNum: 0,
        remainingBombs: 0,
        bricks: []
      },   
      fsm: fsm
    }
  },
  name: 'HomePage',
  mounted() {
    this.fsm.reset(this.controller)
  },
  methods: {
    handleClick(controller, brick, index) {
      let {bricks, nonBombBrickNum} = controller
      if (brick.tagged) return nonBombBrickNum // 已标记的不可点击
      if (brick.bombNum === -1) { // 失败，是雷的话取消所有保护层
        bricks.map(brick => {
          brick.protection = false
          brick.tagged = false
        })
        alert('失败！ 游戏结束')
        this.isNatureEnd = true
        this.fsm.finish(this.controller)
        return nonBombBrickNum
      }

      brick.protection = false

      nonBombBrickNum--
      if (brick.bombNum === 0) { // 雷数为0的开始向周围展开
        nonBombBrickNum = this.wildOpen(bricks, index, nonBombBrickNum)
      }
      return nonBombBrickNum
    },
    wildOpen(bricks, index, nonBombBrickNum) {
      const row = Math.sqrt(bricks.length) // 每行块数
      const nullArr = [index - row - 1, index - row, index - row + 1, index - 1, index + 1, index + row - 1, index + row, index + row + 1] // 点击块边界的下标
      
      // ======== 边界检查，上下边界可以通过块是否存在来检查
      if(index % row === 0) { //	左边界检查0,3,6
        nullArr.splice(5, 1)
        nullArr.splice(3, 1)
        nullArr.splice(0, 1)
      }

      if(index % row === row-1) { //	右边界检查2,5,8
        nullArr.splice(7, 1)
        nullArr.splice(4, 1)
        nullArr.splice(2, 1)
      }

      let i = 0 // 边界迭代因子，分别迭代上，下，左，右
      while(i < nullArr.length) { // 点击块的边界处理
        const brick = bricks[nullArr[i]]
        if (brick && brick.protection === true) { // 如果块不存在(比如上下边界的时候)，并且当前的块已经打开，则不再检查
          if (brick.bombNum >= 0) { // 除雷外，一律取消保护层
            brick.protection = false
            nonBombBrickNum--
          }
          if (brick.bombNum === 0) {
            nonBombBrickNum = this.wildOpen(bricks, nullArr[i], nonBombBrickNum)
          }
        }
        i++
      }
      return nonBombBrickNum
    },
    tagBrick(brick, remainingBombs) {
      if (brick && brick.protection) {
        if (brick.tagged) {
          brick.tagged = false          
          remainingBombs++
          return remainingBombs
        }
        brick.tagged = true        
        remainingBombs--
        return remainingBombs
      }
      brick.tagged = false
      return remainingBombs 
    },
    startTimer(controller, interval = 1000) {
      controller.timer = setTimeout(() => {
        controller.counter++;
        this.startTimer(controller)
      }, interval)
    },
    handleTopBtnClick(controller) {
      const stateActionMap = {
        over: {
          action: 'restart',
          cb: this.startTimer
        },
        on: {
          action: 'break',
          cb: null
        },
        pause: {
          action: 'resume',
          cb: this.startTimer
        },
        init: {
          action: 'start',
          cb: this.startTimer
        }
      }
      const actionObj = stateActionMap[this.fsm.state]
      this.fsm[actionObj.action](controller, actionObj.cb)
    },
    handleBottomBtnClick(controller) {
      if (this.fsm.state !== 'init') return this.fsm.reset(controller);
    },
  },  
  watch: {
    'controller.nonBombBrickNum': function(val) {
      if(val === 0) {
        this.controller.bricks.map(brick => {
          brick.protection = false
          brick.tagged = false
        })
        alert('恭喜你！ 已通过')
        this.fsm.finish(this.controller)
      }
    },
    'controller.picked': function() {
      this.fsm.reset(this.controller)
    }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$brick_basis: 40px;

.brick {
  height: $brick_basis;
  width: $brick_basis;
  line-height: $brick_basis;  
  display: inline-block;
  border: 2px solid;
  border-color: grey;
  float: left;
  &.protection {
    border-color: white black black white;
    cursor: pointer;
    background: grey;
    &:hover {
      background: rgb(216, 206, 206);
    }
    span {
      position: relative;
      z-index: -1;
    }
    img.mine {
      z-index: -1;
      position: relative;
    }
  }
}
.playground {
  background: grey;
  display: inline-block;
  padding: 10px;
  box-sizing: content-box;
  font-size: 16px;
}
</style>

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
