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
        this.getCurrentProyect(this.AuthService.currentUserId);
    }


    getCurrentProyect(userId) {
        return this.db.object(`users-current-project/${this.AuthService.currentUserId}`)
            .valueChanges()
            .subscribe((data) => {
                this.currentProject = data;
            })
    }

    addFile(type, file) {
      alert('video added' + this.AuthService.currentUserId);
      return this.db.list(`users-current-project/${this.AuthService.currentUserId}/projectData/files`)
        .push({type: type, file: file});
    }
    // removeFile(type, file){
    //     this.db.list(`users-current-project/${this.userId}/projectData/files`).remove()
    // }

    build(type) {
        this.db.object(`users-current-project/${this.AuthService.currentUserId}`)
            .update({
                type: type,
                status: 'validating'
            })
    }

}
