import { Component, Input } from '@angular/core';

import { vbuild } from '../../../core/model/classes';

@Component({
  selector: '[vid-svg-text-box]',
  templateUrl: './vid-svg-text-box.component.html',
  styleUrls: ['./vid-svg-text-box.component.scss']
})
export class VidSvgTextBoxComponent {

  @Input() public x: number;
  @Input() public y: number;
  @Input() public backgroundColor: string;
  @Input() public color: string;
  @Input() public fontSize: number;
  @Input() public fontFamily: string;

  public textGroup: TextGroup = new TextGroup();

  constructor() {
    this.textGroup.rect.x = 48;
    this.textGroup.rect.y = 42;
    this.textGroup.text.x = 50;
    this.textGroup.text.y = 50;
  }
}


class TextGroup {
  public id: number;
  public rect: RectBox = new RectBox();
  public text: TextBox = new TextBox();

  constructor() { }
}

class RectBox {

  public x?: number;
  public y?: number;
  public width?: number = 200;
  public height?: number = 40;
  public fill?: string = 'black';
  public opacity?: number = 1;

  constructor() { }
}

class TextBox {

  public x?: number;
  public y?: number;
  public fontSize?: number = 28;
  public fontFamily?: string = 'Arial';
  public fill?: string = 'white';

  constructor() { }
}