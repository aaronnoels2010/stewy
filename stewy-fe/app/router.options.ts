import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig> {
    // https://router.vuejs.org/api/interfaces/routeroptions.html#routes
    routes: (_routes) => [
        {
            path: '/',
            component: () => import('~/pages/volunteers/index.vue'),
            alias: "/volunteers"
        },
        {
            path: '/volunteers/:id',
            component: () => import('~/pages/volunteers/[slug].vue'),
        },
        {
            name: 'settings',
            path: '/settings',
            component: () => import('~/pages/settings/index.vue')
        },
        {
            name: 'games',
            path: '/games',
            component: () => import('~/pages/games/index.vue')
        },
        {
            path: '/games/:id',
            component: () => import('~/pages/games/[id].vue'),
            name: 'game'
        },
        {
            path: '/dashboard',
            component: () => import('~/pages/dashboard/index.vue'),
            name: 'dashboard'
        },
        {
            name: 'clubs',
            path: '/clubs',
            component: () => import('~/pages/clubs/index.vue'),
        },
        {
            name: 'club',
            path: '/clubs/:slug',
            component: () => import('~/pages/clubs/[slug].vue'),
        },
        {
            name: 'chat',
            path: '/chat',
            component: () => import('~/pages/chat/index.vue'),
        }
    ],

}
