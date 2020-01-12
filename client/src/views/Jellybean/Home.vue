<template>
  <div class="h-screen w-screen">
    <div
      v-show="stage === 'form'"
      class="h-full w-full flex content-center justify-center"
    >
      <div class="container m-auto px-4 flex flex-col">
        <label for="input-name" class="block text-3xl mb-4"
          >What's your name?</label
        >
        <input
          id="input-name"
          type="text"
          class="block w-full border-b mb-8 text-2xl text-center text-purple-600 placeholder-purple-300"
          v-model="name"
          placeholder="Eg., Ethan Hawke"
        />
        <label for="input-guess" class="block text-3xl mb-4"
          >How many jelly beans?</label
        >
        <input
          id="input-guess"
          type="text"
          class="block w-full border-b mb-16 text-2xl text-center text-purple-600 placeholder-purple-300"
          v-model="guess"
          placeholder="Eg., 36"
        />
        <button
          :disabled="submitDisabled"
          class="block w-full text-2xl text-white py-2 rounded border border-purple-600"
          :class="{
            'bg-purple-300 hover:bg-purple-300 pointer-events-none cursor-not-allowed': submitDisabled,
            'bg-purple-500 hover:bg-purple-700': !submitDisabled,
          }"
          @click="submitGuess"
        >
          Submit
        </button>
      </div>
    </div>
    <div
      v-show="stage === 'waiting'"
      class="h-full w-full bg-yellow-400 flex content-center justify-center"
    >
      <div class="container mx-auto flex flex-col justify-center">
        <h2 style="font-size: 8rem"><i class="fa fa-hourglass-half"></i></h2>
        <div class="text-4xl">Okay, your guess has been logged.</div>
        <div class="text-4xl"><strong>Do not</strong> leave this page!</div>
      </div>
    </div>
    <div
      v-show="stage === 'results' && won"
      class="h-full w-full bg-green-400 text-white flex content-center justify-center"
    >
      <div class="container mx-auto flex flex-col justify-center">
        <h2 style="font-size: 8rem"><i class="fa fa-star"></i></h2>
        <div class="text-4xl font-bold uppercase">You win!</div>
        <div class="text-4xl">Come on up and claim your prize!</div>
      </div>
    </div>
    <div
      v-show="stage === 'results' && !won"
      class="h-full w-full bg-red-400 text-white flex content-center justify-center"
    >
      <div class="container mx-auto flex flex-col justify-center">
        <h2 style="font-size: 8rem"><i class="fa fa-sad-cry"></i></h2>
        <div class="text-4xl font-bold uppercase">Sorry, you did not win.</div>
        <div class="text-4xl">Better luck next time!</div>
      </div>
    </div>
  </div>
</template>

<script>
import Pusher from 'pusher-js';
import axios from 'axios';

export default {
  name: 'home',
  data() {
    return {
      pusher: null,
      stage: 'form', // 'form', 'waiting', 'results'
      name: '',
      guess: '',
      results: {},
    };
  },
  methods: {
    async submitGuess() {
      await axios.post(process.env.VUE_APP_API + '/api/jellybean/guess', {
        name: this.name,
        guess: this.guess,
      });
      this.stage = 'waiting';
      this.pusher
        .subscribe('hamontjs')
        .bind('jellybean-winner', this.receiveAnswer);
    },

    receiveAnswer(data) {
      this.results = data;
      this.stage = 'results';
    },
  },
  computed: {
    submitDisabled() {
      return this.name === '' || this.guess === '';
    },
    won() {
      return this.results.name && this.results.name === this.name;
    },
  },
  mounted() {
    this.pusher = new Pusher('3d63639268dbf6809285', {
      cluster: 'us2',
      forceTLS: true,
    });
  },
};
</script>
