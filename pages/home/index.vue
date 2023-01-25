<template>
  <div>
    <h1>Hey </h1>
  </div>
  <button @click="logout">
    Log Out
  </button>
</template>

<script setup lang="ts">
import { useLoginStore } from '~~/store/loginStore';

const loginStore = useLoginStore();

const logout = () => {
  loginStore.onLogOut();
}

</script>