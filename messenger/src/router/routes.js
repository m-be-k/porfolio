import RegForm from "@/components/RegForm.vue";
import EntranceWindow from "@/components/EntranceWindow.vue";
import ChatWindow from "@/components/ChatWindow.vue";
import {useUserStore} from "@/store/userStore.js";

const routes = [
    {
        path: '/auth', name: "auth", component: EntranceWindow,
        beforeEnter: async () => {
            // Если пользователь уже залогинен - кидаем в чат через ретурн  {name :"chat"}
            // Если нет - ничего не делаем, остаемся на месте

            const currentUser = useUserStore();
            const dataLoaded = await currentUser.loadData();
            //создать промис который ждет ответа от сервера.
            // роутер должен ждать промис.
            // запрос делаю через сторе.
// function checkReg(){
//     return new Promise((resolve,reject)=> {
//         // условие
//         //
//     })
// }
            //проврерим, авторизован ли пользователь
            if (dataLoaded) {
                return {name: "chat"};
            }
        }
    },
    {
        path: '/chat', name: "chat", component: ChatWindow,
        beforeEnter: async () => {
            const userStore = useUserStore();
            const dataLoaded = await userStore.loadData();
            // Если пользователь уже залогинен - ничего не делаем, остаемся на месте
            // Если нет - кидаем в логинилку через ретурн  {name :"auth"}

            if (!dataLoaded) {
                return {name: "auth"};
            }
        }
    },
    {path: '/', redirect: {name: "auth"}},
];
export default routes;