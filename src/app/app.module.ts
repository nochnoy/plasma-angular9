import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';

import { MessageService } from '@app/services/message.service';
import { AppGuard }   from '@app/app.guard';

import { AppComponent } from '@app/app.component';
import { MessagesComponent } from '@app/components/messages.component';
import { MainMenuComponent } from '@app/components/main-menu.component';
import { ForumComponent } from '@app/components/forum/forum.component';

import { ForumPageComponent } from '@app/components/pages/forum-page/forum-page.component';
import { GuestPageComponent } from '@app/components/pages/guest-page/guest-page.component';

const routes: Routes = [
    { path: '', redirectTo: '/forum/1', pathMatch: 'full' },
    { path: 'forum/:id', component: ForumPageComponent, canActivate: [AppGuard] },
    { path: 'guest', component: GuestPageComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        MessagesComponent,
        MainMenuComponent,
        ForumComponent,

        ForumPageComponent,
        GuestPageComponent,
    ],
    imports: [
        BrowserModule,
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
