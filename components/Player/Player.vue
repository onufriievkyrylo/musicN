<template>
  <div class="player">
    <div class="preview" :style="{ 'background-image': currentTrack && currentTrack.image && `url(${currentTrack.image})` }">
      <div class="info">
        <div class="meta main" v-if="currentTrack">
          <span class="title"> {{ currentTrack.title || currentTrack.filename }} </span>
          <span class="artist" v-if="currentTrack.artist"> - {{ currentTrack.artist }} </span>
        </div>
        <div class="meta album" v-if="currentTrack"> {{ currentTrack.album }} </div>
      </div>
      <div class="controls">
        <div class="button play" :class="{ disabled: !currentTrack }" @click="play">
          <i :class="['fa', isPlaying ? 'fa-pause' : 'fa-play']" aria-hidden="true"></i>
        </div>
        <div class="current-time"> {{ formatedCurrentTime }} </div>
        <el-slider class="slider" v-model="percentage" :show-tooltip="false" @change="changeTime"></el-slider>
        <div class="duration"> {{ formatedDuration }} </div>
      </div>
    </div>
    <el-upload class="upload" action="upload" :http-request="upload" drag :show-file-list="false">
      <i class="el-icon-upload"></i>
    </el-upload>
    <div class="playlist">
      <div class="track" v-for="(track, index) in playlist" :key="index" @click="changeTrack(index)">
        <div> {{index + 1}} </div>
        <img class="picture" v-if="track.image" :src="track.image">
        <img class="picture" v-else src="~/assets/img/album-placeholder.png">
        <div class="meta">
          <span class="title"> {{ track.title || track.filename }} </span>
          <span class="artist" v-if="track.artist"> - {{ track.artist }} </span>
        </div>
      </div>
    </div>
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
      audio: new Audio(),
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
    },
    currentTrack() {
      return this.playlist[this.onPlay]
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
    this.$socket.on('push playlist', ({ track }) => this.push(track))
    this.$socket.on('play', ({ isPlaying, onPlay, currentTime, timestamp }) => {
      if (isPlaying) {
        this.audio.src = this.playlist[onPlay].url
        this.audio.currentTime = currentTime + (Date.now() - timestamp) / 1000
        this.audio.play()
      } else {
        this.audio.pause()
        this.audio.src = this.playlist[onPlay].url
        this.audio.currentTime = currentTime
      }
      this.isPlaying = isPlaying
    })
  },
  methods: {
    changeTrack(index) {
      this.onPlay = index
      this.audio.src = this.playlist[this.onPlay].url
      if (this.isPlaying) {
        this.audio.play()
      }
    },
    sync() {
      this.$socket.emit('play', {
        cid: this.cid,
        playlist: this.playlist,
        isPlaying: this.isPlaying,
        onPlay: this.onPlay,
        currentTime: this.currentTime
      })
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
    },
    changeTime(percentage) {
      this.audio.currentTime = this.audio.duration * percentage / 100
      // this.$socket emit broadcast CHANGE TIME
    },
    async upload({ file }) {
      const data = new FormData()
      data.append('file', file)
      const track = await this.$http.post('uploads', data)
      track.image = track.image ? this.btoa(track.image) : undefined
      this.push(track)
      this.$socket.emit('push playlist', {
        cid: this.cid,
        track
      })
    },

    // util methods
    btoa({ mime, imageBuffer }) {
      const buffer = new Uint8Array(imageBuffer.data)
      const blob = new Blob([buffer], { type: `image/${mime}` })
      const URL = window.URL || window.webkitURL
      const src = URL.createObjectURL(blob)
      return src
    },
    formatDate(date) {
      return moment(date).format('YYYY')
    },
    push(track) {
      this.playlist.push(track)
      if (this.onPlay === -1) {
        this.onPlay = 0
        this.audio.src = this.playlist[this.onPlay].url
      }
    }
  }
}
</script>


<style scoped>
.preview {
  display: flex;
  flex-direction: column;
  height: 500px;
  max-height: 100vh;
  background-image: url(~/assets/img/album-placeholder.png);
  background-color: rgba(0, 0, 0, 0.4);
  background-blend-mode: overlay;
  background-size: cover;
  background-position: center;
}
.preview > .info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: whitesmoke;
  font-size: 25px;
  text-shadow: 0px 0px 8px black;
}
.preview > .info > .meta {
  margin: 10px 0;
  text-align: center
}
.preview > .info > .meta.main {
  font-size: 40px;
}
.track {
  display: flex;
  align-items: center;
  height: 50px;
  margin: 5px 0;
}
.track > * {
  margin-right: 10px
}
.track > .picture {
  height: 100%;
}
.track > .meta {
  font-weight: bold;
}
.controls {
  display: flex;
  align-items: center;
  background: linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.6));
  padding: 5px 10px;
}
.controls > div {
  margin: 0 10px;
}
.slider {
  flex-grow: 1;
  margin: 0 15px;
}
.duration, .current-time {
  font-size: 14px;
  color: whitesmoke;
}
.button {
  padding: 10px;
  cursor: pointer;
}
.button.disabled {
  color: gray;
  pointer-events: none;
}
.play {
  font-size: 25px;
  color: whitesmoke;
}
</style>
