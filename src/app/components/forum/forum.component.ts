import { Component, OnInit, Input } from '@angular/core';

import { MessageService } from '@app/services/message.service';

import { Thread } from '@model/thread.model';
import { Channel } from '@model/channel.model';

@Component({
  selector: 'forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

constructor(
  public messagesService: MessageService,
) { }

public channel: Channel = null;

/** isReady */
public get isReady(): boolean {
    return this._isReady;
}
public set isReady(value: boolean) {
    this._isReady = value;
    this.tryLoad();
}
private _isReady = false;

/** id */
@Input()
public set id(value: number) {
    this._id = value;
    this.tryLoad();
}
public get id(): number {
    return this._id;
}
private _id: number;

ngOnInit() {
    this.isReady = true;
}

private tryLoad() {
    if (this._id && this._isReady) {
        const lastViewed = '2019-09-22 22:21:06';
        this.messagesService.getChannel(this.id, lastViewed, (input) => {
            let channelInput = input['channel'];
            if (channelInput) {
                this.channel = new Channel();
                this.channel.lastViewed = lastViewed;
                this.channel.deserialize(channelInput);
            }
        });
    }
}

onExpandClick(event, thread: Thread) {
    event.preventDefault();

    if (thread.isLoaded) {
        thread.isExpanded = true;
    } else {
        this.messagesService.getThread(thread.rootId, '2019-09-22 22:21:06', (input) => {
            thread.addMessages(input.thread.messages);
            thread.isExpanded = true;
        });
    }
}

}
