import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";

import { MessageService, SessionStatus } from '@srv/message.service';
import { Subject } from 'rxjs';

@Injectable()
export class AppGuard implements CanActivate {

    constructor(
        private service: MessageService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | UrlTree | boolean {
        switch (this.service.status) {
            case SessionStatus.AUTHORIZED:
                return true;

            case SessionStatus.UNAUTHORIZED:
                const url = 'guest';
                const tree: UrlTree = this.router.parseUrl(url);
                return tree;
                //return false;

            case SessionStatus.PENDING:
                const subj = new Subject<boolean>()
                let subscription = this.service.statusSubject.subscribe((status: SessionStatus) => {
                    subscription.unsubscribe();
                    switch (status) {

                        case SessionStatus.AUTHORIZED:
                            subj.next(true);
                            subj.complete();
                            break;

                        case SessionStatus.UNAUTHORIZED:
                            this.router.navigate(['/guest']);
                            subj.next(false);
                            subj.complete();
                            break;
                        
                    }
                });
                return subj;
        }
    }
}