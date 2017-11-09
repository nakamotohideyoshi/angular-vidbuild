import { Injectable } from '@angular/core';

@Injectable()

export class MultiSearchSerivice {

  // public searchItem: String = '';
  public searchItemList: any = [];

  constructor() { }

  addSearchItem(item) {
    if (item.length && this.searchItemList.length !== 5) {
      this.searchItemList.push(item);
    }
  }

  deleteSearchItem(item) {
    this.searchItemList.splice(item, 1);
  }

  // keyEvent(event) {
  //   if (event.keyCode === 32) {
  //     this.searchItem = this.searchItem.replace(' ', '');
  //     console.log(this.searchItemList);
  //     console.log(this.searchItem);
  //     this.addSearchItem();
  //   }
  // }
}
