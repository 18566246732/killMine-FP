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
    this.bricks = this.createBricks(10)
  },
  methods: {
    createBricks(num) {
      const brick = {
        bomb_num: 0,
        tagged: false,
        protection: true // 点击方块后保护层消失
      }
      const bricks = new Array(num * num)
      return JSON.parse(JSON.stringify(bricks.fill(brick))) 
    },
    handleClassChange(val) {
      console.log(val, 'val');
      
      this.bricks = this.createBricks(val)
    }
  }
}
</script>
