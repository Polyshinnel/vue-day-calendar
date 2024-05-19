import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import DraggableResizableVue from 'draggable-resizable-vue3'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(DraggableResizableVue)

app.mount('#app')
