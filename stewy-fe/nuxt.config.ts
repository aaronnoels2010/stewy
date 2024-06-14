// https://nuxt.com/docs/api/configuration/nuxt-config
import {io} from "socket.io-client";

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["nuxt-quasar-ui","@pinia/nuxt","nuxt-socket-io","@sidebase/nuxt-pdf"],
  plugins: [
    '~/plugins/error-handler.js'
  ],
  nitro: {
    experimental: {
      websocket: true
    }
  },
  io: {
    sockets: [{
      name: 'main',
      url: 'http://192.168.0.24:8085',
      default: true
    }]
  },
  quasar:{
    plugins:['Notify']
  }

})
