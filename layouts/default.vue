<template>
  <el-container>
    <el-header>
      <app-header>
        <div slot="controls">
          <div class="button" @click="createChanel"> Create chanel </div>
        </div>
      </app-header>
    </el-header>
    <el-main>
      <nuxt class="main"/>
    </el-main>
    <el-footer>
      <app-footer/>
    </el-footer>
  </el-container>
</template>

<script>
import AppHeader from '~/components/Header.vue'
import AppFooter from '~/components/Footer.vue'

export default {
  components: {
    AppHeader,
    AppFooter
  },
  methods: {
    async createChanel() {
      const { chanelToken } = await this.$http.post('chanels')
      this.$router.push(`/chanel/${chanelToken}`)
    }
  }
}
</script>

<style scoped>
.el-container.is-vertical {
  height: 100%;
}
.el-header, .el-main, .el-footer {
  padding: 0;
}
</style>
