<template>
  <div class="playground" :style="{maxWidth: getMaxWidth(bricks, 40), pointerEvents: getPointerEvents(nextAction)}">
    <span v-for="(item, index) in bricks" 
      :key="index" class="brick" 
      :class="{'protection': item.protection}" 
      @click="$emit('update:nonBombBrickNum', handleClick(bricks, item, index, nonBombBrickNum))" @contextmenu.prevent="set_remainingBombs(tagBrick(item, remainingBombs))">

      <img src="../assets/flag.png" alt="fl-ag" v-if="item.tagged">
      <img src="../assets/mine.png" class="mine" alt="mine" v-if="item.bombNum === -1">
      <span v-else>{{item.bombNum ? item.bombNum : ''}}</span>
    </span>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'


export default {
  name: 'HelloWorld',
  props: {
    bricks: Array,
    nonBombBrickNum: Number
  },
  computed: {
    ...mapState(['remainingBombs', 'nextAction']),
    getMaxWidth() {
      return function (bricks, BRICK_BASIS) {        
        return Math.sqrt(bricks.length) * BRICK_BASIS + 'px';
      }
    },
    getPointerEvents() {
      return function (nextAction) {
        return nextAction === 'pausing' ? 'auto' : 'none'
      }
    }
  },
  methods: {
    ...mapMutations(['set_remainingBombs', 'set_nextAction']),
    handleClick(bricks, brick, index, nonBombBrickNum) {
      if (brick.tagged) return nonBombBrickNum // 已标记的不可点击

      if (brick.bombNum === -1) { // 失败，是雷的话取消所有保护层
        this.set_nextAction('restart')
        bricks.map(brick => {
          brick.protection = false
          brick.tagged = false
        })
        alert('失败！ 游戏结束')
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
    }
  },
  watch: {
    nonBombBrickNum(val) {
      if(val === 0) {
        this.bricks.map(brick => {
          brick.protection = false
          brick.tagged = false
        })
        alert('恭喜你！ 已通过')
        this.set_nextAction('restart')
      }
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