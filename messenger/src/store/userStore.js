import {defineStore} from 'pinia'
import {CurrentUser} from "@/classes/CurrentUser.js";
import {sendRequest} from "@/helpers/network.js";
import {ref} from "vue";
import {User} from "@/classes/User.js";

export const useUserStore =
    defineStore('counter',
        () => {
            const currentUser = ref(new CurrentUser());
            sendRequest(
                'users',
                'me',
                {},
                (data) => {
                    console.log('Данные профиля', data);
                    currentUser.value = new User(data.id, data.username, data.iconUrl, data.status);
                   console.log(data);
                },
                (message) => {
                    console.log(message);
                    // router.push({ name: 'auth' });
                }
            )
            //  id, username, iconUrl, status, mutedUsernames

            return {
                currentUser
            }
        });