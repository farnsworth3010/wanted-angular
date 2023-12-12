import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { WantedService } from '../../core/services/wanted/wanted.service';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';
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
    RouterLinkActive
  ],
  templateUrl: './wanted.component.html',
  styleUrl: './wanted.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WantedComponent implements OnInit {
  data: any;
  page: number = 0;
  pages: number = 0;
  selectedPerson: any;
  fetching: boolean = true;
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
    this.fetching = true;
    this.wantedService.getData(this.page).subscribe((res: any) => {
      this.data = res.items;
      this.pages = res.total;
      this.selectedPerson = this.data[0];
      this.fetching = false;
      this.initPaginator();
      this.changeDetector.detectChanges();
    });
  }
  setPage(page: number) {
      this.page = page;
      this.getData()
  }
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.page = id ? +id : 1;
    this.getData();
  }
  prevPage() {
    if (this.page > 1) {
      this.page -= 1;
      this.getData();
    }
  }
  paginator: any = [];
  initPaginator() {
    const pagesArr = [];
    pagesArr.push(this.page);
    for (let i = this.page + 1; i < this.page + 4 && i < this.pages; ++i) {
      pagesArr.push(i);
    }
    for (let i = this.page - 1; i > this.page - 4 && i > 1; --i) {
      pagesArr.unshift(i);
    }
    if (!pagesArr.includes(1)) {
      pagesArr.unshift(1);
    }
    if (!pagesArr.includes(this.pages)) {
      pagesArr.push(this.pages);
    }
    this.paginator = pagesArr;
  }
  nextPage() {
    if (this.page < this.pages) {
      this.page += 1;
      this.getData();
      this.router.navigate(['/wanted', this.page]);
    }
  }
}
