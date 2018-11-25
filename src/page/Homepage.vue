<template>
  <div class="container bg-info p-2 pt-4 pb-4 text-white">
    <div class="row justify-content-center">
      <div>
        <play-ground :bricks="bricks"></play-ground>
      </div>
      <div style="max-width: 250px" class="ml-4">
        <controller @classChange="handleClassChange"></controller>       
      </div>
    </div>
  </div>
</template>

<script>
import PlayGround from '../components/PlayGround.vue'
import Controller from '../components/Controller.vue'
export default {
  components: {
    PlayGround,
      Controller
  },
  data() {
    return {
      bricks: []      
    }
  },
  name: 'HomePage',
  mounted() {
    this.bricks = this.createBricks(10, 10)
  },
  methods: {
    createBricks(num, totalBomb) {
      const brick = {
        bombNum: 0,
        tagged: false,
        protection: true // 点击方块后保护层消失
      }
      const bricksArr = new Array(num * num)
      const bricksPure = JSON.parse(JSON.stringify(bricksArr.fill(brick)))
      const bricksWithBombs = this.buryBomb(bricksPure, totalBomb)
      // debugger
      return this.setSurroundBombNum(bricksWithBombs)
    },
    handleClassChange(val) {
      this.bricks = this.createBricks(val)
    },
    buryBomb(bricksPure, totalBomb) {
      const bricks = Object.assign(bricksPure)
      while (totalBomb --) {
        bricks[Math.ceil(Math.random()*bricks.length)].bombNum = -1
      }
      return bricks
    },
    setSurroundBombNum(bricksWithBombs) {
      const bricksWithBombsLocal = Object.assign(bricksWithBombs)
      let sorroundIndexArr = [];
      let row = Math.sqrt(bricksWithBombsLocal.length);
      for(var i = bricksWithBombsLocal.length; i > 0; i--) {
        sorroundIndexArr = [i - row - 1, i - row, i - row + 1, i - 1, i + 1, i + row - 1, i + row, i + row + 1];
        // 边界检测
        if((i-1) % row == 0) {
          sorroundIndexArr.splice(0, 1);
          sorroundIndexArr.splice(2, 1);
          sorroundIndexArr.splice(3, 1);
        }
        if((i-1) % row == row-1) {
          sorroundIndexArr.splice(2, 1);
          sorroundIndexArr.splice(3, 1);
          sorroundIndexArr.splice(5, 1);
        }
        let sourbombNum = 0;
        if(bricksWithBombsLocal[i - 1].bombNum !== -1) {
          for(var j = 0; j < sorroundIndexArr.length; j++) {
            // 点击的9方格必须存在才行
            if(bricksWithBombsLocal[sorroundIndexArr[j] - 1] && bricksWithBombsLocal[sorroundIndexArr[j] - 1].bombNum === -1) {
              sourbombNum++;
            }
          }
          if(sourbombNum != 0) {
            bricksWithBombsLocal[i - 1].bombNum = sourbombNum;
          }
        }
      }
      return bricksWithBombsLocal
    }
  }
}
</script>
