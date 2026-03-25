
import * as ruLocal from './ru.js';
import * as enLocal from './en.js';

const locals  = {
    ru: ruLocal,
    en: enLocal,
}

export default locals[localStorage.getItem("local") ?? 'ru' ];

