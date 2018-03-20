<template>
  <header>
    <div class="content">
      <div class="logo">
        <nuxt-link to="/">
          <img src="../assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
        </nuxt-link>
      </div>
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
    background-color: #3b8070;
    justify-content: center;
    font-size: 17px;
    color: whitesmoke;
  }
  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .button, .button:visited {
    display: flex;
    align-items: center;
    border: 2px solid #41b883;
    line-height: 15px;
    text-transform: uppercase;
    text-decoration: none;
    padding: 15px 25px;
    transition: all ease-in-out .3s;
  }
  .button:hover, .button:focus {
    cursor: pointer;
    background-color: #41b883;
  }
  .logo {
    height: 100%;
    margin: 0 10px;
  }
</style>
