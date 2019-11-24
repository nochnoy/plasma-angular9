import { Component, Input } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Page } from '../model/page.model';

@Component({
    selector: 'menu',
    template: `
        <ul *ngFor="let page of pages">
            <li><a [routerLink]="['forum/', page.id]" routerLinkActive="active">{{page.name}}</a></li>
        </ul>
        <a [routerLink]="'exit'">Выход</a>
    `,
    styles: [`
        :host {
            min-width: 200px;
            min-height: 200px;

        }
        a:active {
            color: red;
        }
    `]
})
export class MenuComponent {

    public pages = new Array<Page>();

    constructor(
        public messagesService: MessageService,
    ) {}

    ngOnInit() {
        this.pages.length = 0;
        this.messagesService.getChannels('2019-10-12 23:45:18', (input) => {
            var channelsInput = input['channels'];
            if (channelsInput) {
                var a = channelsInput.channels as Array<any>;
                let page: Page;
                for (const item of a) {
                    page = new Page();
                    page.id = parseInt(item['id']);
                    page.name = item['name'];
                    this.pages.push(page);
                }
            }
        });
    }

}
