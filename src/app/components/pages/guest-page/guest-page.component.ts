import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { MessageService } from '@app/services/message.service';

@Component({
  selector: 'guest-page',
  templateUrl: './guest-page.component.html',
  styleUrls: ['./guest-page.component.scss']
})
export class GuestPageComponent implements OnInit {

    constructor(
        private service: MessageService,
    ) { }

    public loginValue: string = 'marat';
    public passwordValue: string = 'parolchegdlyaplazmy';

    ngOnInit() {

    }

    onSubmit() {
        this.service.login(this.loginValue, this.passwordValue);
    }

}
