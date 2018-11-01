import { Directive, Renderer, ElementRef } from '@angular/core';

@Directive({
  selector: '[autohide]', // Attribute selector
  host: {
    '(ionScroll)': 'onContentScroll($event)',
  }
})
export class AutohideDirective {

  fabToHide;
  topPosition: number = 0;

  constructor(
    private renderer: Renderer,
    private element: ElementRef) {
    console.log('Hello AutohideDirective Directive');
  }

  ngOnInit() {
    this.fabToHide = this.element.nativeElement.querySelector('.fab');
    this.renderer.setElementStyle(this.fabToHide, 'opacity', '0');
  }

  onContentScroll(e) {
    if(e.scrollTop - this.topPosition == 0) {
      this.renderer.setElementStyle(this.fabToHide, 'opacity', '0');
    }
    else {
      this.renderer.setElementStyle(this.fabToHide, 'opacity', '1');
    }
  }

}
