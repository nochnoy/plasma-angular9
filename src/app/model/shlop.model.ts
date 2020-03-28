import { Message } from './message.model';
import { Utils } from '../utils';

export class Shlop {
    start: Message;
    finish: Message;
    lengthText: string;

    public get length(): number {
        return this._length;
    }
    public set length(value:number) {
        this._length = value;
        this.lengthText = 'Тут ' + this.length + ' ' + Utils.chisl(this.length, ['сообщение', 'сообщения', 'сообщений']);
    }
    private _length: number;
}
