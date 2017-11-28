import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ObservableInput } from 'rxjs/Observable';
import { AuthService } from './../../auth/providers/auth.service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import * as _ from "lodash";

@Injectable()
export class EditorService {
    userId: string;
    currentProject: any;
    currentProjectQueue: any;
    clips: any[] = [];
    constructor(
        private db: AngularFireDatabase,
        private afAuth: AngularFireAuth,
        public AuthService: AuthService
    ) {
        this.AuthService.currentUserObservable.subscribe((auth: any) => {
            console.log('eeeeeeeeeeeeeee:', auth);
            this.getCurrentProyect(this.AuthService.currentUserId);
            this.getCurrentProyectQueue(this.AuthService.currentUserId);
        });
    }

    uploadResources() {
        return this.db.object(`users-current-project/${this.AuthService.currentUserId}`)
            .update({ status: "validating" });
    }

    getClips() {
        this.db.list(`users-current-project/${this.AuthService.currentUserId}/clips`)
            .snapshotChanges()
            .subscribe((clips: any) => {
                this.clips = [];
                clips.forEach(clip => {
                    let newClip = Object.assign({}, clip.payload.val(), { fkey: clip.key });
                    console.log(clip.payload.val());
                    this.clips.push(newClip);
                  });
            })
    }


    getCurrentProyect(userId) {
        return this.db.object(`users-current-project/${this.AuthService.currentUserId}/`)
            .valueChanges()
            .subscribe((data: any) => {
                if (data) {
                    console.log(data)
                    this.currentProject = data;
                    if (data && data.clips) {
                        this.getClips();
                    }
                }
            });
    }

    getCurrentProyectQueue(userId) {
        return this.db.object(`users-files-queue/${this.AuthService.currentUserId}/`)
            .valueChanges()
            .subscribe((data) => {
                console.log(data)
                this.currentProjectQueue = data;
            })
    }

    addFile(type, file, provider, stockID) {
        console.log('video added to: ' + this.AuthService.currentUserId);
        return this.db.list(`users-current-project/${this.AuthService.currentUserId}/files`)
            .push({ type: type, file: file, provider: provider, stockID: stockID, status: 'pending' });

    }

    // removeFile(type, file){
    //     this.db.list(`users-current-project/${this.userId}/files`).remove()   
    // }

    build(type) {
        this.db.object(`users-current-project/${this.AuthService.currentUserId}`)
            .update({
                type: type,
                exporting: true,
                status: 'validating'
            })
    }

    createClip(clip) {
        clip["projectId"] = this.currentProject.OpenSId;
        this.db.list(`users-current-project/${this.AuthService.currentUserId}/clips`)
            .push(clip)
    }

    updateClip(clipId) {
        let updatedClip = _.filter(this.clips, { 'fkey': clipId });
        console.log(updatedClip[0])
        this.db.object(`users-current-project/${this.AuthService.currentUserId}/clips/${clipId}`)
            .update(updatedClip[0])
    }

}
