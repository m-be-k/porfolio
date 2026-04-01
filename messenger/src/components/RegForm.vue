<script setup>
const mode = defineModel();

import {useRouter} from 'vue-router';

const router = useRouter();

const onAcc1 = () => {
  router.push('/chat');
};
</script>

<template>
  <div class="info">
    <input type="text" placeholder="Логин">
    <input type="password" placeholder="Новый пароль">
    <input type="password" placeholder="Потверждение пароля">
    <button @click="onAcc1()">Создать</button>
    <button @click="mode='auth'">У меня уже есть аккаунт</button>

  </div>
</template>

<style scoped>
.info {
  display: flex;
  flex-direction: column;
  width: 250px;
  background: #f9f9f9;
  border: 1px solid darkgray;
  padding: 20px;
  gap: 8px;
}

input {
  padding: 5px;
}

button {
  padding: 5px;
}
</style>