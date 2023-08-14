import Role from "./Role.ts";
import { User } from "./User.ts";

export default class Emoji {
    id?: string;
    name?: string;
    roles!: Array<Role>;
    user?: User;
    requireColons?: boolean;
    managed?: boolean;
    animated?: boolean;
    available?: boolean;

    constructor(d: any) {
        this.id = d.id;
        this.name = d.name;
        this.roles = [];
        if (d.roles) {
            for (const roleData of d.roles) {
                this.roles.push(new Role(roleData));
            }
        }
        if (d.user) {
            this.user = new User(d.user);
        }
        this.requireColons = d.require_colons;
        this.managed = d.managed;
        this.animated = d.animated;
        this.available = d.available;
    }
}