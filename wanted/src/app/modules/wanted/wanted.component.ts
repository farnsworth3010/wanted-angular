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
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-wanted',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
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
  constructor(
    private wantedService: WantedService,
    private changeDetector: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {}
  selectPerson(id: number): void {
    this.selectedPerson = this.data[id];
  }
  getData() {
    this.wantedService.getData(this.page).subscribe((res: any) => {
      this.data = res.items;
      this.pages = res.total;
      this.data.unshift({
        title: 'EGOR ASIEVSKIY',
        sex: 'Male',
        eyes: 'brown',
        hair: 'black',
        race: 'white',
        caution: 'high angular knowledge, trash javascript questions',
        reward_text: '$10000',
        images: [
          {
            original: '',
          },
        ],
      });
      this.selectedPerson = this.data[0];
      this.changeDetector.detectChanges();
    });
  }
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.page = id ? +id : 1;
    this.getData()
  }
  prevPage() {
    if (this.page > 1) {
      this.page -= 1;
      this.getData()
    }
  }
  nextPage() {
    if (this.page < this.pages) {
      this.page += 1;
      this.getData()
    }
  }
}
