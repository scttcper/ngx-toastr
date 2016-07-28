import {
  Directive,
  Component,
  HostBinding,
  EventEmitter,
  Host,
  Attribute,
  Output,
  ContentChildren,
  QueryList,
  ElementRef,
  Renderer,
} from '@angular/core';

@Directive({
  selector: '.dropdown-item:not(.disabled)',
})
export class DropdownItem {

  constructor(
    private el: ElementRef,
    private renderer: Renderer
  ) {}
  focus() {
    this.renderer.invokeElementMethod(this.el.nativeElement, 'focus');
  }
}
