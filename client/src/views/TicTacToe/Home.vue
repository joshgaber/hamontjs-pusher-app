<template>
  <div class="h-screen w-screen">
    <div
      v-show="!gameId"
      class="h-full w-full flex content-center justify-center"
    >
      <div class="container m-auto px-4 flex flex-col">
        <label for="input-name" class="block text-3xl mb-4">Name</label>
        <input
          id="input-name"
          type="text"
          class="block w-full border-b mb-8 text-2xl text-center text-purple-600 placeholder-purple-300"
          v-model="name"
          placeholder="Eg., Ethan Hawke"
        />
        <label for="input-game" class="block text-3xl mb-4">Game ID</label>
        <input
          id="input-game"
          type="text"
          class="block w-full border-b mb-16 text-2xl text-center text-purple-600 placeholder-purple-300"
          v-model="game"
          placeholder="To join another game"
        />
        <button
          :disabled="joinDisabled"
          class="block w-full text-2xl text-white py-2 mb-2 rounded border border-purple-600"
          :class="{
            'bg-purple-300 hover:bg-purple-300 pointer-events-none cursor-not-allowed': joinDisabled,
            'bg-purple-500 hover:bg-purple-700': !joinDisabled,
          }"
          @click="joinGame(game)"
        >
          Join Game
        </button>
        <button
          :disabled="newGameDisabled"
          class="block w-full text-2xl text-white py-2 rounded border border-purple-600"
          :class="{
            'bg-purple-300 hover:bg-purple-300 pointer-events-none cursor-not-allowed': newGameDisabled,
            'bg-purple-500 hover:bg-purple-700': !newGameDisabled,
          }"
          @click="joinGame()"
        >
          Start a New Game
        </button>
      </div>
    </div>
    <div
      v-show="gameId"
      class="h-full w-full bg-yellow-400 flex content-center justify-center"
    >
      <div class="container mx-auto flex flex-col justify-center">
        <h2 style="font-size: 8rem"><i class="fa fa-hourglass-half"></i></h2>
        <div class="text-4xl">Okay, your guess has been logged.</div>
        <div class="text-4xl"><strong>Do not</strong> leave this page!</div>
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
      name: '',
      game: '',
      gameId: null,
      X: null,
      O: null,
      grid: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      marker: null,
      turn: null,
      observers: [],
    };
  },
  methods: {
    async joinGame(game = null) {
      const response = await axios.post(
        process.env.VUE_APP_API + '/api/tictactoe/join',
        {
          name: this.name,
          game,
        },
      );

      Object.keys(response.data).forEach(i => (this[i] = response.data[i]));

      // this.gameId = response.gameId;
      // this.X = response.X;
      // this.O = response.O;
      // this.marker = response.marker;
      // this.grid = response.grid;
      // this.turn = response.turn;
      // this.observers = response.observers;

      this.pusher
        .subscribe('hamontjs')
        .bind('tictactoe-' + this.gameId, this.updateGame);
    },

    updateGame(data) {
      this.results = data;
      this.stage = 'results';
    },
  },
  computed: {
    joinDisabled() {
      return this.name === '' || !this.game.match(/[A-Za-z]{4}/);
    },
    newGameDisabled() {
      return this.name === '';
    },
    winner() {
      if (
        this.grid[0][0] &&
        ((this.grid[0][0] === this.grid[0][1] &&
          this.grid[0][0] === this.grid[0][2]) ||
          (this.grid[0][0] === this.grid[1][1] &&
            this.grid[0][0] === this.grid[2][2]) ||
          (this.grid[0][0] === this.grid[1][0] &&
            this.grid[0][0] === this.grid[2][0]))
      ) {
        return this.grid[0][0];
      }

      if (
        this.grid[0][1] &&
        this.grid[0][1] === this.grid[1][1] &&
        this.grid[0][1] === this.grid[2][1]
      ) {
        return this.grid[0][1];
      }

      if (
        this.grid[0][2] &&
        ((this.grid[0][2] === this.grid[1][1] &&
          this.grid[0][2] === this.grid[2][0]) ||
          (this.grid[0][2] === this.grid[1][2] &&
            this.grid[0][2] === this.grid[2][2]))
      ) {
        return this.grid[0][2];
      }

      if (
        this.grid[1][0] &&
        this.grid[1][0] === this.grid[1][1] &&
        this.grid[1][0] === this.grid[1][2]
      ) {
        return this.grid[1][0];
      }

      if (
        this.grid[2][0] &&
        this.grid[2][0] === this.grid[2][1] &&
        this.grid[2][0] === this.grid[2][2]
      ) {
        return this.grid[2][0];
      }

      return null;
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
