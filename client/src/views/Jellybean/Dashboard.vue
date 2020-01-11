<template>
  <div class="h-screen w-screen flex flex-col justify-around">
    <h1>Jellybean Contest</h1>
    <div class="flex"></div>
    <div>
      Wanna play? Go to <span>{{ host }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      host: process.env.VUE_APP_HOST + '/jellybean',
      jellybeans: parseInt(process.env.VUE_APP_JELLYBEANS),
      guesses: [],
    };
  },
};
</script>
