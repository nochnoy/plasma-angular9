import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Message } from '../model/message.model';
import { TopSecret } from '../model/top-secret';

@Injectable()
export class MessageService {

    public colorBg = '#F4E5D7';
    public colorText = '#313e41';
    public colorDigest = '#ADA99A';

    private headers: HttpHeaders;
    
    constructor(
        private http: HttpClient
    ) {
        this.headers = new HttpHeaders();
        this.headers = this.headers.set('Content-Type', 'application/json; charset=utf-8');
    }

    /**
     * Запрашивает с сервера сообщения канала
     */
    public getChannel(channelId:number, lastVieved:string, callback:Function) 
    {
        const params = (new HttpParams())
            .append("cmd",  "get_channel")
            .append("cid",  channelId.toString())
            .append("lv",   lastVieved);

        this.http.post(TopSecret.ApiPath, null, {headers: this.headers, params:params}).subscribe(            
            input => {
                this.logInput(input);
                if (callback)
                    callback(input);
            },
            (err: HttpErrorResponse) => {
                console.error(err.error);
            }
        )
    }

    /**
     * Запрашивает с сервера сообщения одного треда
     */
    public getThread(threadId:number, lastVieved:string, callback:Function) 
    {
        const params = (new HttpParams())
            .append("cmd",  "get_thread")
            .append("tid",  threadId.toString())
            .append("lv",   lastVieved);

        this.http.post(TopSecret.ApiPath, null, {headers: this.headers, params:params}).subscribe(            
            input => {
                this.logInput(input);
                if (callback)
                    callback(input);
            },
            (err: HttpErrorResponse) => {
                console.error(err.error);
            }
        )
    }

    private logInput(input:object) {
        console.log('⯇ ' + JSON.stringify(input));
    }

}