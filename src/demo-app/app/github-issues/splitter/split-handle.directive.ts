import {Directive, ElementRef, Inject, Output} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';

import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';

@Directive({
  selector: '[ngxSplitHandle]',
  host: {
    class: 'ngx-split-handle',
    title: 'Drag to resize'
  }
})
export class SplitHandleDirective {

  @Output() drag: Observable<{ x: number, y: number }>;

  constructor(ref: ElementRef, @Inject(DOCUMENT) _document: any) {
    const fromEvent = Observable.fromEvent;
    const getMouseEventPosition = (event: MouseEvent) => ({x: event.movementX, y: event.movementY});

    const mousedown$ = fromEvent(ref.nativeElement, 'mousedown').map(getMouseEventPosition);
    const mousemove$ = fromEvent(_document, 'mousemove').map(getMouseEventPosition);
    const mouseup$ = fromEvent(_document, 'mouseup').map(getMouseEventPosition);

    this.drag = mousedown$.switchMap(_ => mousemove$.takeUntil(mouseup$));
  }

}
