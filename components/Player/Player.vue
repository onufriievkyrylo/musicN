<template>
  <div class="player">
    <div class="preview" :style="{ 'background-image': target && target.albumImage && `url(${target.albumImage})` }">
      <div class="info">
        <div class="meta main" v-if="target">
          <span class="title"> {{ target.title || target.filename }} </span>
          <span class="artist" v-if="target.artist"> - {{ target.artist }} </span>
        </div>
        <div class="meta album" v-if="target && target.album"> {{ target.album }} </div>
      </div>
      <div class="controls">
        <div class="button play" :class="{ disabled: !target }" @click="play">
          <i :class="['fa', isPlaying ? 'fa-pause' : 'fa-play']" aria-hidden="true"></i>
        </div>
        <div class="current-time"> {{ formatedCurrentTime }} </div>
        <el-slider class="slider" v-model="percentage" :show-tooltip="false" @change="rewind"></el-slider>
        <div class="duration"> {{ formatedDuration }} </div>
      </div>
    </div>
    <el-upload class="upload" action="upload" :http-request="upload" drag :show-file-list="false">
      <i class="el-icon-upload"></i>
    </el-upload>
    <div class="playlist">
      <div v-for="(track, index) in playlist" :key="index" :class="['track', { playing: index === onPlay }]" @click="change(index)">
        <div class="info">
          <img class="picture" v-if="track.albumImage" :src="track.albumImage">
          <img class="picture" v-else src="~/assets/img/album-placeholder.png">
          <div class="index"> {{index + 1}} </div>
          <div class="meta">
            <span class="title"> {{ track.title || track.filename }} </span>
            <span class="artist" v-if="track.artist"> - {{ track.artist }} </span>
          </div>
        </div>
        <div class="timing" v-if="index === onPlay">
          {{ formatedCurrentTime }} / {{ formatedDuration }}
        </div>
      </div>
    </div>
    <el-dialog title="Info" :visible.sync="centerDialogVisible">
      <span>This application can make some noise!</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addEvents">Confirm</el-button>
      </span>
    </el-dialog>
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
      centerDialogVisible: true,
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
    target() {
      return this.playlist[this.onPlay]
    }
  },
  created() {
    this.audio.addEventListener('durationchange', () => {
      this.duration = this.audio.duration
    })
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime
    })
  },
  methods: {
    addEvents() {
      this.centerDialogVisible = false
      this.$socket.on('push playlist', ({ track }) => this.add(track))
      this.$socket.on('play', ({ isPlaying, onPlay, currentTime, timestamp }) => {
        if (isPlaying) {
          this.audio.src = this.target.url
          this.audio.currentTime = currentTime + (Date.now() - timestamp) / 1000
          this.audio.play()
        } else {
          this.audio.pause()
          this.audio.src = this.target.url
          this.audio.currentTime = currentTime
        }
        this.isPlaying = isPlaying
      })
    },
    async upload({ file }) {
      const data = new FormData()
      data.append('file', file)
      const track = await this.$http.post('uploads', data)
      this.add(track)
      this.$socket.emit('push playlist', {
        cid: this.cid,
        track
      })
    },
    add(track) {
      track.albumImage = track.image ? this.btoa(track.image) : undefined
      this.playlist.push(track)
      if (this.onPlay === -1) {
        this.onPlay = 0
        this.audio.src = this.target.url
      }
    },
    change(index) {
      this.onPlay = index
      this.audio.src = this.target.url
      if (this.isPlaying) {
        this.audio.play()
      }
    },
    rewind(percentage) {
      this.audio.currentTime = this.audio.duration * percentage / 100
      // this.$socket emit broadcast CHANGE TIME
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
    sync() {
      this.$socket.emit('play', {
        cid: this.cid,
        playlist: this.playlist,
        isPlaying: this.isPlaying,
        onPlay: this.onPlay,
        currentTime: this.currentTime
      })
    },
    // util methods
    btoa({ mime, imageBuffer }) {
      const buffer = new Uint8Array(imageBuffer.data)
      const blob = new Blob([buffer], { type: `image/${mime}` })
      const URL = window.URL || window.webkitURL
      const src = URL.createObjectURL(blob)
      return src
    }
  }
}
</script>

<style lang="sass" scoped>
$secondary-data-color: #999
.preview
  display: flex
  flex-direction: column
  height: 500px
  max-height: 100vh
  background:
    color: rgba(0, 0, 0, 0.4)
    image: url(~/assets/img/album-placeholder.png)
    position: center
    size: cover
    blend-mode: overlay
  > .info
    flex-grow: 1
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    color: whitesmoke
    font-size: 25px
    text-shadow: 0px 0px 8px black
    > .meta
      margin: 10px 0
      text-align: center
      &.main
        font-size: 40px

.track
  display: flex
  justify-content: space-between
  align-items: stretch
  width: 100%
  height: 60px
  padding: 5px 10px
  cursor: pointer
  transition: background .3s ease-in-out
  &:hover
    transition: background .3s ease-in-out
    background-color: #eee
  &.playing
    background-color: darken(#eee, 3%)
  > .timing
    @media only screen and (max-width: 450px)
      display: none
    display: flex
    align-items: center
    color: $secondary-data-color
    font-weight: 300
    white-space: nowrap
  > .info
    flex-grow: 1
    display: flex
    align-items: center
    min-width: 0
    > *
      margin-right: 15px
    > .index
      color: $secondary-data-color
      font:
        size: 20px
        weight: 300
    > .picture
      max-width: 50px;
      height: auto;
    > .meta
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      font-weight: bold

.controls
  display: flex
  align-items: center
  background-color: rgba(0, 0, 0, 0.15)
  padding: 5px 10px
  > div
    margin: 0 10px
  .play
    font-size: 25px
    color: whitesmoke
  .duration, .current-time
    font-size: 14px
    color: whitesmoke

.slider
  flex-grow: 1
  margin: 0 15px
.button
  padding: 10px
  cursor: pointer
  &.disabled
    color: gray
    pointer-events: none
.upload
  height: 60px
  overflow: hidden
</style>
