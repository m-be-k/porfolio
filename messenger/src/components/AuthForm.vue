<script setup>

import {ref, watch} from "vue";
import {sendRequest} from '../helpers/network.js';

const username = ref('');
const password = ref('');
const errorMessage = ref('');


const mode = defineModel();

import {useRouter} from 'vue-router';

const router = useRouter();
watch([username, password], () => {
  errorMessage.value = '';
})
const onLogin = () => {
  if ((username.value === '')
      || (password.value === '')) {
    errorMessage.value = 'Поля не должны быть пустыми';
    return;
  }
  sendRequest(
      'auth',
      'login',
      {
        username: username.value,
        password: password.value
      },
      (data) => {
        console.log('Успешный вход:', data);
        router.push('/chat');
      },
      (message) => {
        errorMessage.value = message;
      }
  )
};


</script>

<template>
  <div class="menu">
    <input v-model="username" type="text" placeholder="Логин">
    <input v-model="password" type="password" placeholder="Пароль">
    <div class="error"> {{ errorMessage }}</div>
    <button @click='onLogin'>Войти</button>
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