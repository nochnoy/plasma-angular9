import { Component } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'app-root',
    template: `
        <div class="main">
            <main-menu></main-menu>
            <router-outlet></router-outlet>
        </div>
    `
})
export class AppComponent {
    constructor() { }
}
