import { defineNuxtPlugin } from '#app'
import { Notify } from 'quasar'

export default defineNuxtPlugin((nuxtApp) => {
    // Configureer de globale error handler
    nuxtApp.vueApp.config.errorHandler = async (error, instance, info) => {
        console.log(error)
        console.log(error.data.message)
        Notify.create({
            type: 'negative',
            message: error.data.message || 'Er is een fout opgetreden',
            position: 'top',

        })
    }
})
