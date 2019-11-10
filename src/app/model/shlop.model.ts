import { Message } from "./message.model";
import { Utils } from "../utils";

export class Shlop {
    start: Message;
    finish: Message;
    length: number;
    lengthText: string;

    public setLength(value:number) {
        this.length = value;
        this.lengthText = 'Скрыто ' + this.length + Utils.chisl(this.length, ['сообщение', 'сообщения', 'сообщений']);
    }
}