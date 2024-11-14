<script setup lang="ts">
import { useGameStore } from "~/stores/games.store";
import { type Game } from "~/types/game.type";
const game = ref<Game | undefined>(undefined);

onMounted(() => {
  let gameId = useRoute().params.id;
  if (Array.isArray(gameId)) gameId = gameId[0];
  game.value = useGameStore().getGameById(gameId);
});
</script>

<template>
  <div class="flex flex-col" v-if="game">
    <h2 class="text-3xl font-bold">
      {{ game.home.name }} vs {{ game.away.name }}
    </h2>
  </div>
</template>

<style scoped></style>
