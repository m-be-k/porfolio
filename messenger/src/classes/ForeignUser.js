import {User} from "@/classes/User.js";

export class ForeignUser extends User {
    createdAt;
    updatedAt;

    constructor(id, username, iconUrl, status, createdAt, updatedAt) {
        super(id, username, iconUrl, status);
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}