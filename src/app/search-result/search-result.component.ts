import { Component, Input, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { RecordEntity } from '../search/search.component';

@Component({
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent {
  displayedColumns: string[] = ['title', 'recordType', 'date', 'book', 'content'];

  @Input() searchResults: RecordEntity[] = [];
  @Input() keywordInputs: string[] = [];

  @ViewChildren("content") contents: QueryList<ElementRef>;

  constructor() { }

  ngAfterViewInit(): void {
    this.colorKeyword();
  }
  public colorKeyword(): void {
    for (let content of this.contents) {
      let text = content.nativeElement.innerHTML;
      for (let keyword of this.keywordInputs) {
        if (content.nativeElement.innerHTML.includes(keyword)) {
          text = text.replaceAll(keyword, 
            '<span style="color:red;font-weight:bold;">' + keyword + "</span>");
        }
      }
      content.nativeElement.innerHTML = text;
    }
  }
}