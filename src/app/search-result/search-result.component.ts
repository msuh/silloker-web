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

//	id: number;
//	title: string;
//	recordType: string;
//	year: number;
//	month: number;
//	day: number;
//	bookName: string;
//	bookVolume: string;
//	bookNumber: string;
//	content: string;
//	originalSourceReference: string;
//	additionalInformation: string;
//	edited: boolean;