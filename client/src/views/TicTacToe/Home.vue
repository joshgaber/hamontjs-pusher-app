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
      class="h-full w-full flex content-center justify-center"
    >
      <div class="container mx-auto flex flex-col justify-around">
        <h2 class="text-2xl">
          <span v-if="O === null">Waiting for player...</span>
          <span v-else-if="winner">{{ winner }} is the winner!</span>
          <span v-else-if="boardFull">It's a stalemate</span>
          <span v-else-if="myTurn">It's your turn</span>
          <span v-else>Waiting for {{ whoseTurn }} to play</span>
        </h2>
        <div class="flex justify-around">
          <div class="lg:w-1/2 flex content-center justify-center">
            <div class="flex flex-col">
              <div
                v-for="(h, hindex) in grid"
                :key="hindex"
                class="flex"
                :class="{ 'border-t-2': hindex }"
              >
                <div
                  v-for="(v, vindex) in h"
                  :key="vindex"
                  v-text="v"
                  class="h-20 w-20 p-2 leading-none text-6xl select-none"
                  :class="{
                    'border-l-2': vindex,
                    'cursor-pointer hover:bg-gray-100':
                      grid[hindex][vindex] === null && marker,
                  }"
                  @click="placeToken(hindex, vindex)"
                ></div>
              </div>
            </div>
          </div>
          <div class="hidden lg:block lg:w-1/2">
            <div v-if="X"><strong>X:</strong> {{ X }}</div>
            <div v-if="O"><strong>O:</strong> {{ O }}</div>
            <div v-if="observers.length">
              <strong>Observers:</strong> {{ observers.join(', ') }}
            </div>
          </div>
        </div>
        <div class="text-lg lg:text-2xl">
          Log in at {{ gameURL }} - Game ID: {{ gameId }}
        </div>
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

      this.pusher
        .subscribe('hamontjs')
        .bind('tictactoe-' + this.gameId, this.updateGame);
    },

    updateGame(data) {
      Object.keys(data).forEach(i => (this[i] = data[i]));
    },

    placeToken(h, v) {
      if (
        this.winner ||
        this.boardFull ||
        !this.myTurn ||
        this.grid[h][v] !== null
      )
        return;

      axios.post(
        process.env.VUE_APP_API + '/api/tictactoe/' + this.gameId + '/place',
        {
          h,
          v,
          marker: this.marker,
        },
      );
    },
  },
  computed: {
    joinDisabled() {
      return this.name === '' || !this.game.match(/[A-Za-z]{4}/);
    },
    newGameDisabled() {
      return this.name === '';
    },
    gameURL() {
      return process.env.VUE_APP_HOST + '/tictactoe';
    },
    myTurn() {
      return this.marker === this.turn;
    },
    whoseTurn() {
      return this[this.turn];
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
    boardFull() {
      return this.grid.reduce(
        (hfull, h) =>
          !hfull
            ? hfull
            : h.reduce((vfull, v) => (!vfull ? vfull : v !== null), true),
        true,
      );
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
