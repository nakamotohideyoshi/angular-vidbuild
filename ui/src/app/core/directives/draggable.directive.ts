import { AfterViewChecked, AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { EventTargetLike } from 'rxjs/observable/fromEventObservable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/filter';

@Directive({
  selector: '[draggable]'
})
export class DraggableDirective implements AfterViewChecked, AfterViewInit, OnDestroy {

  @Input() public absolute: boolean = false;
  @Output() public posChange: EventEmitter<PosChangeEvent> = new EventEmitter();

  private container: HTMLElement;
  private child: HTMLElement;
  private children: NodeListOf<Element>;
  private isOverSibling: boolean;
  private overFromDirection: string;  // 'left' | 'right'
  private mouseEventsSubs: Subscription;
  private movEnabled: boolean = true;
  private startCursorX: number;
  private startPosX: number;
  private subs: Subscription[] = [];
  private underneathSibling: HTMLElement;

  private animationEnd$: Subject<undefined>;
  private afterAnimationQueue: Function[] = [];

  private readonly objectiveSelector: string = '[drag-objective]';

  constructor(private elRef: ElementRef) {
    this.animationEnd$ = new Subject<undefined>();
    this.subs.push(
      this.animationEnd$.do(() => {
        for (const i = 0; i < this.afterAnimationQueue.length; ) {
          this.afterAnimationQueue[i]();
          this.afterAnimationQueue.splice(0, 1);
        }
      }).subscribe());
  }

  public ngAfterViewInit(): void {
    this.container = <HTMLElement>this.elRef.nativeElement;
    this.children = this.container.querySelectorAll(this.objectiveSelector) || this.container.children;
    this.addListenerMousedown(this.children);
  }

  // Adds mouse event listeners to dynamically created children
  public ngAfterViewChecked(): void {
    let objectiveElems: NodeListOf<Element>;
    if ((objectiveElems = this.container.querySelectorAll(this.objectiveSelector)).length > this.children.length)
      this.updateNewChildren(objectiveElems);
    else if (this.container.childElementCount > this.children.length)
      this.updateNewChildren(this.container.children);
  }

  private updateNewChildren(currElements: NodeListOf<Element> | HTMLCollection): void {
    const currElementsArr = Array.from<Element>(currElements);
    const childrenArr = Array.from<Element>(this.children);
    const newChildren = currElementsArr.filter(elem => childrenArr.indexOf(elem) === -1);
    for (const newChild of newChildren) this.addListenerMousedown(newChild);
    this.children = currElements;
  }

  private addListenerMousedown(target: EventTargetLike): void {
    this.subs.push(Observable.fromEvent<MouseEvent>(target, 'mousedown')
    .filter(event => event.button === 0)  // Just for main (left) click
    .do(event => this.initDrag(event))
    .subscribe());
  }

  private initDrag(mEvent: MouseEvent): void {
    this.child = <HTMLElement> mEvent.currentTarget;
    this.startCursorX = mEvent.clientX;
    this.startPosX = parseInt(getComputedStyle(this.child).left);
    const mouseMove$ = Observable.fromEvent<MouseEvent>(window, 'mousemove').do(event => this.drag(event));
    const mouseUp$ = Observable.fromEvent<MouseEvent>(window, 'mouseup').do(event => this.stopDrag(event));
    this.mouseEventsSubs = Observable.merge(mouseMove$, mouseUp$).subscribe();
  }

  private drag(mEvent: MouseEvent): void {
    let newPosX = this.startPosX + mEvent.clientX - this.startCursorX;
    const newEndPosX = newPosX + this.child.offsetWidth;
    // Check boundaries
    if (newEndPosX > this.container.offsetWidth) newPosX = this.container.offsetWidth - this.child.offsetWidth;
    if (newPosX < 0) newPosX = 0;
    // Check Collisions
    if (this.isOver(newPosX, newEndPosX, mEvent) && this.isOverPastHalf(newPosX, newEndPosX, this.underneathSibling) && this.movEnabled)
      this.moveUnderneathSibling(newPosX, newEndPosX, this.underneathSibling);
    // New values assignment
    this.child.style.left = this.absolute ? `${newPosX}px` : `${this.pxToPerc(newPosX, 'left')}%`;
    this.emitPosChange(this.child, parseFloat(this.child.style.left));
  }

  private isOver(posX: number, endPosX: number, mEvent: MouseEvent): boolean {
    const children = <HTMLElement[]>Array.from<Element>(this.container.querySelectorAll(this.objectiveSelector) || this.container.children);
    const newUnderneathSibling = children.find(sibling => {
      const siblingPosX = parseInt(getComputedStyle(sibling).left);
      return !this.child.isSameNode(sibling) &&
        ((endPosX > siblingPosX && endPosX <= siblingPosX + sibling.offsetWidth) ||
        (posX >= siblingPosX && posX < siblingPosX + sibling.offsetWidth) ||
        (posX <= siblingPosX && endPosX >= siblingPosX + sibling.offsetWidth));
    });

    // If it wasn't over a sibling and now it is, the direction is set.
    if (!this.isOverSibling && newUnderneathSibling)
    // if (newUnderneathSibling !== this.underneathSibling || (newUnderneathSibling && !newUnderneathSibling.isSameNode(this.underneathSibling)))
      this.overFromDirection = mEvent.movementX >= 0 ? 'right' : 'left';
    if (!newUnderneathSibling) this.overFromDirection = undefined;

    return this.isOverSibling = !!(this.underneathSibling = newUnderneathSibling);
    /** @todo It should be taken into account when the movement is so fast that some siblings are left in the middle.*/
  }

  private isOverPastHalf(posX: number, endPosX: number, underneathSibling: HTMLElement): boolean {
    const siblingPosX = parseInt(getComputedStyle(underneathSibling).left);
    const siblingWidth = underneathSibling.offsetWidth;
    if (this.overFromDirection === 'right') return endPosX > siblingPosX + siblingWidth / 2;
    if (this.overFromDirection === 'left') return posX < siblingPosX + siblingWidth / 2;
    return false;
  }

  private moveUnderneathSibling(posX: number, endPosX: number, underneathSibling: HTMLElement): void {
    const startSiblingPosX = parseInt(getComputedStyle(underneathSibling).left);
    let newSiblingPosX: number;

    if (this.overFromDirection === 'right') {
      newSiblingPosX = startSiblingPosX - this.child.offsetWidth;
      // Check left boundary
      if (newSiblingPosX < 0) newSiblingPosX = 0;

      this.overFromDirection = 'left';

    } else if (this.overFromDirection === 'left') {
      newSiblingPosX = startSiblingPosX + this.child.offsetWidth;
      // Check right boundary
      if (newSiblingPosX + underneathSibling.offsetWidth > this.container.offsetWidth)
        newSiblingPosX = this.container.offsetWidth - underneathSibling.offsetWidth;

        this.overFromDirection = 'right';
    }

    // this.animateXMovement(underneathSibling, newSiblingPosX, 15, 30);
    this.animateXMovement(underneathSibling, newSiblingPosX, 10, 50).then(() => {
      this.emitPosChange(underneathSibling, parseFloat(underneathSibling.style.left));
    }); // lower time would imply modification in animation
  }

  private relocateChild(): void {
    const siblingPosX = parseInt(getComputedStyle(this.underneathSibling).left);
    let endPosX: number;
    this.child.style.zIndex = '100';

    if (this.overFromDirection === 'right')
      endPosX = siblingPosX - this.child.offsetWidth;
    if (this.overFromDirection === 'left')
      endPosX = siblingPosX + this.underneathSibling.offsetWidth;

    this.animateXMovement(this.child, endPosX).then(() => {
      this.child.style.zIndex = '';
      this.isOverSibling = false;
      this.overFromDirection = undefined;
      this.emitPosChange(this.child, parseFloat(this.child.style.left));
    });
  }

  /** @todo Enhance with Observables */
  private animateXMovement(elem: HTMLElement, finalPosX: number, time: number = 10, step: number = 10): Promise<undefined> {
    const startPosX = parseInt(getComputedStyle(elem).left);
    let x = startPosX;
    this.movEnabled = false;

    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (startPosX > finalPosX) {
          x -= step;
          x = x < finalPosX ? finalPosX : x;
        }
        if (startPosX < finalPosX) {
          x += step;
          x = x > finalPosX ? finalPosX : x;
        }
        elem.style.left = this.absolute ? `${x}px` : `${this.pxToPerc(x, 'left')}%`;
        if (x === finalPosX) {
          clearInterval(interval);
          this.movEnabled = true;
          this.animationEnd$.next();
          resolve();
        }
      }, time);
    });
  }

  private stopDrag(mEvent: MouseEvent) {
    this.mouseEventsSubs.unsubscribe();
    if (this.isOverSibling) {
      this.movEnabled ? this.relocateChild() : this.afterAnimationQueue.push(this.relocateChild.bind(this));
    }
  }

  private pxToPerc(px: number, attr: string): number {
    const parentInPx = (attr === 'left' || attr === 'width') && this.container.getBoundingClientRect().width;
    return px * 100 / parentInPx;
  }

  private emitPosChange(elem: HTMLElement, x: number) {
    const index: number = this.getFirstLevelIndex(this.children, elem);
    this.posChange.emit({ elem, index, x});
  }

  private getFirstLevelIndex(list: NodeListOf<Element> | HTMLCollection, elem: HTMLElement): number {
    for (let i = 0; i < list.length; ++i)
      if (list.item(i).contains(elem)) return i;
    return;
  }

  public ngOnDestroy(): void {
    this.subs.forEach(e => e.unsubscribe());
  }
}


export interface PosChangeEvent {
  elem: HTMLElement;
  index: number;
  x: number;
}
