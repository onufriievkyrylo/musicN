<template>
  <section class="container">
    <div class="content">
      <h1 class="title">
        Chanel
      </h1>
      <player :token="token"></player>
      <el-upload
        class="upload-demo"
        drag
        action="/api/uploads/"
        :http-request="upload"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
        <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div>
      </el-upload>
    </div>
    {{ state }}
  </section>
</template>

<script>
import Player from '~/components/Player/Player.vue'
import { Notification } from 'element-ui'
import * as Axios from '~/plugins/axios'

export default {
  components: {
    Player
  },
  data() {
    return {
      audio: new Audio()
    }
  },
  async asyncData({ params, redirect }) {
    try {
      const { token } = params
      const state = await Axios.get('chanel', {
        params: { token }
      })
      return { token, state }
    } catch (err) {
      const { statusText, data } = err
      Notification.error({
        title: statusText,
        message: data,
        position: 'bottom-right'
      })
      redirect('/')
    }
  },
  created() {
    console.log('created')
    this.$socket.on('update playlist', playlist => {
      console.log(playlist)
      this.state.playlist = playlist
    })
    this.$socket.on('play', play => {
      console.log(this.state.playlist[0].url)
      this.audio.src = '/' + this.state.playlist[0].url
      this.play()
    })
  },
  methods: {
    play() {
      this.audio.play()
    },
    async upload({ file }) {
      let data = new FormData()
      data.append('file', file)
      let url = await this.$http.post('uploads', data)
      await this.$http.put('chanel-playlist', {
        params: { token: this.token },
        playlist: [url]
      })
    }
  }
}
</script>

<style scoped>
.title {
  margin: 50px 0;
}
</style>
