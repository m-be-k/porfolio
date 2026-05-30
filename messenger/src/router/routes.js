import RegForm from "@/components/RegForm.vue";
import EntranceWindow from "@/components/EntranceWindow.vue";
import ChatWindow from "@/components/ChatWindow.vue";

const routes = [
    {path: '/auth', name:"auth", component:EntranceWindow},
    {path:'/chat', name:"chat", component:ChatWindow,
        beforeEnter: () =>{

        }
    },
    {path:'/', redirect:'/auth'},
]
export default routes;