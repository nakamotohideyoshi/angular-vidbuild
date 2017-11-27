import { AfterViewChecked, AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { EventTargetLike } from 'rxjs/observable/fromEventObservable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/merge';

@Directive({
  selector: '[resizable]'
})
export class ResizableDirective implements AfterViewChecked, AfterViewInit, OnDestroy {

  @Input() public absolute: boolean = false;
  @Output() public widthChange: EventEmitter<WidthChangeEvent> = new EventEmitter();

  private container: HTMLElement;
  private child: HTMLElement;
  private maxDeltaRight: number;
  private maxDeltaLeft: number;
  private maxWidth: number;   // px
  private minWidth: number = 150;   // px
  private mouseEventsSubs: Subscription;
  private resizers: NodeListOf<Element>;
  private startCursorX: number;
  private startPosX: number;
  private startWidth: number;
  private subs: Subscription[] = [];

  private readonly objectiveSelector: string = '[res-objective]';
  private readonly resizerSelector: string = '.resizer';

  constructor(private elRef: ElementRef) { }

  public ngAfterViewInit(): void {
    this.container = <HTMLElement>this.elRef.nativeElement;
    this.resizers = this.container.querySelectorAll(this.resizerSelector);
    this.addListenerMousedown(this.resizers);
  }

  // Adds mouse event listeners to dynamically created children
  public ngAfterViewChecked(): void {
    let resizers: NodeListOf<Element>;
    if ((resizers = this.container.querySelectorAll(this.resizerSelector)).length > this.resizers.length)
      this.updateNewResizers(resizers);
  }

  private updateNewResizers(currElements: NodeListOf<Element> | HTMLCollection): void {
    const currElementsArr = Array.from<Element>(currElements);
    const thisResizersArr = Array.from<Element>(this.resizers);
    const newResizers = currElementsArr.filter(elem => thisResizersArr.indexOf(elem) === -1);
    for (const newResizer of newResizers) this.addListenerMousedown(newResizer);
    this.resizers = currElements;
  }

  private addListenerMousedown(target: EventTargetLike): void {
    this.subs.push(Observable.fromEvent<MouseEvent>(target, 'mousedown')
    .filter(event => event.button === 0)  // Just for main (left) click
    .do(event => this.initResize(event))
    .subscribe());
  }

  private initResize(mEvent: MouseEvent): void {
    const posSelector: string = (<HTMLElement>mEvent.target).getAttribute('data-position');
    if (posSelector !== 'right' && posSelector !== 'left') return;
    const resizeFn: Function = posSelector === 'right' ? this.resizeRight.bind(this) : this.resizeLeft.bind(this);
    this.child = this.getResizableObjective(this.container, <HTMLElement>mEvent.target);
    this.readConfigParameters();
    this.startCursorX = mEvent.clientX;
    this.startWidth = this.child.getBoundingClientRect().width;
    this.startPosX = parseFloat(getComputedStyle(this.child).left);
    const mouseMove$ = Observable.fromEvent<MouseEvent>(window, 'mousemove').do(event => resizeFn(event));
    const mouseUp$ = Observable.fromEvent<MouseEvent>(window, 'mouseup').do(event => this.stopResize(event));
    this.mouseEventsSubs = Observable.merge(mouseMove$, mouseUp$).subscribe();
  }

  private readConfigParameters(): void {
    const maxWidth = this.child.getAttribute('maxWidth');
    const minWidth = this.child.getAttribute('minWidth');
    this.maxWidth = (this.absolute ? Number(maxWidth) : this.percToPx(Number(maxWidth), 'width')) || this.maxWidth;
    this.minWidth = (this.absolute ? Number(minWidth) : this.percToPx(Number(minWidth), 'width')) || this.minWidth;

    const maxDeltaRight = this.child.getAttribute('maxDeltaRight');
    const maxDeltaLeft = this.child.getAttribute('maxDeltaLeft');
    if (maxDeltaRight !== null && maxDeltaRight !== undefined)
      this.maxDeltaRight = (this.absolute ? Number(maxDeltaRight) : this.percToPx(Number(maxDeltaRight), 'width'));
    if (maxDeltaLeft !== null && maxDeltaLeft !== undefined)
      this.maxDeltaLeft = (this.absolute ? Number(maxDeltaLeft) : this.percToPx(Number(maxDeltaLeft), 'width'));
  }

  private resizeRight(mEvent: MouseEvent): void {
    const pointerShift = mEvent.clientX - this.startCursorX;
    let newWidth = this.startWidth + pointerShift;
    const newEndPosX = this.startPosX + newWidth;
    const widthCorrections: number[] = [];
    // Check boundaries (Order is important)
    if (pointerShift > 0 && Math.abs(pointerShift) > this.maxDeltaRight) widthCorrections.push(this.startWidth + this.maxDeltaRight);
    if (newEndPosX > this.container.getBoundingClientRect().width) widthCorrections.push(this.container.getBoundingClientRect().width - this.startPosX);
    if (newWidth > this.maxWidth) widthCorrections.push(this.maxWidth);
    if (newWidth < this.minWidth) newWidth = this.minWidth;
    // Check Collisions
    const closestSiblingR = this.getClosestRightSibling();
    if (closestSiblingR && newEndPosX > parseFloat(getComputedStyle(closestSiblingR).left))
      widthCorrections.push(parseFloat(getComputedStyle(closestSiblingR).left) - this.startPosX);
    // New value assignment
    newWidth = widthCorrections.reduce((prev, curr) => curr < prev ? curr : prev, newWidth);
    this.child.style.width = this.absolute ? `${newWidth}px` : `${this.pxToPerc(newWidth, 'width')}%`;
    this.emitWidthChange(this.child, parseFloat(this.child.style.width), 'right');
  }

  private resizeLeft(mEvent: MouseEvent): void {
    const pointerShift = mEvent.clientX - this.startCursorX;
    let newWidth = this.startWidth - pointerShift;
    let newPosX = this.startPosX + pointerShift;
    const maxPosX = this.startPosX + (this.startWidth - this.minWidth);
    const minPosX = this.startPosX - (this.maxWidth - this.startWidth);
    // Check boundaries
    if (pointerShift < 0 && Math.abs(pointerShift) > this.maxDeltaLeft) {
      newWidth = this.startWidth + this.maxDeltaLeft;
      newPosX = this.startPosX - this.maxDeltaLeft;
    }
    if (newWidth > this.maxWidth) { newWidth = this.maxWidth; newPosX = minPosX; }
    if (newWidth < this.minWidth) { newWidth = this.minWidth; newPosX = maxPosX; }
    if (newPosX < 0) { newPosX = 0; newWidth = this.startWidth + this.startPosX; }
    // Check Collisions
    const closestSiblingL = this.getClosestLeftSibling();
    let siblingLEndPosX: number;
    if (closestSiblingL && newPosX < (siblingLEndPosX = parseFloat(getComputedStyle(closestSiblingL).left) + closestSiblingL.getBoundingClientRect().width)) {
      newPosX = siblingLEndPosX;
      newWidth = this.startWidth + this.startPosX - siblingLEndPosX;
    }
    // New values assignment
    this.child.style.width = this.absolute ? `${newWidth}px` : `${this.pxToPerc(newWidth, 'width')}%`;
    this.child.style.left = this.absolute ? `${newPosX}px` : `${this.pxToPerc(newPosX, 'left')}%`;
    this.emitWidthChange(this.child, parseFloat(this.child.style.width), 'left', parseFloat(this.child.style.left));
  }

  private stopResize(mEvent: MouseEvent) {
    this.mouseEventsSubs.unsubscribe();
  }

  private getDirectChild(el: HTMLElement, innerChild: HTMLElement): HTMLElement {
    const children = <HTMLElement[]>Array.from<Element>(this.container.children);
    for (const child of children)
      if (child.contains(innerChild)) return child;
    return;
  }

  private getResizableObjective(container: HTMLElement, resizer: HTMLElement): HTMLElement {
    const directChild = this.getDirectChild(container, resizer);
    return <HTMLElement>directChild.querySelector(this.objectiveSelector) || directChild;
  }

  private getClosestRightSibling(): HTMLElement {
    const children = <HTMLElement[]>Array.from<Element>(this.container.children);
    const endPosX = this.startPosX + this.startWidth;
    let closest: HTMLElement;
    for (const child of children) {
      const objective = <HTMLElement>child.querySelector(this.objectiveSelector) || child;
      let objectivePosX = parseFloat(getComputedStyle(objective).left);
      if (!this.absolute) ++objectivePosX;  // the +1 is the error tolerance of %, regarding computed style in px
      if (objectivePosX >= endPosX && (!closest || objectivePosX < parseFloat(getComputedStyle(closest).left)))
        closest = objective;
    }
    return closest;
  }

  private getClosestLeftSibling(): HTMLElement {
    const children = <HTMLElement[]>Array.from<Element>(this.container.children);
    let closest: HTMLElement;
    for (const child of children) {
      const objective = <HTMLElement>child.querySelector(this.objectiveSelector) || child;
      let objectiveEndPosX = parseFloat(getComputedStyle(objective).left) + objective.getBoundingClientRect().width;
      if (!this.absolute) --objectiveEndPosX; // the -1 is the error tolerance of %, regarding computed style in px
      if (objectiveEndPosX <= this.startPosX && (!closest || objectiveEndPosX > parseFloat(getComputedStyle(closest).left) + closest.getBoundingClientRect().width))
        closest = objective;
    }
    return closest;
  }

  private emitWidthChange(elem: HTMLElement, width: number, resizer: string, x?: number) {
    const index: number = this.getFirstLevelIndex(this.container.children, elem);
    this.widthChange.emit({ elem, index, width, resizer, x});
  }

  private pxToPerc(px: number, attr: string): number {
    const parentInPx = (attr === 'left' || attr === 'width') && this.container.getBoundingClientRect().width;
    return px * 100 / parentInPx;
  }

  private percToPx(perc: number, attr: string): number {
    const parentInPerc = (attr === 'left' || attr === 'width') && this.container.getBoundingClientRect().width;
    return perc * parentInPerc / 100;
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


export interface WidthChangeEvent {
  elem: HTMLElement;
  index: number;
  width: number;
  x?: number;
  resizer: string;
}
