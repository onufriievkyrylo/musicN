<template>
  <div class="player">
    <div class="controls">
      <!-- <el-button class="volume" round type="primary">
        <i class="fa fa-volume-up" aria-hidden="true"></i>
      </el-button> -->
      <el-button class="play" round type="primary" @click="play" :disabled="onPlay === -1">
        <i :class="['fa', isPlaying ? 'fa-pause' : 'fa-play']" aria-hidden="true"></i>
      </el-button>
      <!-- <el-button class="stop" round type="primary">
        <i class="fa fa-stop" aria-hidden="true"></i>
      </el-button> -->
    </div>
    <div class="progress">
      <div class="current-time"> {{ formatedCurrentTime }} </div>
      <el-slider class="slider" v-model="percentage" :show-tooltip="false" @change="changeTime"></el-slider>
      <div class="duration"> {{ formatedDuration }} </div>
    </div>
    <el-upload class="upload" action="upload" :http-request="upload" drag multiple>
      <i class="el-icon-upload"></i>
    </el-upload>
    <div class="playlist">
      <div class="track header">
        <div class="picture"></div>
        <div class="title">Title</div>
        <div class="singer">Singer</div>
        <div class="album">Album</div>
        <div class="year">Year</div>
        <div class="tags">Tags</div>
      </div>
      <div class="track" v-for="track, index in playlist" :key="index">
        <!-- {{ track.tags.raw.USLT.text }} -->
        <img class="picture" :src="btoa(track.tags.raw.APIC)" :alt="track.tags.raw.TALB">
        <div class="title">{{ track.tags.raw.TIT2 }}</div>
        <div class="singer">{{ track.tags.raw.TPE1 }}</div>
        <div class="album">{{ track.tags.raw.TALB }}</div>
        <div class="year">{{ formatDate(track.tags.raw.TYER) }}</div>
        <div class="tags">{{ track.tags.raw.TCON }}</div>
        <!-- {{ track.url }} -->
      </div>
    </div>
    <br><br><br>
    <!-- {{ playlist }} -->
  </div>
</template>

<script>
import moment from 'moment'
import mdf from 'moment-duration-format'

mdf(moment)

export default {
  props: ['cid'],
  data() {
    return {
      audio: document.createElement('audio'),
      duration: 0,
      currentTime: 0,
      playlist: [],
      isPlaying: false,
      onPlay: -1
    }
  },
  computed: {
    formatedDuration() {
      return moment.duration(this.duration || 0, 'seconds').format('mm:ss', { trim: false })
    },
    formatedCurrentTime() {
      return moment.duration(this.currentTime, 'seconds').format('mm:ss', { trim: false })
    },
    percentage: {
      get() {
        return this.currentTime / this.duration * 100
      },
      set(percentage) {
        this.currentTime = this.duration * percentage / 100
      }
    }
  },
  created() {
    console.log('created', this.audio)
    this.audio.addEventListener('durationchange', () => {
      this.duration = this.audio.duration
    })
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime
    })
    this.$socket.on('push playlist', ({ track }) => {
      this.playlist.push(track)
      if (this.onPlay === -1) {
        this.onPlay = 0
        this.audio.src = '/' + this.playlist[this.onPlay].url
      }
    })
    this.$socket.on('play', ({ isPlaying, onPlay, currentTime, timestamp }) => {
      if (isPlaying) {
        this.audio.src = '/' + this.playlist[onPlay].url
        this.audio.currentTime = currentTime + (Date.now() - timestamp) / 1000
        console.log(this.audio.currentTime)
        this.audio.play()
      } else {
        this.audio.pause()
        this.audio.src = '/' + this.playlist[onPlay].url
        this.audio.currentTime = currentTime
      }
      this.isPlaying = isPlaying
    })
  },
  methods: {
    formatDate(date) {
      return moment(date).format('YYYY')
    },
    btoa({ mime, imageBuffer }) {
      const buffer = new Uint8Array(imageBuffer.data)
      const blob = new Blob([buffer], { type: `image/${mime}` })
      const URL = window.URL || window.webkitURL
      const src = URL.createObjectURL(blob)
      return src
    },
    play() {
      if (this.isPlaying) {
        this.audio.pause()
      } else {
        this.audio.play()
      }
      this.isPlaying = !this.isPlaying
      this.$socket.emit('play', {
        cid: this.cid,
        isPlaying: this.isPlaying,
        onPlay: this.onPlay,
        currentTime: this.currentTime
      })
      // this.$socket emit broadcast PLAY
    },
    changeTime(percentage) {
      this.audio.currentTime = this.audio.duration * percentage / 100
      // this.$socket emit broadcast CHANGE TIME
    },
    async upload({ file }) {
      const data = new FormData()
      data.append('file', file)
      const track = await this.$http.post('uploads', data)
      this.playlist.push(track)
      if (this.onPlay === -1) {
        this.onPlay = 0
        this.audio.src = '/' + this.playlist[this.onPlay].url
      }
      this.$socket.emit('push playlist', {
        cid: this.cid,
        track
      })
    }
  }
}
</script>


<style scoped>
.track {
  display: flex;
  align-items: center;
  height: 50px;
  margin: 5px 0;
}
.track.header {
  font-weight: bold;
}
.track > * {
  margin-right: 10px
}
.track > .picture {
  height: 100%;
  width: 70px;
}
.track > .title, .track > .singer {
  width: 20%;
  font-weight: bold;
}
.track > .album {
  width: 15%;
}
.track > .year {
  width: 10%;
}
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
