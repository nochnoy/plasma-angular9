import { Component, Input, HostListener } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Page } from '../model/page.model';
import { TopSecret } from '@app/model/top-secret';

@Component({
    selector: 'gate',
    template: `
        <div class="controls">
            <button (click)="onKppClick()">КПП</button>
            <input [(ngModel)]="loginValue">
            <input [(ngModel)]="passwordValue" type="password">
            <button (click)="onLoginClick()">Вход</button>
        <div>
    `,
    styles: [`
        :host {
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;

            width: 100vw;
            height: 100vh;
        }

        .controls {
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: stretch;

            height: 2.5rem;
        }

        input {
            margin-left: 0.3rem;
            border: 1px solid #d7cabb;
            padding: 0.5rem;
        }

        button {
            width: 7rem;
            margin-left: 0.3rem;
            color: white;
            font-weight: bold;
            font-size: 0.9rem;
            background-color: #d7cabb;
        }
    `]
})
export class GateComponent {

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event) {
        if (event.code == 'Enter') {
            this.onLoginClick();
        }
    }

    public loginValue: string = '';
    public passwordValue: string = '';

    constructor(
        public service: MessageService,
    ) {}

    ngOnInit() {
    }

    onLoginClick() {
        this.service.login(this.loginValue, this.passwordValue);
    }

    onKppClick() {
        window.location.href = TopSecret.KppPath;
    }

}
