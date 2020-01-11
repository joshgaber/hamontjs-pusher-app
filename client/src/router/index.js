import Vue from 'vue';
import VueRouter from 'vue-router';
import JellybeanHome from '../views/Jellybean/Home.vue';
import JellybeanDashboard from '../views/Jellybean/Dashboard.vue';

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
];

export default new VueRouter({
  mode: 'history',
  routes,
});
