<template>
  <section class="container">
    <div class="content">
      <player :token="token" :chanel="chanel"></player>
    </div>
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
  async asyncData({ params, redirect }) {
    try {
      const { token } = params
      const chanel = await Axios.get('chanel', {
        params: { token }
      })
      console.log('page', chanel)
      return { token, chanel }
    } catch (err) {
      const { statusText, data } = err
      Notification.error({
        title: statusText,
        message: data,
        position: 'bottom-right'
      })
      redirect('/')
    }
  }
}
</script>

<style scoped>
.title {
  margin: 50px 0;
}
</style>
