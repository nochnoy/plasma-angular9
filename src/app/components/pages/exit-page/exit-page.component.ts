import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { MessageService } from '@app/services/message.service';

@Component({
  selector: 'exit-page',
  templateUrl: './exit-page.component.html',
  styleUrls: ['./exit-page.component.scss']
})
export class ExitPageComponent implements OnInit {

    constructor(
        private service: MessageService,
    ) { }

    ngOnInit() {
        setTimeout(() => {
            this.service.logOut();
        }, 500);
    }

}
