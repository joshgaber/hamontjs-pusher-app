<template>
  <div class="h-screen w-screen px-8 flex flex-col justify-around">
    <h1 class="text-4xl">Jelly Bean Contest</h1>

    <div class="flex" style="max-height: 50vh">
      <img src="/jellybean-jar.jpg" class="h-full" />

      <div
        class="w-full flex flex-col justify-around content-center text-center"
        v-show="!winnerChosen"
      >
        <div class="text-xl">
          There
          <span v-if="guesses.length === 1">is {{ guesses.length }} guess</span>
          <span v-else>are {{ guesses.length }} guesses</span>
          so far.
        </div>
        <div class="text-center">
          <button
            type="button"
            class="text-base text-white p-1 rounded border border-purple-600 select-none bg-purple-500 hover:bg-purple-700"
            @click="findWinner()"
          >
            Find the winner
          </button>
        </div>
      </div>

      <div
        class="w-full flex flex-col justify-around text-center px-4"
        v-show="winnerChosen"
      >
        <div v-show="!showTable">
          A winner has been chosen! Check your phone to see if you won.
        </div>
        <div v-show="!showTable">
          <button
            type="button"
            class="text-base text-white p-1 rounded border border-purple-600 select-none bg-purple-500 hover:bg-purple-700"
            @click="showTable = true"
          >
            Show the results
          </button>
        </div>

        <div
          v-show="showTable"
          class="w-full max-h-full flex flex-col rounded border-2 border-purple-400"
        >
          <div
            class="flex justify-around bg-purple-200 border-b-2 border-purple-400"
          >
            <div class="py-2 font-bold">Name</div>
            <div class="py-2 font-bold">Guess</div>
          </div>
          <div class="flex flex-col text-left overflow-y-scroll max-h-full">
            <div
              v-for="guess in guesses"
              :key="guess.id"
              class="flex justify-around border-t border-purple-400"
            >
              <div class="py-2 px-4">{{ guess.name }}</div>
              <div class="py-2 px-4">{{ guess.guess }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-2xl">
      Wanna play? Go to
      <span class="text-purple-600 font-bold">{{ host }}</span>
    </div>
  </div>
</template>

<script>
import Pusher from 'pusher-js';
import axios from 'axios';

export default {
  data() {
    return {
      pusher: null,
      winnerChosen: false,
      host: process.env.VUE_APP_HOST + '/jellybean',
      jellybeans: parseInt(process.env.VUE_APP_JELLYBEANS),
      guesses: [],
      showTable: false,
    };
  },
  methods: {
    addGuess(data) {
      this.guesses.push({
        name: data.name,
        guess: parseInt(data.guess),
      });
    },
    findWinner() {
      this.winnerChosen = true;
      this.guesses.sort(this.guessSort);

      axios.post(
        process.env.VUE_APP_API + '/api/jellybean/results',
        this.guesses[0],
      );
    },
    guessSort(a, b) {
      return (
        Math.abs(a.guess - this.jellybeans) -
        Math.abs(b.guess - this.jellybeans)
      );
    },
  },
  mounted() {
    this.pusher = new Pusher('3d63639268dbf6809285', {
      cluster: 'us2',
      forceTLS: true,
    });

    this.pusher.subscribe('hamontjs').bind('jellybean-guess', this.addGuess);
  },
};
</script>
