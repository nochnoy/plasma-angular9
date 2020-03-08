import { Message } from './message.model';
import { Utils } from '../utils';

export class Page {
    type: PageType = PageType.Channel;
    id: number;
    name: string;
    timeChanged: string;
    timeViewed: string;
}

export enum PageType {
    Channel = 0,
    WebLink = 1
}
