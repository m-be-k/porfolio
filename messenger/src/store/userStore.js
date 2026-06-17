import {defineStore} from 'pinia'
import {CurrentUser} from "@/classes/CurrentUser.js";
import {sendRequest} from "@/helpers/network.js";
import {defineAsyncComponent, ref, setDevtoolsHook} from "vue";
import {User} from "@/classes/User.js";
// тут создаем промис котрый ждет ответа от сервера.

export const useUserStore =
    defineStore('counter',
        () => {
            const currentUser = ref(new CurrentUser());
// Сделать наш промис через функцию, так как при каждом вызове будет создоватся новый промис
//   dataLoaded наша функция
             function loadData() {
                 return new Promise((resolve, reject) => {
                     sendRequest(
                         'users',
                         'me',
                         {},
                         (data) => {
                             console.log('Данные профиля', data);
                             currentUser.value = new User(data.id, data.username, data.iconUrl, data.status);
                             resolve(true);
                         },
                         // обычная ошибка для реджек и исключительная для реджект
                         // resolve(false) не трогаем критические ошибки
                         //
                         // reject выбирает критические ошибки когда упал сервер.
                         (message) => {
                             console.log('ERROR', message);

                             if ((message === "unauthorized") || (message === "session expired")) {
                                 resolve(false);
                             } else {
                                 reject(message);
                             }
                         },
                     )
                 });
             }
            //  id, username, iconUrl, status, mutedUsernames

            return {
                currentUser,
                loadData
            }
        });