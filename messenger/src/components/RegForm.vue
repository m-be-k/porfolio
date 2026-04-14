<script setup>
import {ref, watch} from "vue";
import {useRouter} from 'vue-router';
import {sendRequest} from '../helpers/network.js';
// fetch('http://localhost:4000/ping')
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.error('Error:', error));

const mode = defineModel();
const router = useRouter();


// const onAcc1 = () => {
//   router.push('/chat');
// };

/*
1) Сообщение об ошибке должно исчезать при вводе нового логина
2) Нужно запретить отправлять на сервер пустые поля
3) При успешной регистрации - перебрасывать пользователя в чат
4) Сообщение о несовпадающих паролях показывать только во время ввода подтверждения

5) Написать логику для логина
 */

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');

//Сообщение об ошибке исчезает при вводе нового логина
watch([username, password], () => {
  errorMessage.value = '';
})
const fieldsNotEmpty = () => {
  if (
      (username.value === '')
      || (password.value === '')
  ) {
    errorMessage.value = 'Пустые поля';
    return false;
  }
  return true;
}

// 4) Логика несовпадения паролей через watch
watch([password, confirmPassword], ([newPass, newConfirm]) => {
  // Показываем ошибку только если подтверждение не пустое и не совпадает
  if (newConfirm !== '' && newPass !== newConfirm) {
    errorMessage.value = 'Пароли не совпадают';
  } else {
    errorMessage.value = '';
  }
});

function register() {
  if (!fieldsNotEmpty()) {
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Пароль не совпал ';
    return;
  }
  // POST запрос.
  sendRequest(
      'auth',
      'register',
      {
        username: username.value,
        password: password.value
      },
      (data) => {
        console.log('Успешно зарегистрирован!', data);
        router.push('/chat');
      },
      (text) => {
        errorMessage.value = text;
      }
  );
}


</script>

<template>
  <div class="info">
    <input v-model="username" type="text" placeholder="Логин">
    <input v-model="password" type="password" placeholder="Новый пароль">
    <input v-model="confirmPassword" type="password" placeholder="Потверждение пароля">
    <button @click="register()">Создать</button>
    <button @click="mode='auth'">У меня уже есть аккаунт</button>
    <p v-if="errorMessage!=='' ">{{ errorMessage }}</p>
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

p {
  justify-content: center;
  text-align: center;
  color: #bd2020;
}
</style>