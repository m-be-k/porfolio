<script setup>
const mode = defineModel();

import {useRouter} from 'vue-router';

const router = useRouter();

const onLogin = () => {
  router.push('/chat');
};

</script>

<template>
  <div class="menu">
    <input type="text" placeholder="Логин">
    <input type="password" placeholder="Пароль">
    <button @click='onLogin()'>Войти</button>
    <button @click="mode='reg'">Создать новый аккаунт</button>
  </div>
</template>

<style scoped>
.menu {
  display: flex;
  flex-direction: column;
  width: 250px;
  background: #ffffff;
  border: 1px solid darkgray;
  padding: 15px;
  gap: 10px;
}

input {
  height: 30px;
  padding: 0 5px;
}

button {
  padding: 8px;
}


</style>