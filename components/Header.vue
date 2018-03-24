<template>
  <header>
    <div class="content">
      <nuxt-link to="/" class="logo"></nuxt-link>
      <div class="controls">
        <slot name="controls">
        </slot>
      </div>
    </div>
  </header>
</template>

<style scoped>
  header {
    display: flex;
    height: 100%;
    width: 100%;
    background-color: #3b80704d;
    justify-content: center;
    color: whitesmoke;
  }
  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #3b8070;
  }
  .button, .button:visited {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #41b883;
    text-transform: uppercase;
    text-decoration: none;
    padding: 10px 20px;
    line-height: 15px;
    font-size: 15px;
    transition: all ease-in-out .3s;
  }
  .button:hover, .button:focus {
    cursor: pointer;
    background-color: #41b883;
  }
  .button i {
    font-size: 20px;
    margin-right: 10px;
  }
  .logo {
    background-image: url(~/assets/img/logo.png);
    background-size: cover;
    height: 100%;
    width: 65px;
  }
</style>
