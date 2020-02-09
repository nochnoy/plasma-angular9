import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from "rxjs";

import { Message } from '@model/message.model';
import { TopSecret } from '@model/top-secret';
import { Page } from '../model/page.model';

@Injectable()
export class MessageService {

    public colorBg = '#F4E5D7';
    public colorText = '#313e41';
    public colorDigest = '#ADA99A';

    private headers: HttpHeaders;

    public get status() {
        return this._status;
    }
    public set status(status: SessionStatus) {
        if (status != this._status) {
            this._status = status;
            this.statusSubject.next(status);
        }
    }
    private _status:SessionStatus = SessionStatus.UNITIALIZED;
    public statusSubject = new Subject<SessionStatus>();
    public get isAuthorized():boolean {
        return this.status == SessionStatus.AUTHORIZED;
    }

    // Список страниц в главном меню
    public menuPages = new Array<Page>();

    constructor(
        private http: HttpClient
    ) {
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
        });
        console.log('Will be connecting to ' + TopSecret.ApiPath);
    }

    /**
     * Команда серверу
     */
    public sendCommand(commandName:string, params:object, callback: Function = null) {

        let httpParams = (new HttpParams());
        httpParams = httpParams.append('cmd',  commandName);

        let paramsS = '';
        for (let key in params) {
            httpParams = httpParams.append(key, params[key]);
            paramsS += ' ' + key + '=' + params[key];
        }

        let postParams = 

        console.log('⮞⮞ ' + commandName + ':' + paramsS);

        this.http.post(
            TopSecret.ApiPath, 
            null, 
            {
                headers: this.headers, 
                params: httpParams, 
                responseType: 'text', 
                withCredentials: true // With Credentials!
            }
        ).subscribe(
            (json) => {
                console.groupCollapsed('⮜⮜ ' + commandName);
                console.log(json);
                console.groupEnd();
                let result: any = null;
                try {
                    result = JSON.parse(json);
                }
                catch(e) {
                    result = {"error": "JSON is not parseable: " + json};
                }

                // Сначала даём понюхать глобальному хуку
                if (result)  {
                    this.globalCommandHook(result);
                }
                
                // Потом инициатору запроса
                if (result && callback) {
                    callback(result);
                }
            },
            (err: HttpErrorResponse) => {
                alert('HTTP Error: ' + err.url + ': ' + err.message);
                console.error('HTTP Error: ' + err.url + ': ' + err.message);
            }
        );
    }

    /**
     * Глобальный хук сообщений. 
     * Дёргается каждый раз, когда с сервера приходят данные. 
     * Тут можно ловить события типа разавторизации.
     */
    private globalCommandHook(input:any) {

        // debug log
        // Выведем серверные логи

        if (input.log) {
            console.group('Server logs:');
            for (var msg of input.log as Array<string>) {
                console.log('🌸 ' + msg);
            }
            console.groupEnd();
        }

        // status
        // Проверим авторизацию

        if (input.status) {
            if (input.status.authorized) {
                this.status = SessionStatus.AUTHORIZED;
            } else {
                this.status = SessionStatus.UNAUTHORIZED;
            }
        }

        // channels
        // Пришёл список каналов для главного меню

        if (input.channels) {
            this.menuPages.length = 0;
            var a = input.channels.channels as Array<any>;
            let page: Page;
            for (const item of a) {
                page = new Page();
                page.id = parseInt(item['id']);
                page.name = item['name'];
                page.timeChanged = item['d'];
                page.timeViewed = item['v'];
                this.menuPages.push(page);
            }
        }
    }

    /**
     * Вызывается при старте приложения. Лезет на сервер, пытается авторизоваться по ключу.
     */
    public startSession()
    {
        this.status = SessionStatus.PENDING;
        this.sendCommand('start', {});
    }

    /**
     * Аутентификация
     */
    public login(login:string, password:string, callback: Function = null)
    {
        this.sendCommand('login', {login: login, password:password}, (result) => {
            if (result.status && result.status.authorized) {
                this.startSession();
                if (callback)
                    callback();
            }
        });
    }

    /**
     * Аутентификация
     */
    public logOut(callback: Function = null)
    {
        this.sendCommand('log_out', {}, callback);
    }

    /**
     * Запрашивает с сервера сообщения канала
     */
    public getChannel(channelId: number, lastVieved: string, callback: Function) {
        this.sendCommand('get_channel', {cid: channelId.toString(), lv: lastVieved}, callback);
    }

    /**
     * Запрашивает с сервера сообщения одного треда
     */
    public getThread(threadId: number, lastVieved: string, callback: Function) {
        this.sendCommand('get_thread', {tid: threadId.toString(), lv: lastVieved}, callback);
    }

    /**
     * Запрашивает с сервера список страниц для левого меню
     */
    public getChannels(lastVieved: string, callback: Function) {
        this.sendCommand('get_channels', {lv: lastVieved}, callback);
    }

}

export enum SessionStatus {
    UNITIALIZED = -1,
    UNAUTHORIZED = 0,
    PENDING = 1,
    AUTHORIZED = 2,
}