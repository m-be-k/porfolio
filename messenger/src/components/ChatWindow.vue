<script setup>

import {useRouter} from 'vue-router';

const router = useRouter();

const onLogout = () => {
  router.push('/auth');
};

</script>
<template>
  <div class="container">

    <div class="menu">
      <div class="meDiv">
        <div class="me">
          <div class="ava">
            <img src="../../public/images/iconmonstr-user-circle-thin.svg" alt='my avatar'>
          </div>
          <div class="accInfo">
            <div class="accName">Madi</div>
          </div>

        </div>

        <div class="status">
          <select>
            <option>В сети</option>
            <option>Отошел</option>
            <option>Невидимый</option>
          </select>
        </div>
        <div class="exit">
          <button @click="onLogout">Выход</button>
        </div>
      </div>

      <div class="profileChat">
        <div class="accProfile">
          <div class="ava"><img src="../../public/images/iconmonstr-user-circle-thin.svg"></div>
          <div class="accInfo">
            <div class="accName">IVAN</div>
            <div class="accStatus">Status</div>
          </div>
          <button class="block-btn">block</button>
        </div>
      </div>
    </div>

    <div class="chat">
      <div class="messageBoard">

        <div class="messageText">
          <div class="icon"><img src="../../public/images/iconmonstr-user-circle-thin.svg"></div>
          <div class="info left">
            <div class="name">IVAN</div>
            <div class='text'>Привет!</div>
            <div class="time">16:40</div>
          </div>
        </div>

        <div class="messageText my-message">
          <div class="icon"><img src="../../public/images/iconmonstr-user-circle-thin.svg"></div>
          <div class="info left">
            <div class="name">Madi</div>
            <div class='text'>Привет!:)</div>
            <div class="time">16:41</div>
          </div>
        </div>

      </div>

      <div class="inputContainer">
        <textarea class='textarea' placeholder="Текст сообщения"></textarea>
        <div class="btns">
          <button class="send-btn">Отправить</button>
          <div class="emoji-bar">
            <button class="emoji">😊</button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* контейнер */
.container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100vh;
}

/* менюха */
.menu {
  display: flex;
  flex-direction: column;
  flex-basis: 350px;
  background-color: #ffffff;
  border-right: 1px solid #030202;
}

.meDiv {
  display: flex;
  border-bottom: 1px solid black;
}

.exit {
  display: flex;
}

.me {
  display: flex;
  width: 200px;
  background-color: #ffffff;
  align-items: center;
  padding: 10px;
  gap: 10px;
}

.status {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  padding: 10px;
  flex-grow: 1;
}

.profileChat {
  width: 100%;
  flex-grow: 1;
}

.accProfile {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #ffffff;
  border-bottom: 1px solid #eee;
  gap: 10px;
}

.accInfo {
  flex-grow: 1;
  padding: 5px;
}


/* чат */
.chat {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: rgba(85, 97, 244, 0.4);
}

.messageBoard {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 20px;
  gap: 15px;
  overflow-y: auto;
}

.messageText {
  display: flex;
  max-width: 70%;
  gap: 10px;
  align-items: flex-end;
}


.info {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 8px 12px;
  border-radius: 10px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  position: relative;
}

.info.left {
  border-bottom-left-radius: 0;
}

.info.right {
  border-bottom-right-radius: 0;
}

.info::before {
  content: "";
  display: block;
  width: 0;
  height: 0;
  border-left: 10px solid #000aff00;
  border-right: 10px solid #00ff3000;
  border-bottom: 8px solid #ffffff;
  position: absolute;
  bottom: 0;
  left: -10px;
  z-index: 0;
}


.icon {
  flex-shrink: 0;
}

.icon img {
  width: 40px;
}

.inputContainer {
  display: flex;
  padding: 10px;
  background-color: #ffffff;
  gap: 10px;
  align-items: center;
}

.textarea {
  flex-grow: 1;
  height: 45px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  resize: none;
}

.btns {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.block-btn {
  background: red;
  color: white;
  border: none;
  padding: 7px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 10px;
}

.name {
  font-size: 10px;
  color: #119344;
}

.time {
  font-size: 10px;
  color: #030202;
  text-align: right;
}

.icon img {
  width: 40px;
}

img {
  display: block;
}
</style>