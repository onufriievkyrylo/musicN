<template>
  <div class="player">
    <div class="play" @click="play">
      <i class="fa fa-play"></i>
    </div>
    <el-slider v-model="time" :show-tooltip="false"></el-slider>
  </div>
</template>

<script>
export default {
  props: ['token'],
  data() {
    return {
      time: 0
    }
  },
  methods: {
    async play() {
      await this.$http.put('chanel-play', {
        params: { token: this.token },
        play: true
      })
    }
  }
}
</script>


<style scoped>
.player {
  display: flex;
  flex-direction: column;
  justify-content: center;
  items-align: center;
}
.play {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  background-color: #3b8070;
  border-radius: 50%;
  font-size: 80px;
  color: whitesmoke;
}
.fa-play {
  padding-left: 20px;
}
</style>
