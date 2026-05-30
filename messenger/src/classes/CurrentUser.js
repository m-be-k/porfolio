import {User} from "@/classes/User.js";

export class CurrentUser extends User{
    mutedUsernames;

    constructor(id,username,iconUrl,status,mutedUsernames ) {
        super(id,username,iconUrl,status);
        this.mutedUsernames = mutedUsernames;
    }
}