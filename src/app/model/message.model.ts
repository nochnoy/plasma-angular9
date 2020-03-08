import { Thread } from './thread.model';

export class Message {
    id: number;
    display: number = MessageDisplayType.NORMAL; // Способ показа
    parentId: number;
    rootId: number;
    thread: Thread;

    nick            = '';
    text            = '';
    timeCreated     = '';
    isDigest        = false;
    isStarred       = false;
    important       = false; // не схлопывать это сообщение в серых деревьях. Оно важное.
    commentsCount   = 0; // присылаемое с сервера кол-во комментов для рутовых сообщений (когда сами комменты ещё не подгружены)

    // debug
    isShloped       = false;
    isHighlighted   = false;

    parent: Message;
    children: Array<Message>;

    public addChild(child: Message) {
        if (!this.children) {
            this.children = new Array<Message>();
        }
        if (child.parent !== this) {
            this.children.push(child);
            child.setParent(this);
        }
    }

    public removeChild(child: Message) {
        if (this.children) {
            const ix = this.children.indexOf(child);
            if (ix > -1) {
                this.children.splice(ix, 1);
                child.setParent(null);
            }
        }
    }

    public transferChildrenTo(newParent: Message) {
        if (this.children) {
            let child: Message;
            for (let i = 0; i < this.children.length; i++) {
                child = this.children[i];
                newParent.addChild(child);
            }
            this.children.length = 0;
        }
    }

    public setParent(parent: Message) {
        this.parent = parent;
    }

    public updateStarred() {
        this.isStarred = this.thread.channel.timeViewed < this.timeCreated;
    }

    public clone(): Message {
        const c = new Message();

        c.id = this.id;
        c.parentId = this.parentId;
        c.rootId = this.rootId;
        c.thread = this.thread;
        c.nick = this.nick;
        c.text = this.text;
        c.timeCreated = this.timeCreated;
        c.isStarred = this.isStarred;
        c.important = this.important;

        return c;
    }

    public merge(m: Message) {
        this.parentId = m.parentId;
        this.rootId = m.rootId;
        this.thread = m.thread;
        this.nick = m.nick;
        this.text = m.text;
        this.timeCreated = m.timeCreated;
        this.isStarred = m.isStarred;
        this.important = m.important;
    }

    public deserialize(raw: any, rootId: number) {
        this.id             = raw.id;
        this.parentId       = raw.pid;
        this.rootId         = rootId;
        this.nick           = raw.n;
        this.text           = raw.t;
        this.timeCreated    = raw.d;

        if (raw.hasOwnProperty('cm')) {
            this.commentsCount = raw.cm;
        }

        if (!(this.id > 0)) {
            // id сообщений должны быть только числовыми и увеличиваться вверх!
            // на это опирается сортировка и подсветка новых сообщений!
            throw new Error('Karamba!');
        }
    }
}

export class MessageDisplayType {
    static NORMAL   = 0;
    static GRAY     = 1;
    static SHLOP    = 10;
}
