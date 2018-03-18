<template>
  <section class="container">
    <div class="content">
      <h1 class="title">
        Media sharing platform
      </h1>
      <h3>
        Chanel list:
      </h3>
      <p v-for="chanel in chanels" :key="chanel.id">
        {{ chanel.id }} ({{chanel.population}})
      </p>
    </div>
  </section>
</template>

<script>

export default {

  data() {
    return {
      chanels: []
    }
  },
  beforeCreated() {
    this.$socket.on('new chanel', chanel => {
      this.chanels.push(chanel)
    })
  }
}
</script>

<style scoped>
.title {
  text-transform: capitalize;
  margin: 50px 0;
}
</style>
