import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { MessageService } from "@app/services/message.service";

import { Thread } from '@model/thread.model';
import { Channel } from '@model/channel.model';

@Component({
  selector: 'forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

constructor(
  private http: HttpClient,
  public messagesService: MessageService,
) { }


public channel: Channel = null;

ngOnInit() {
    this.messagesService.getChannel(25, "2019-09-22 22:21:06", (input) => {
        this.channel = new Channel();
        this.channel.deserialize(input);
    });
}

onExpandClick(event, thread:Thread) {
    event.preventDefault();

    if (thread.isLoaded) {
        thread.isExpanded = true;
    } else {
        this.messagesService.getThread(thread.rootId, "2019-09-22 22:21:06", (input) => {
            thread.addMessages(input.messages);
            thread.isExpanded = true;
        });
    }
}

}
