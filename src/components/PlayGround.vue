<template>
  <div class="playground" :style="{maxWidth: getmaxWidth}">
    <span v-for="(item, index) in bricks" 
      :key="index" class="brick" 
      :class="{'protection': item.protection}" 
      @click="item.protection = false">

      <img src="../assets/flag.png" alt="flag" v-if="item.tagged">
      <img src="../assets/mine.png" alt="mine" v-if="item.bomb_num === -1">
      <span v-else>{{item.bomb_num ? item.bomb_num : ''}}</span>
    </span>
  </div>
</template>

<script>
const BRICK_BASIS = 40;

export default {
  name: 'HelloWorld',
  props: {
    bricks: Array,
    default: () => []
  },
  computed: {
    getmaxWidth() {
      return Math.sqrt(this.bricks.length) * BRICK_BASIS + 'px';
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
  }
}
.playground {
  background: grey;
  display: inline-block;
  padding: 10px;
  // max-width: calc(#{$brick_basis} * 10);
  box-sizing: content-box;
}
</style>