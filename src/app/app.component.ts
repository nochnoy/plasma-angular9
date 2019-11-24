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
                <gate></gate>
            </ng-container>
            
        </div>
    `
})
export class AppComponent {

    public isAuthorized = false;

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
                    this.router.navigate(['/forum/1']); // <<<<<<<<<<<<< по идее сервер сам должен направить куда надо
                    break;

            }
        });

        this.service.startSession();
    }
}
