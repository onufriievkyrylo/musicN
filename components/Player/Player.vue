<template>
  <div class="player">
    <div class="controls">
      <!-- <el-button class="volume" round type="primary">
        <i class="fa fa-volume-up" aria-hidden="true"></i>
      </el-button> -->
      <el-button class="play" round type="primary" @click="play">
        <i class="fa fa-play" aria-hidden="true"></i>
      </el-button>
      <!-- <el-button class="stop" round type="primary">
        <i class="fa fa-stop" aria-hidden="true"></i>
      </el-button> -->
    </div>
    <div class="progress">
      <div class="current-time"> {{ currentTime }} </div>
      <el-slider class="slider"  v-model="percentage" :show-tooltip="false" @change="change"></el-slider>
      <div class="duration"> {{ duration }} </div>
    </div>
    <el-upload class="upload" action="upload" :http-request="upload" drag multiple>
      <i class="el-icon-upload"></i>
    </el-upload>
    {{ chanel }}
  </div>
</template>

<script>
import moment from 'moment'
import mdf from 'moment-duration-format'

mdf(moment)

export default {
  props: ['token', 'chanel'],
  data() {
    return {
      audio: document.createElement('audio'),
      dur: 0,
      cur: 0,
      percentage: 0
    }
  },
  computed: {
    duration() {
      return moment.duration(this.dur || 0, 'seconds').format('mm:ss', { trim: false })
    },
    currentTime() {
      this.percentage = (this.cur / this.dur) * 100
      return moment.duration(this.cur, 'seconds').format('mm:ss', { trim: false })
    }
  },
  created() {
    console.log('created', this.audio)
    this.audio.addEventListener('durationchange', () => {
      this.dur = this.audio.duration
    })
    this.audio.addEventListener('timeupdate', () => {
      console.log('timeupdate', this.audio.currentTime)
      this.cur = this.audio.currentTime
    })
    this.$socket.on('update playlist', playlist => {
      this.chanel.playlist = playlist
    })
    this.$socket.on('play', play => {
      this.audio.src = '/' + this.chanel.playlist[0].url
      this.audio.play()
    })
  },
  methods: {
    change(percentage) {
      this.audio.currentTime = this.audio.duration * percentage / 100
    },
    async upload({ file }) {
      let data = new FormData()
      data.append('file', file)
      let url = await this.$http.post('uploads', data)
      await this.$http.put('chanel-playlist', {
        params: { token: this.token },
        playlist: [url]
      })
    },
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
.controls {
  display: flex;
  align-items: center;
  justify-content: center;
}
.play, .stop, .volume {
  margin: 0 20px;
  padding: 0px;
  border-radius: 50%;
}
.play {
  width: 150px;
  height: 150px;
  font-size: 70px;
}
.stop, .volume {
  width: 70px;
  height: 70px;
  font-size: 30px;
}
.progress {
  display: flex;
  align-items: center;
}
.slider {
  flex-grow: 1;
  margin: 0 15px;
}
.duration, .current-time {
  font-size: 14px;
  color: gray;
}
.fa-play {
  margin-left: 15px;
}
</style>
