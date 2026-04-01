<script setup>

import EntranceWindow from "@/components/EntranceWindow.vue";
import ChatWindow from "@/components/ChatWindow.vue";
import RegForm from "@/components/RegForm.vue";
import {useRoute, useRouter} from "vue-router";

const loggedOn = false;

const router = useRouter();
const route = useRoute();

</script>

<template>
  <router-view />
</template>

<style scoped>

</style>