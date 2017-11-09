import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-multi-search',
  templateUrl: './multi-search.component.html',
  styleUrls: ['./multi-search.component.scss']
})
export class MultiSearchComponent implements OnInit {

  public searchItem: String = '';
  public searchItemList: any = [];

  constructor() { }

  ngOnInit() {
  }

  addSearchItem() {
    if (this.searchItem.length && this.searchItemList.length !== 5) {
      this.searchItemList.push(this.searchItem);
    }
    this.searchItem = '';
  }

  deleteSearchItem(i) {
    this.searchItemList.splice(i, 1);
  }

  keyEvent(event) {
    if (event.keyCode === 32) {
      this.searchItem = this.searchItem.replace(' ', '');
      console.log(this.searchItemList);
      console.log(this.searchItem);
      this.addSearchItem();
    }
  }

}
