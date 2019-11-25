import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService, SessionStatus } from './services/message.service';

@Component({
    selector: 'app-root',
    template: `
        <div class="main" [class.insiderbg]="status==2" [class.outsiderbg]="status!=2">

            <ng-container *ngIf="status==2">
                <menu></menu>
                <router-outlet></router-outlet>
            </ng-container>

            <ng-container *ngIf="status==0">
                <gate></gate>
            </ng-container>
            
        </div>
    `
})
export class AppComponent {

    public status: number = SessionStatus.UNITIALIZED;

    constructor(
        public router: Router,
        public service: MessageService,
        private elementRef: ElementRef, private renderer:Renderer2
    ) { }

    ngOnInit() {
        this.service.statusSubject.subscribe((status) => {
            this.status = status;
            switch (status) {

                case SessionStatus.UNAUTHORIZED:
                    break;

                case SessionStatus.AUTHORIZED:
                    this.router.navigate(['/forum/1']); // <<<<<<<<<<<<< по идее сервер сам должен направить куда надо
                    break;

            }
        });

        this.service.startSession();
    }
}
