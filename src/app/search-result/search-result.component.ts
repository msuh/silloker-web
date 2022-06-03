import { Component, OnChanges, Input } from '@angular/core';
import { RecordEntity } from '../search/search.component';

@Component({
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnChanges {
  displayedColumns: string[] = ['title', 'recordType', 'date', 'book', 'content'];

  @Input() searchResults: RecordEntity[] = [];

  constructor() { }

  ngOnChanges(): void {
  	// console.log(this.searchResults);
  }

}