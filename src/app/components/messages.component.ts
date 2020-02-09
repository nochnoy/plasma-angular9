import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Message, MessageDisplayType } from '../model/message.model';
import { ShlopMessage } from '../model/shlop-message.model';
import { Thread } from '../model/thread.model';
import { MessageService } from '../services/message.service';

@Component({
    selector: 'messages',
    template: `
        <ng-container *ngFor="let message of messages">
            <div class="msg"
                [class.msg-root]="!message.parent"
                [class.msg-starred]="message.isStarred"
                *ngIf="message != null"
                >

                <ng-container [ngSwitch]="message.display">

                    <!-- Обычное сообщение (MessageDisplayType.NORMAL) -->
                    <ng-container *ngSwitchCase="0">
                        <!--  [style.color]="getTextColor(message)" -->
                        <div class="text">
                            <div class="ico"></div>
                            <b>{{message.nick}}<u *ngIf="message.isStarred"></u></b>
                            {{message.text}}
                        </div>
                    </ng-container>

                    <!-- Серое сообщение (MessageDisplayType.GRAY) -->
                    <ng-container *ngSwitchCase="1">
                        <div class="text text-gray" (click)="unfoldGray($event, message)">
                            <div class="ico"></div>
                            <b>{{message.nick}}<u *ngIf="message.isStarred"></u></b>
                            {{message.text}}
                        </div>
                    </ng-container>

                    <!-- Схлоп (MessageDisplayType.SHLOP) -->
                    <ng-container *ngSwitchCase="10">
                        <div class="text text-gray" (click)="unshlop($event, message)">
                            {{message.shlop.lengthText}}
                        </div>
                    </ng-container>

                </ng-container>

                <messages *ngIf="showChildren && message.children && message.children.length > 0" [messages]="message.children"></messages>

            </div>
        </ng-container>
    `,
    styles: [`


  `]
})
export class MessagesComponent {

    constructor(
        public messagesService: MessageService,
    ) {}

    @Input('messages')
    public messages: Array<Message>;

    @Input('showChildren')
    public showChildren = true;

    ngOnInit() {

    }

    public unshlop(event, shlopMessage: ShlopMessage) {
        event.preventDefault();
        shlopMessage.thread.unshlop(shlopMessage);
    }

    getTextColor(message: Message): string {
        if (message.thread.isDigest) {
            return this.messagesService.colorDigest;
        }
        else {
            return this.messagesService.colorText;
        }
    }

    unfoldGray(event, message: Message) {
        event.preventDefault();
        message.display = MessageDisplayType.NORMAL;
    }

    chisl(number, titles) {
        const cases = [2, 0, 1, 1, 1, 2];
        return titles[ (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5] ];
    }
}
