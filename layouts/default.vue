<template>
  <el-container>
    <el-header>
      <app-header>
        <div slot="controls">
          <div class="button" @click="createChanel">
            <i class="fa fa-plus"></i>
            <div>Create chanel</div>
          </div>
        </div>
      </app-header>
    </el-header>
    <el-main>
      <nuxt class="main"/>
    </el-main>
  </el-container>
</template>

<script>
import AppHeader from '~/components/Header.vue'

export default {
  components: {
    AppHeader
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
