import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { MessageService, SessionStatus } from './services/message.service';

@Component({
    selector: 'app-root',
    template: `
        <div class="main">
            <menu></menu>
            <router-outlet></router-outlet>
        </div>
    `
})
export class AppComponent {
    constructor(
        public router: Router,
        public messagesService: MessageService,
    ) { }

    ngOnInit() {

        this.messagesService.statusSubject.subscribe((status) => {
            switch (status) {

                case SessionStatus.UNAUTHORIZED:
                    this.router.navigate(['/guest']);
                    break;

                case SessionStatus.AUTHORIZED:
                    this.router.navigate(['/forum/1']);
                    break;

            }
        });

    }
}
