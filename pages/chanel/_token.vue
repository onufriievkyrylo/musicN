<template>
  <section class="container">
    <div class="content">
      <player :cid="cid"></player>
    </div>
    <el-dialog title="Share" :visible="dialogs.share">
      <span>This application can make some noise!</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogs.share = false">Cancel</el-button>
        <el-button type="primary" @click="copy">Copy</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import Player from '~/components/Player/Player.vue'
import { Notification } from 'element-ui'
import * as Axios from '~/plugins/axios'

export default {
  layout: 'chanel',
  components: {
    Player
  },
  data() {
    return {
      dialogs: { share: false }
    }
  },
  async asyncData({ params, redirect }) {
    try {
      const { token } = params
      const { cid } = await Axios.get('chanel', {
        params: { token }
      })
      console.log('cid', cid)
      return { cid }
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
  methods: {
    copy() {

    }
  }
}
</script>

<style scoped>
.title {
  margin: 50px 0;
}
</style>
