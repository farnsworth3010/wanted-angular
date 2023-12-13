import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[appImageFallback]',
  standalone: true,
})
export class ImageFallbackDirective {
  @Input() fallbackUrl: string = '../../assets/wanted/anon.png';
  constructor(private elementRef: ElementRef) {}
  @HostListener('error') loadFallback() {
    const el: HTMLImageElement = <HTMLImageElement>(
      this.elementRef.nativeElement
    );
    el.src = this.fallbackUrl;
  }
}
