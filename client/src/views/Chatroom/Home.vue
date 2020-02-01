<template>
  <div class="h-screen v-screen">
    <div
      v-show="!loggedIn"
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
        <button
          :disabled="joinDisabled"
          class="block w-full text-2xl text-white py-2 mb-2 rounded border border-purple-600"
          :class="{
            'bg-purple-300 hover:bg-purple-300 pointer-events-none cursor-not-allowed': joinDisabled,
            'bg-purple-500 hover:bg-purple-700': !joinDisabled,
          }"
          @click="joinChat"
        >
          Join Chat
        </button>
      </div>
    </div>
    <div v-show="loggedIn" class="h-full container m-auto py-4 flex flex-col">
      <div class="flex flex-initial border border-purple-600 rounded">
        <textarea
          v-model="message"
          class="flex-auto h-16 resize-none rounded-l"
          @keydown.enter.exact.prevent
          @keyup.enter.exact="sendMessage"
        ></textarea>
        <button
          class="block h-16 flex-initial text-2xl text-white p-2 rounded-r"
          :class="{
            'bg-purple-300 hover:bg-purple-300 pointer-events-none cursor-not-allowed': messageDisabled,
            'bg-purple-500 hover:bg-purple-700': !messageDisabled,
          }"
          :disabled="messageDisabled"
          @click="sendMessage"
        >
          Send
        </button>
      </div>
      <div class="flex-auto py-2">
        <div
          class="bg-gray-200 text-left p-4 shadow-inner h-full border border-gray-500 rounded overflow-y-scroll overflow-x-hidden"
        >
          <div v-for="(message, index) in messages" :key="index">
            <span class="text-sm italic select-none mr-2"
              >({{ message.timestamp | dateFormat }})</span
            ><strong v-text="message.user"></strong>:
            <span v-text="message.message"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pusher from 'pusher-js';
import axios from 'axios';

export default {
  data() {
    return {
      channel: null,
      name: '',
      loggedIn: false,
      messages: [],
      message: '',
    };
  },
  computed: {
    joinDisabled() {
      return this.name.length === 0;
    },
    messageDisabled() {
      return this.message.length === 0;
    },
  },
  methods: {
    async joinChat() {
      const pusher = new Pusher('3d63639268dbf6809285', {
        cluster: 'us2',
        forceTLS: true,
        authEndpoint: process.env.VUE_APP_API + '/api/chatroom/auth',
        auth: {
          params: {
            name: this.name,
          },
        },
      });

      this.channel = pusher.subscribe('presence-hamontjs-chatroom');
      this.messages = (
        await axios.get(process.env.VUE_APP_API + '/api/chatroom/messages')
      ).data;

      this.channel.bind('new-message', message => this.messages.push(message));

      this.loggedIn = true;
    },
    async sendMessage() {
      if (this.message.length) {
        await axios.post(process.env.VUE_APP_API + '/api/chatroom/message', {
          user: this.name,
          message: this.message.trim(),
        });
        this.message = '';
      }
    },
  },
  filters: {
    dateFormat(date) {
      return new Date(date).toLocaleString();
    },
  },
};
</script>
