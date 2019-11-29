<template>
  <div class="home">
    <div v-show="stage === 'form'">
      <div class="container">
        <h2>Take a guess</h2>
        <div class="control">
          <input type="text" class="input" v-model="name" />
        </div>
      </div>
    </div>
    <div v-show="stage === 'waiting'" class="hero is-warning is-fullheight">
      <div class="hero-body">
        <div class="container">
          <h2><i class="fa fa-hourglass-half"></i></h2>
          <h3>Okay, your guess has been logged</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  // components: {
  //   HelloWorld
  // },
  data() {
    return {
      stage: 'form', // 'form', 'waiting', 'results'
      id: Math.floor(Math.random()*1000000),
      name: '',
      guess: ''
    }
  }
}
</script>
