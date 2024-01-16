import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img[appImageFallback]',
  standalone: true,
})
export class ImageFallbackDirective {
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  @Input() fallbackUrl: string = '../../assets/wanted/anon.png';

  @HostListener('error') loadFallback(): void {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'src', this.fallbackUrl);
  }
}
