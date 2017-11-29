import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class UtilsService {

    constructor() { }

    // snapshotToArray example
    // firebase.database().ref('/posts').on('value', function(snapshot) {
    //     console.log(snapshotToArray(snapshot));
    // });

    snapshotToArray = snapshot => {
        let returnArr = [];

        snapshot.forEach(childSnapshot => {
            let item = childSnapshot.val();
            item.key = childSnapshot.key;
            returnArr.push(item);
        });

        return returnArr;
    };

}
