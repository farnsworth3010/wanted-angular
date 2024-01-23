import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavContent } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-go-top',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './go-top.component.html',
  styleUrl: './go-top.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoTopComponent implements OnInit {
  constructor(private destroyRef: DestroyRef, private changeDetector: ChangeDetectorRef, private router: Router) {}

  @Input() scrollElement!: MatSidenavContent;

  scroll(): void {
    this.scrollElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  show: boolean = false;

  ngOnInit(): void {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      if (value instanceof NavigationEnd) {
        this.show = false;
      }
    });
    this.scrollElement
      .elementScrolled()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.show = this.scrollElement.getElementRef().nativeElement.scrollTop > 200;
        this.changeDetector.detectChanges();
      });
  }
}
