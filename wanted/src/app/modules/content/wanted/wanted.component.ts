import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { WantedService } from '../../../core/services/wanted/wanted.service';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { Subject, debounceTime } from 'rxjs';
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
  ],
  templateUrl: './wanted.component.html',
  styleUrl: './wanted.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WantedComponent implements OnInit {
  private getDataSubject = new Subject();
  private readonly debTime = 1000;

  data: any;
  page: number = 0;
  pages: number = 0;
  selectedPerson: any;
  fetching: boolean = true;

  length = 0;
  pageSize = 20;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.page = e.pageIndex;
    this.setPage(e.pageIndex);
    this.fetching = true;
  }

  constructor(
    private wantedService: WantedService,
    private changeDetector: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  selectPerson(id: number): void {
    this.selectedPerson = this.data[id];
  }
  getData() {
    this.wantedService.getData(this.page + 1).subscribe((res: any) => {
      this.data = res.items;
      this.pages = res.page;
      this.selectedPerson = this.data[0];
      this.fetching = false;
      this.length = res.total;
      this.changeDetector.detectChanges();
    });
  }
  setPage(page: number) {
    this.page = page;
    this.router.navigate(['/content/wanted', page + 1]);
    this.getDataSubject.next(page);
  }
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.page = id ? +id - 1 : 0;
    this.getDataSubject.pipe(debounceTime(this.debTime)).subscribe(() => {
      this.getData();
    });
    this.getDataSubject.next(this.page);
  }
}
