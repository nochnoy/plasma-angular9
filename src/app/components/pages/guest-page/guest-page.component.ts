import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'guest-page',
  templateUrl: './guest-page.component.html',
  styleUrls: ['./guest-page.component.scss']
})
export class GuestPageComponent implements OnInit {

    constructor() { }

    ngOnInit() {

    }

}
