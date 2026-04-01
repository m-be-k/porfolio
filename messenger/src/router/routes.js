import RegForm from "@/components/RegForm.vue";
import EntranceWindow from "@/components/EntranceWindow.vue";
import ChatWindow from "@/components/ChatWindow.vue";

const routes = [
    {path: '/auth', component:EntranceWindow},
    {path:'/chat', component:ChatWindow},
    {path:'/', redirect:'/auth'},
]
export default routes;