import { Component, Input } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Page } from '../model/page.model';

@Component({
    selector: 'menu',
    template: `
        <ul *ngFor="let page of service.menuPages">
            <li><a [routerLink]="['forum/', page.id]" routerLinkActive="active">{{page.name}}</a></li>
        </ul>
        <a href (click)="logOut()">Выход</a>
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

    constructor(
        public service: MessageService,
    ) {}

    ngOnInit() {
    }

    logOut() {
        this.service.logOut();
        return false;
    }

}
