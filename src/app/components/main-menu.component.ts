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

        let page: Page;
        
        page = new Page();
        page.id = 1;
        page.name = 'Главный';
        this.pages.push(page);

        page = new Page();
        page.id = 12;
        page.name = 'Тестовый';
        this.pages.push(page);
        
        page = new Page();
        page.id = 2;
        page.name = 'Кухня';
        this.pages.push(page);

        page = new Page();
        page.id = 4;
        page.name = 'Техпомощь';
        this.pages.push(page);

        page = new Page();
        page.id = 15;
        page.name = 'Кабина министров';
        this.pages.push(page);
    }

    
}
