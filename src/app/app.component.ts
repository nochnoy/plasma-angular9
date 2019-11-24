import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService, SessionStatus } from './services/message.service';

@Component({
    selector: 'app-root',
    template: `
        <div class="main">

            <ng-container *ngIf="isAuthorized">
                <menu></menu>
                <router-outlet></router-outlet>
            </ng-container>

            <ng-container *ngIf="!isAuthorized">
                <input [(ngModel)]="loginValue">
                <input [(ngModel)]="passwordValue" type="password">
                <button (click)="onLoginClick()">Login</button>
            </ng-container>
            
        </div>
    `
})
export class AppComponent {

    public isAuthorized = false;

    public loginValue: string = 'marat';
    public passwordValue: string = 'parolchegdlyaplazmy';

    constructor(
        public router: Router,
        public service: MessageService,
    ) { }

    ngOnInit() {
        this.service.statusSubject.subscribe((status) => {
            switch (status) {

                case SessionStatus.UNAUTHORIZED:
                    this.isAuthorized = false;
                    break;

                case SessionStatus.AUTHORIZED:
                    this.isAuthorized = true;
                    this.router.navigate(['/forum/1']);
                    break;

            }
        });

        this.service.startSession();
    }

    onLoginClick() {
        this.service.login(this.loginValue, this.passwordValue);
    }
}
