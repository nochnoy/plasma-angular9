import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'forum-page',
  templateUrl: './forum-page.component.html',
  styleUrls: ['./forum-page.component.scss']
})
export class ForumPageComponent implements OnInit {

    public forumId: number;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.pipe(map(p => p.id))
            .subscribe((id: any) => {
            this.forumId = parseInt(id) || 0;
        });
    }

}
