<template>
  <div class="container bg-info p-2 pt-4 text-white" style="padding-bottom: 40px !important;">
    <div class="row justify-content-center">
      <div style="font-size: 0;">
        <play-ground :bricks="bricks" :nonBombBrickNum.sync="nonBombBrickNum"></play-ground>
      </div>
      <div style="max-width: 250px" class="ml-4">
        <controller @levelChange="handleLevelChange"></controller>       
      </div>
    </div>
  </div>
</template>

<script>
import PlayGround from '../components/PlayGround.vue'
import Controller from '../components/Controller.vue'
import {mapState, mapMutations} from 'vuex'
export default {
  components: {
    PlayGround,
    Controller
  },
  computed: {
    ...mapState(['nextAction', 'remainingBombs']),
  },
  data() {
    return {
      bricks: [],
      nonBombBrickNum: 0      
    }
  },
  name: 'HomePage',
  mounted() {
    this.bricks = this.createBricks(10)
    this.nonBombBrickNum = this.bricks.length - this.remainingBombs
  },
  methods: {
    ...mapMutations(['set_remainingBombs']),
    createBricks(num, totalBombRate = 0.1) {
      const brick = {
        bombNum: 0, // 周围雷的数量，-1表示自己是雷，0-8表示自己不是雷
        tagged: false, // 右键标记
        protection: true // 点击方块后保护层消失
      }
      const bricksArr = new Array(num * num)
      const bricksPure = JSON.parse(JSON.stringify(bricksArr.fill(brick)))
      const totalBomb = parseInt(totalBombRate*num*num)
      this.set_remainingBombs(totalBomb)
      const bricksWithBombs = this.buryBomb(bricksPure, totalBomb)
      return this.setSurroundBombNum(bricksWithBombs)
    },
    handleLevelChange(val) {
      this.bricks = this.createBricks(val)
      this.nonBombBrickNum = this.bricks.length - this.remainingBombs
    },
    buryBomb(bricksPure, totalBomb) {
      const bricks = Object.assign(bricksPure)
      while (totalBomb) {
        const randomNum = Math.floor(Math.random()*bricks.length)
        if (bricks[randomNum].bombNum !== -1) {          
          bricks[randomNum].bombNum = -1
          totalBomb--
        }
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
    },
  },
  watch: {
    nextAction(action) {
      if (action === 'start') {
        this.bricks = this.createBricks(Math.sqrt(this.bricks.length))
        this.nonBombBrickNum = this.bricks.length - this.remainingBombs
      }
    }
  }
}
</script>
