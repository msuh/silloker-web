import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export interface RecordType {
  value: string;
  displayValue: string;
}

// The object used for search inputs.
export interface SearchableRecord {
  id?: number;
  title?: string[];
  recordType?: string[];
  year1?: number;
  year2?: number;
  month?: number;
  day?: number;
  bookName?: string;
  bookVolume?: string;
  bookNumber?: string;
  content?: string[];
}

// The returned object for a single record entity
export interface RecordEntity {
	id?: number;
	title?: string;
	recordType: string;
	year?: number;
	month?: number;
	day?: number;
	bookName?: string;
	bookVolume?: string;
	bookNumber?: string;
	content?: string;
	originalSourceReference?: string;
	additionalInformation?: string;
	edited: boolean;
}

export interface SearchResult {
  totalCount: number;
  entities: RecordEntity[];
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  constructor(private http: HttpClient) {}

  searchResults: RecordEntity[];
  totalCount = 0;
  // pagination index
  resultPageIndex = 0;
  // configurations for chip list
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  //// html used variables
  isFetching = false;
  errorMessage: string = "";
  selectedRecordTypes = ['WANGJO', 'SECRETARIAT', 'GARRISON'];

  // readonly variables
  recordTypes = ['WANGJO', 'SECRETARIAT', 'GARRISON'];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordInputs: string[] = [];

  readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
  };

  readonly httpDownloadOptions = {
    headers: new HttpHeaders({
      //'Content-Type': 'application/octet-stream',
      'Content-Disposition' : 'attachment',
      'Accept': 'application/octet-stream',
    }),
    responseType: 'blob'
  };

  // Add keyword input box
  addKeywordInput(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.keywordInputs.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  removeKeywordInput(input: string): void {
    const index = this.keywordInputs.indexOf(input);
    if (index >= 0) {
      this.keywordInputs.splice(index, 1);
    }
  }

  recordTypeChanged(event: string[]) {
    this.selectedRecordTypes = event;
  }


  /////////// Methods ///////////

  validateParameters(yearStart: number, yearEnd: number): boolean {
    if (this.isFetching) {
        // Display error 
        this.errorMessage = "Please wait for the system to finish fetching data";
        return false;
     }
     if (yearStart && yearEnd) {
        if (yearStart > yearEnd) {
          this.errorMessage = "Year Start must be less than Year End";
          return false;
        }
        if (yearStart < 1392 || yearEnd > 1910) {
          this.errorMessage = "Year range must be between 1392-1910";
          return false;
        }
     }
    
    return this.keywordValid();
  }
  // Returns true if keyword is in valid form for backend
  keywordValid(): boolean {
    for (let index in this.keywordInputs) {
      if (this.keywordInputs[index] === "") {
        this.errorMessage = "Keyword is not valid";
        return false;
      }

      // Check if keyword contains english
    }

  	// Possibly check for other things? SQL?
    if (this.keywordInputs.length > 5) {
      this.errorMessage = "Provide less than 5 keywords";
      return false;
    }

    if (this.keywordInputs.length == 0) {
      this.errorMessage = "Provide at least one keyword";
      return false;
    }

  	return true;
  }

  searchRecords(yearStart: number, yearEnd: number, pageIndex: number) {
    this.errorMessage = "";
    if (!this.validateParameters(yearStart, yearEnd)) {
      return;
    }

     

    let input: SearchableRecord = { content: this.keywordInputs };
    if (yearStart) {
      input["year1"] = yearStart;
    }
    if (yearEnd) {
      input["year2"] = yearEnd;
    }

    if (this.selectedRecordTypes.length == 0) {
      this.errorMessage = "Select at least one record type to search from";
      return;
    } else if(this.selectedRecordTypes.length !== this.recordTypes.length) {
       // Everything select means we don't have to specify the record type. It will automatically search from all.
       input["recordType"]=this.selectedRecordTypes;
    } 


    this.isFetching = true;
    this.resultPageIndex = pageIndex;

    // Example output search result.
    // this.searchResults = [
    //   {
    //     title: "title1",
    //     recordType: "Garrison",
    //     year: 2020,
    //     month: 10,
    //     day: 10,
    //     bookName: "bookName",
    //     bookVolume: "book Volume",
    //     bookNumber: "book Number",
    //     content: "content",
    //     additionalInformation: "additional Information",
    //     edited: true
    //   },
    //   {
    //     title: "title2",
    //     recordType: "Secretariat",
    //     year: 2020,
    //     month: 10,
    //     day: 13,
    //     bookName: "bookName",
    //     bookVolume: "book Volume",
    //     bookNumber: "book Number",
    //     content: "content bla bla a bunch of content hello bla whats up what sldfj asldjf ;alskdjf laksjdflaskdjflasjdlf jas;ldkfj;laskd jfl;askj dfl;ka sj;dlfk ja bunch of chinese. Let's go let's go lalalal asldkf jasldkfj asldkf jas;lkdfj alskdj falskdfj alskjfas; df;laskdfj a;lskdjf laskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdf skjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdf skjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdf skjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdf skjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdfskjd fl;askjdf ;laskdj f;ladjksfl;as jdf. asd;flk asldfkjsd; lfkjasl;dkfjaslkd fj;alsk jdf.",
    //     additionalInformation: "additional Information",
    //     edited: true
    //   }
    // ]
    this.http.post<SearchResult>("http://localhost:8080/record/search?page="+pageIndex+"&size=50", input, this.httpOptions)
    .subscribe( (response) => {
          //console.log(response);
          this.totalCount = response.totalCount;
          this.searchResults = response.entities;
          this.isFetching = false;
        },
        error => {
            console.log(error);
            this.errorMessage = error.error.error + " " + error.error.message;
            this.isFetching = false;
        }
    );
  }

  downloadRecords(yearStart: number, yearEnd: number) {
  	this.errorMessage = "";
    if (!this.validateParameters(yearStart, yearEnd)) {
      return;
    }

    this.isFetching = true;
    let input: SearchableRecord = {content: this.keywordInputs };
    if (yearStart != null) {
      input["year1"] = yearStart;
    }
    if (yearEnd != null) {
      input["year2"] = yearEnd;
    }

    this.http.post("http://localhost:8080/record/download/search", input, { responseType: 'blob' })
    .subscribe( (response: any) => {
          //const blob = new Blob([response], { type : 'application/octet-stream' } )
          this.isFetching = false;
          const url = URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = "search-results.tsv";
          a.click();
          URL.revokeObjectURL(url);
          
        },
        error => {
            console.log(error);
            this.errorMessage = error.error.error + " " + error.error.message;
            this.isFetching = false;
        }
    );
  }

}
