<template>
  <div class="q-pa-md">
  <q-btn @click="sendMessageToUser">Test</q-btn>
  </div>
</template>

<script>

export default {
  data(){
    return {
      socket: null
    }
  },
  mounted(){
    try{
        this.socket = this.$nuxtSocket({
          name: 'main',
          default: true,
        })
    }catch(error){
      console.log(error)
    }

    console.log(this.socket)

    this.socket.on("/topic/messages", _ => {
        console.log("lezen van de message")
    })

    this.socket.on("connect",(err) => {
      console.log("connected ...")
    })

    this.socket.open()

    // this.socket.on("connect_error",(err) => {
    //   console.log(err)
    // })

  },
  methods: {
    sendMessageToUser(){
      console.log('send message ...');
      const message = { content: 'Hello, server!', sender: 'nuxt-client' };
      this.socket.emit('send_message', message);
      console.log('end method sending message');
    }
  }
}
</script>

<style scoped>
.q-pa-md {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
