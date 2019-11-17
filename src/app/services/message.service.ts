import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from "rxjs";

import { Message } from '@model/message.model';
import { TopSecret } from '@model/top-secret';

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
        this._status = status;
        this.statusSubject.next(status);
    }
    private _status:SessionStatus = SessionStatus.PENDING;
    public statusSubject = new Subject<SessionStatus>();
    public get isAuthorized():boolean {
        return this.status == SessionStatus.AUTHORIZED;
    }

    constructor(
        private http: HttpClient
    ) {
        this.headers = new HttpHeaders();
        this.headers = this.headers.set('Content-Type', 'application/json; charset=utf-8');
    }

    /**
     * Команда серверу
     */
    public sendCommand(commandName:string, params:object, callback: Function) {
        let httpParams = (new HttpParams());
        httpParams = httpParams.append('cmd',  commandName);

        let paramsS = '';
        for (let key in params) {
            httpParams = httpParams.append(key, params[key]);
            paramsS += ' ' + key + '=' + params[key];
        }

        console.log('▶ '+TopSecret.ApiPath + '/' + commandName + ':' + paramsS);

        this.http.post(TopSecret.ApiPath, null, {headers: this.headers, params: httpParams, responseType: 'text'}).subscribe(
            json => {
                console.log('◀ ' + json);
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

        // Проверим авторизацию
        if (input.status) {
            if (input.status.authorized) {
                this.status = SessionStatus.AUTHORIZED;
            } else {
                this.status = SessionStatus.UNAUTHORIZED;
            }
        }

    }

    /**
     * Вызывается при старте приложения. Лезет на сервер, пытается авторизоваться по ключу.
     */
    public startSession()
    {
        this.status = SessionStatus.PENDING;

        const params = (new HttpParams())
            .append('cmd',  'start');

        this.http.post(TopSecret.ApiPath, null, {headers: this.headers, params}).subscribe(
            input => {

            },
            (err: HttpErrorResponse) => {
                console.error(err.error);
            }
        );
    }

    /**
     * Запрашивает с сервера сообщения канала
     */
    public getChannel(channelId: number, lastVieved: string, callback: Function) {
        const params = (new HttpParams())
            .append('cmd',  'get_channel')
            .append('cid',  channelId.toString())
            .append('lv',   lastVieved);

        this.http.post(TopSecret.ApiPath, null, {headers: this.headers, params}).subscribe(
            input => {
                if (callback) {
                    callback(input);
                }
            },
            (err: HttpErrorResponse) => {
                console.error(err.error);
            }
        );
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
    PENDING = 0,
    UNAUTHORIZED = 2,
    AUTHORIZED = 3,
}