import { Shlop } from './shlop.model';
import { Message, MessageDisplayType } from './message.model';
import { ShlopMessage } from './shlop-message.model';
import { Utils } from '../utils';
import { Channel } from './channel.model';

export class Thread {

    constructor(rootId: number, channel: Channel) {
        this.rootId = rootId;
        this.channel = channel;
    }

    // Properries -------------------------------------------------------------
    
    public channel: Channel;
    public rootId: number;
    public root: Message;
    public starred = new Array<Message>();
    public starredMaxId = 0;
    public isDigest = false;
    public isExpanded = false;
    public commentsCount = 0;
    public commentsCountText = '';
    
    // Хеш сообщений дерева
    // Помни, что при  схлопах сообщения исчезают из иерархии, но остаются в этом хеше
    private map = new Map<number, Message>();

    private shlops = new Array<Shlop>();

    // Methods ----------------------------------------------------------------

    public get isLoaded(): boolean {
        // TODO: сомнительный способ, багоопасный. Но пока пусть будет так.
        return this.map.values.length == this.commentsCount;
    }

    public addMessages(rawMessages: Array<any>) {
        rawMessages.forEach(m => {
            this.addMessage(m);
        });
    }

    public addMessage(rawMessage: any): Message {
        const m = this.getOrCreateMessage(rawMessage.id);
        m.deserialize(rawMessage, this.rootId);
        m.updateStarred();

        if (m.parentId) {
            const parent = this.getOrCreateMessage(m.parentId);
            parent.addChild(m);
            if (m.isStarred) {
                m.important = true;
                parent.important = true;
                this.starred.push(m);
                if (this.starredMaxId < m.id) {
                    this.starredMaxId = m.id;
                }
            }
            this.increaseCommentsCount(); // Только для не рутовых. Рут это не коммент.
        } else {
            this.root = m;
            m.important = true;
        }
        return m;
    }

    public addDigestCopy(m: Message): Message {
        let c: Message;

        if (this.map.has(m.id)) {
            // Если уже есть старое сообщение с таким id - вольём в него данные из нового
            c = this.getMessage(m.id);
            c.merge(m);
        } else {
            c = m.clone();
        }

        if (c.parentId) {
            const parent = this.getOrCreateMessage(c.parentId);
            parent.addChild(c);
        } else {
            this.root = c;
        }

        c.thread = this; // А то всякие мерджи давали ему ссылку на оригинальное дерево

        // Серыми становятся все сообщения в дайджесте кроме звезданутых
        if (!c.isStarred) {
            c.display = MessageDisplayType.GRAY;
        }

        return c;
    }

    private getMessage(id: number): Message {
        let m = this.map.get(id);
        return m || null;
    }

    private getOrCreateMessage(id: number): Message {
        let m = this.getMessage(id);
        if (!m) {
            m = new Message();
            m.id = id;
            m.thread = this;
            this.map.set(id, m);
        }
        return m;
    }

    public sort() {
        this.map.forEach((message) => {
            if (message.children) {
                message.children.sort((a: Message, b: Message): number => {
                    const aid = a.id;
                    const bid = b.id;
                    if (aid < bid) {
                        return -1;
                    }
                    else if (aid > bid) {
                        return 1;
 }
                    else {
                        return 0;
 }
                });
            }
        });
    }

    public findShlops(m: Message) {
        let shlop: Shlop = null;
        while (m) {

            // Оцениваем схлопабельность сообщения
            switch (true) {

                // Несхлопабельно
                case !m.children:           // потому что дошли до самого низа (такого никогда не случится, мы скорее доейдём до сообщения со звёздочкой)
                case m.children.length > 1: // потому что развилка
                case m.isStarred:           // потому что это сообщение со звёздочкой
                case m.important:           // потому что это родитель сообщения со звёздочкой
                    // Если мы были в процессе набора схлопа - закрываем его
                    if (shlop) {
                        if (shlop.length > 2) {
                            this.shlops.push(shlop);
                        }
                        shlop = null; // Этот схлоп закончился. Ищем следующий.
                    }
                    break;

                // Схлопабельно
                default:
                    if (shlop) {
                        // Продолжаем начатый схлоп
                        shlop.length++;
                        shlop.finish = m;
                    } else {
                        // Открываем новый схлоп
                        shlop = new Shlop();
                        shlop.start = m;
                        shlop.finish = m;
                        shlop.length = 1;
                    }
            }

            // Углубляемся дальше

            if (m.children) {
                if (m.children.length == 1) {
                    m = m.children[0];
                } else {
                    // Дошли до развилки. На этом работа этой копии функции закончена
                    // делаем рекурсивные вызовы для каждой из веток
                    for (let i = 0; i < m.children.length; i++) {
                        this.findShlops(m.children[i]);
                    }
                    m = null; // the end
                }
            } else {
                m = null; // the end
            }
        }
    }

    public buildDigest(): Thread {
        let starredMessage: Message;
        let dm: Message;
        let m: Message;
        const dt = new Thread(this.rootId, this.channel);
        dt.isDigest = true;
        dt.starredMaxId = this.starredMaxId;

        // Перельём в map ветки-дайджеста все сообщения из оригинальной ветки 
        // чтобы избежать нечаянного создания новых сообщений функцией getOrCreate()

        this.map.forEach(origMsg => {
            let digestMsg = origMsg.clone();
            digestMsg.thread = dt;
            dt.map.set(origMsg.id, digestMsg);
        });

        // Строим серые деревья (дайджесты)

        for (let i = 0; i < this.starred.length; i++) {
            starredMessage = this.starred[i];
            m = starredMessage;
            while (m) {
                dm = dt.addDigestCopy(m);
                m = m.parent;
            }
        }

        // Строим схлопы в дайджестах

        this.shlops.length = 0;
        this.findShlops(dt.root);

        let shlop: Shlop;
        for (let i = 0; i < this.shlops.length; i++) {
            shlop = this.shlops[i];

            // Схлопнем
            const s = new ShlopMessage();
            s.id = shlop.start.id;
            s.display = MessageDisplayType.SHLOP;
            s.shlop = shlop;
            s.thread = dt;

            const startParent = shlop.start.parent;
            startParent.removeChild(shlop.start); // ВНИМАНИЕ! Мы удаляем детей сообщения, но они всё ещё фигурируют в хеше дерева (map)
            startParent.addChild(s);
            shlop.finish.transferChildrenTo(s);
        }

        // Сортируем построенное дерево

        dt.sort();

        return dt;
    }

    public unshlop(m: ShlopMessage) {
        // Все сообщения в схлопе сделаем не серыми
        let m1 = m.shlop.finish;
        while (m1) {
            m1.display = MessageDisplayType.NORMAL;
            m1 = m1.parent;
        }

        const parent = m.parent;
        m.transferChildrenTo(m.shlop.finish); // Дети, которые крепились к схлоп-сообщению, вешаются в конец схлопнутой последовательности
        parent.removeChild(m);
        parent.addChild(m.shlop.start);
        this.sort();
    }

    private updateCommentsCount() {
        this.commentsCountText = '' + this.commentsCount + ' ' + Utils.chisl(this.commentsCount, ['комментарий', 'комментария', 'комментариев']);
    }
    private increaseCommentsCount() {
        this.commentsCount++;
        this.updateCommentsCount();
    }
    public setCommentsCount(val: number) {
        this.commentsCount = val;
        this.updateCommentsCount();
    }

}
