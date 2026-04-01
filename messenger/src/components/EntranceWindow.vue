<script setup>
import AuthForm from "@/components/AuthForm.vue";
import RegForm from "@/components/RegForm.vue";
import {ref} from "vue";

const mode = ref("auth");
</script>

<template>
  <div class="container" >
  <AuthForm v-if="mode === 'auth'" v-model="mode" />
  <RegForm v-else v-model = 'mode'/>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: rgba(85, 97, 244, 0.4);
  margin: 0;
}
</style>