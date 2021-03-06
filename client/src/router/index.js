import Vue from 'vue';
import VueRouter from 'vue-router';
import JellybeanHome from '../views/Jellybean/Home.vue';
import JellybeanDashboard from '../views/Jellybean/Dashboard.vue';
import TicTacToe from '../views/TicTacToe/Home.vue';
import Chatroom from '../views/Chatroom/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/jellybean',
    name: 'jellybean-home',
    component: JellybeanHome,
  },
  {
    path: '/jellybean/dashboard',
    name: 'jellybean-dashboard',
    component: JellybeanDashboard,
  },
  {
    path: '/tictactoe',
    name: 'tictactoe',
    component: TicTacToe,
  },
  {
    path: '/chatroom',
    name: 'chatroom',
    component: Chatroom,
  },
];

export default new VueRouter({
  mode: 'history',
  routes,
});
