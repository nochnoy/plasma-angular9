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
public set channelId(value: number) {
    this._channelId = value;
    this.tryLoad();
}
public get channelId(): number {
    return this._channelId;
}
private _channelId: number;

ngOnInit() {
    this.isReady = true;
}

private tryLoad() {
    if (this._channelId && this._isReady) {
        this.channel = this.messagesService.getOrCreateChannel(this._channelId);

        console.log("### channel timeViewed==="+this.channel.timeViewed);

        this.messagesService.loadChannel(this.channelId, this.channel.timeViewed, (input) => {
            let channelInput = input['channel'];
            if (channelInput) {
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
        this.messagesService.loadThread(thread.rootId, thread.channel.timeViewed, (input) => {
            thread.addMessages(input.thread.messages);
            thread.isExpanded = true;
        });
    }
}

}
