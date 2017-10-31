import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ObservableInput } from 'rxjs/Observable';
import { AuthService } from './../../auth/providers/auth.service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

@Injectable()
export class EditorService {
    userId: string;
    currentProject: any;
    constructor(
        private db: AngularFireDatabase,
        private afAuth: AngularFireAuth,
        public AuthService: AuthService
    ) {
        this.AuthService.currentUserObservable.subscribe(user => {
            if (user) {
                this.userId = user.uid;
                this.getCurrentProyect(this.userId);
            }
        })
    }


    getCurrentProyect(userId) {
        this.db.object(`users-current-project/${userId}`)
            .valueChanges()
            .subscribe((data) => {
                this.currentProject = data;
            })
    }

    addFile(type, url){
        this.db.list(`users-current-project/${this.userId}/projectData/files`)
        .push({ type: type, url: url })
    }

    build(type) {
        this.db.object(`users-current-project/${this.userId}`)
            .update({
                type: type,
                status: 'validating'
            })
    }

}
