import { Component, Input } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Page } from '../model/page.model';

@Component({
    selector: 'main-menu',
    template: `
        <ul *ngFor="let page of pages">
            <li><a [routerLink]="['forum/', page.id]" routerLinkActive="active">{{page.name}}</a></li>
        </ul>
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
export class MainMenuComponent {

    public pages = new Array<Page>();

    constructor(
        public messagesService: MessageService,
    ) {}

    ngOnInit() {
        for (let i = 0; i < 20; i++) {
            let page = new Page();
            page.id = i;
            page.name = 'Страница ' + i;
            this.pages.push(page);
        }
    }

    
}
