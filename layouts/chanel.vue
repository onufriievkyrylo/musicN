<template>
  <el-container>
    <el-header>
      <app-header>
        <div slot="controls">
          <div class="button" @click="share">
            <i class="fa fa-share-alt"></i>
            <div>Share</div>
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
    async share() {
      this.$emit('share')
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
