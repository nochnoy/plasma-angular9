import { Component, Input } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Page } from '../model/page.model';

@Component({
    selector: 'menu',
    template: `
        <div class="logo"></div>
        <ul *ngFor="let page of service.pages">
            <li>
                <u *ngIf="page.timeChanged > page.timeViewed"></u>
                <a [routerLink]="['forum/', page.id]" routerLinkActive="active">{{page.name}}</a>
            </li>
        </ul>
        <a href (click)="logOut()">Выход</a>
    `,
    styles: [`
        :host {
            min-width: 200px;
            min-height: 200px;
        }

        .logo {
            position: absolute;
            z-index: 1;

            width: 146px;
            height: 133px;
            background-image: url(assets/logo.gif);
        }

        ul {
            position: relative;
            z-index: 2;

            top: 110px;
            left: 40px;
            list-style-type: none;
        }

        a {
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
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
