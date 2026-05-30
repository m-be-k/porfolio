export class User {
    id;
    username;
    iconUrl;
    status;

    constructor(id,username,iconUrl,status) {
        this.id = id;
        this.iconUrl = iconUrl;
        this.username = username;
        this.status = status;

    }
}