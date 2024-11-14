<script setup lang="ts">
import { useGameStore } from "~/stores/games.store";

const { games } = useGameStore();
const open = ref(false);

const goToGameDetails = (id: string) => {
  const router = useRouter();
  router.push(`/games/${id}`);
};
</script>

<template>
  <div>
    <div class="flex">
      <div v-for="game in games" class="card bg-base-100 w-96 shadow-xl">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
          />
        </figure>
        <div class="card-body">
          <h2 class="card-title">
            {{ game.home.name }} vs {{ game.away.name }}
          </h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary" @click="goToGameDetails(game.id)">
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.element:hover {
  background: rgba(0, 0, 0, 0.03);
}
</style>
