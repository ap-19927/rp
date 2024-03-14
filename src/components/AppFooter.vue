<script setup lang="ts">
const { signOut } = useAuth();
const signout = ref(async () => await signOut());
</script>

<template>
<div>
  <button @click="signout">
    <slot>Log Out</slot>
  </button>
</div>
</template>
