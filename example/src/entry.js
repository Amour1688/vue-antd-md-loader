import Vue from 'vue'
import { Button } from 'ant-design-vue';
import App from './app.vue'
import DemoBox from './demoBox.vue';

Vue.component(DemoBox.name, DemoBox);
Vue.use(Button);

new Vue({
  el: '#app',
  render: h => h(App)
})
