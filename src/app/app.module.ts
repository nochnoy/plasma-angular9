import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MessageService } from '@app/services/message.service';
import { AppGuard }   from '@app/app.guard';

import { AppComponent } from '@app/app.component';
import { MessagesComponent } from '@app/components/messages.component';
import { MenuComponent } from '@app/components/menu.component';
import { ForumComponent } from '@app/components/forum/forum.component';
import { GateComponent } from '@app/components/gate.component';

import { ForumPageComponent } from '@app/components/pages/forum-page/forum-page.component';

const routes: Routes = [
    { path: '', redirectTo: '/forum/1', pathMatch: 'full' },
    { path: 'forum/:id', component: ForumPageComponent, canActivate: [AppGuard] },
];

@NgModule({
    declarations: [
        AppComponent,
        MessagesComponent,
        MenuComponent,
        ForumComponent,
        GateComponent,

        ForumPageComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot(routes)
    ],
    providers: [
        MessageService,
        AppGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
