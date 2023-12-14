import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, } from '@angular/core';
import { WantedService } from '../../../core/services/wanted/wanted.service';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { debounceTime, finalize, switchMap, tap } from 'rxjs';
import { DefaultFieldValuePipe } from '../../../shared/pipes/default-field-value.pipe';

@Component({
  selector: 'app-wanted',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ImageFallbackDirective,
    RouterLink,
    RouterLinkActive,
    MatPaginatorModule,
    DefaultFieldValuePipe
  ],
  templateUrl: './wanted.component.html',
  styleUrl: './wanted.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WantedComponent implements OnInit {
  private readonly debTime = 1000;

  data: any;
  page: number = 0;
  pages: number = 0;
  selectedPerson: any;
  fetching: boolean = true;

  length = 0;
  pageSize = 20;

  handlePageEvent({pageIndex}: PageEvent) {
    this.setPage(pageIndex);
  }

  constructor(
    private wantedService: WantedService,
    private changeDetector: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  selectPerson(id: number): void {
    this.selectedPerson = this.data[id];
  }

  getData() {
    return this.wantedService.getData(this.page + 1)
      .pipe(
      finalize(() => {
        this.fetching = false;
        this.changeDetector.markForCheck();
      })
    );
  }

  setPage(page: number) {
    this.router.navigate(['/content/wanted', page + 1]);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        tap(()=> {
          this.fetching = true;
          this.changeDetector.markForCheck();
        }),
        debounceTime(this.debTime),
        switchMap((map) => {
          this.page = Number(map.get('id')) - 1;
          return this.getData();
        })
      )
      .subscribe((res: any) => {
        this.data = res.items;
        this.pages = res.page;
        this.selectedPerson = this.data[0];
        this.length = res.total;
      })
  }
}
