import { Directive, ElementRef, HostListener, Input, Renderer2 } from "@angular/core";

@Directive({
  selector: "img[appImageFallback]",
  standalone: true,
})
export class ImageFallbackDirective {
  @Input() fallbackUrl: string = "../../assets/wanted/anon.png";

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}
  @HostListener("error") loadFallback() {
    this.renderer.setAttribute(this.elementRef.nativeElement, "src", this.fallbackUrl);
  }
}
