import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Site } from 'src/app/models/Site';
import { SitesService } from 'src/app/services/sites.service';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css'],
})
export class SitesComponent implements OnInit {
  searchTerm: FormControl;
  sites$: Observable<Site[]>;
  notready: boolean;
  page: number;
  pageSize: number;

  constructor(private sitesService: SitesService) {
    this.searchTerm = new FormControl('');
    this.page = 1;
    this.pageSize = 10;
  }

  /**
   * Get loading state from service
   *
   * @returns boolean
   */
  get loading(): boolean {
    return this.sitesService.loading.bulk;
  }

  ngOnInit() {
    // Initial load
    this.sitesService.loadAll(this.searchTerm.value);

    // Make subscription on observer
    this.sites$ = this.sitesService.sites;
  }
  search(): void {
    this.sitesService.loadAll(this.searchTerm.value);
  }
}
