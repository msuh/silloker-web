import { Component, ComponentFactory, ComponentFactoryResolver,  ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { SearchableRecord, RecordType } from '../search/search.component';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, throwError, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// DEPRECATED
export interface KeywordInputAndAggregationV1 {
  // The list of keywords to query the count by year
  // Ex. ["keyword0", "keyword1"]
  keywords: string[];
  // The aggregation of the count of records that contains the keyword by year by keyword index
  // Ex. [
  //   0: [ {year: 1626, count: 3}, {year: 1650, count: 5}, ... ] // keyword0
  //   1: [ {year: 1627, count: 2}, {year: 1650, count: 1}, ... ] // keyword1
  // ]
  aggregation: KeywordAggregation[][];
  // The total count total number of records per year per record type
  // Ex. [
  //   "garrison": [ {year: 1400, count: 812}, ...]
  // ]
  totalRecordCount: KeywordAggregation[][];
}

export interface KeywordInputAndAggregationV2 {
  // The list of keywords to query the count by year
  // Ex. ["keyword0", "keyword1"]
  keywords: string[];
  // The aggregation of the count of records that contains the keyword by year by keyword index
  // Ex. [
  //   0: [ {year: 1626, count: 3}, {year: 1650, count: 5}, ... ] // keyword0
  //   1: [ {year: 1627, count: 2}, {year: 1650, count: 1}, ... ] // keyword1
  // ]
  aggregation: KeywordAggregation[][];
  // Whether to graph this as a secondary graph in the same svg.
  graphAsSecondary: boolean;
  // The id of the graph selector.
  graphSelector: string;
  // Whether the represented number should be treated as a percentage
  isPercentage: boolean;
}

// Example Keywords to Search: 鳥銃, 火藥, 焰硝
// The output of the aggregation API that returns the number of counts per western year.
export interface KeywordAggregation {
  // The western year
  year: number;
  // The count of the keyword for the year of year
  count: number;
}

@Component({
  selector: 'app-aggregation',
  templateUrl: './aggregation.component.html',
  styleUrls: ['./aggregation.component.css']
})
export class AggregationComponent {
  // configurations for chip list
	visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;  
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordInputs: string[] = [];
  
  readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept': 'application/json',
    })
  };

  //// html used variables
  searchKeyword: string;
  isFetching = false;
  errorMessage: string = "";
  selectedRecordTypes = ['WANGJO', 'SECRETARIAT', 'GARRISON'];

  // readonly variables
  // TODO: Create a common class to export shared data and structure.
  recordTypes = ['WANGJO', 'SECRETARIAT', 'GARRISON'];
  
  // types: RecordType[] = [
  //   {value: 'all', displayValue: 'All'},
  //   {value: 'WANGJO', displayValue: '왕조실록 Wangjo Sillok'},
  //   {value: 'GARRISON', displayValue: '군영등록 Garrison'},
  //   {value: 'SECRETARIAT', displayValue: '승정원일기 Secretarit'}
  // ];

  // keyword list to submit to draw the graph
  //outputAggregation: KeywordAggregation[][] = [];
  keywordOutput: KeywordInputAndAggregationV2;
  recordRatioOutput: KeywordInputAndAggregationV2;
  // The output for total record Count. 
  recordCountOutput: KeywordInputAndAggregationV2;

  constructor(
  	private readonly resolver: ComponentFactoryResolver,
    private http: HttpClient,
  ) {}

  // Submits request to graph the trends for a set of keywords
  graphAggregation(): void {
      this.errorMessage = "";

      if (this.isFetching) {
        // Display error 
        this.errorMessage = "Please wait for the system to finish fetching data";
        return;
      }
      if (this.keywordInputs.length == 0) {
        // error: You must provide at lesat one keyword
        this.errorMessage = "Provide at least one keyword";
        return;
      } else if (this.keywordInputs.length > 4) {
        // error: You can't pass more than 5 keywords
        this.errorMessage = "Provide less than four keyword";
        return;
      }

      this.isFetching = true;
      
      // Accumulates the query list for the keywords
      let queryList = {};
      for (let inputIndex in this.keywordInputs) {
          let input: SearchableRecord = {recordType: this.selectedRecordTypes, content: [this.keywordInputs[inputIndex]] };
          queryList[inputIndex] = this.http.post<KeywordAggregation[]>("http://localhost:8080/record/aggregation", input, this.httpOptions);
      }

      // We also query the number of total entries for each record type that's searched within.
      for(let type of this.selectedRecordTypes) {
        queryList[type] = this.http.get<KeywordAggregation[]>("http://localhost:8080/record/aggregation/" + type);
      }
      

      // forkJoin collects all the queries that only fires the subscribed reaction when all quries finish executing.
      forkJoin(queryList)
      .subscribe( (response) => {
        console.log(response);
        // this.outputAggregation = [
        //  [ {year: 1626, count: 3}, {year: 1627, count: 2}, {year: 1635, count: 1}, {year: 1637, count: 8}, {year: 1700, count: 9} ],
        //  [ {year: 1626, count: 4}, {year: 1627, count: 5}, {year: 1635, count: 4}, {year: 1637, count: 7}, {year: 1702, count: 4} ],
        //  [ {year: 1626, count: 1}, {year: 1627, count: 3}, {year: 1636, count: 2}, {year: 1638, count: 2}, {year: 1701, count: 2} ]
        // ];
          let outputAggregation = [];
          for (let inputIndex in this.keywordInputs) {
            outputAggregation.push(response[inputIndex]);
          }

          // The implementation detail heavily replies on this being in the order they expect it to be by record type.
          let countByRecordType = [];
          for (let type of this.selectedRecordTypes) {
            if (response[type] != null) {
              countByRecordType.push(response[type]);
            }  
          }

          let combinedRecordCount = [];
          for (var i = 1392; i <= 1910; i++) {
            let outputSum = 0, recordSum = 0;
            // count = [ {year: 1626, count: 3}, {year: 17000, count: 10}, ... ]
            for (let keyword of outputAggregation) {
              for (let count of keyword) {
                if (count.year == i) {
                  outputSum += count.count;
                  break;
                } else if (count.year > i) {
                  break;
                }
              }
            }
            for (let type of countByRecordType) {
              for (let count of type) {
                if (count.year == i) {
                  recordSum += count.count;
                  break;
                } else if (count.year > i) {
                  break;
                }
              }
            }
            combinedRecordCount.push({"year":i, "count": outputSum/recordSum});
          }
          // for (let type in this.selectedRecordTypes) {
          //   outputAggregation.push(response[inputIndex]);
          // }
          
          let newOutput: KeywordInputAndAggregationV2 = {keywords: this.keywordInputs, 
                                                       aggregation: outputAggregation,
                                                       graphAsSecondary: false,
                                                       graphSelector: "aggregation-graph-1",
                                                       isPercentage: false};
          let ratioOutput: KeywordInputAndAggregationV2 = {keywords: this.keywordInputs, 
                                                       aggregation: [combinedRecordCount], // Needs to be a 2d array
                                                       graphAsSecondary: false,
                                                       graphSelector: "aggregation-graph-2",
                                                       isPercentage: true};
          let countOutput: KeywordInputAndAggregationV2 = {keywords: this.selectedRecordTypes, 
                                                       aggregation: countByRecordType,
                                                       graphAsSecondary: true,
                                                       graphSelector: "aggregation-graph-3",
                                                       isPercentage: false};

          this.keywordOutput = newOutput;
          this.recordRatioOutput = ratioOutput;
          this.recordCountOutput = countOutput;
          this.isFetching = false;
        },
        error => {
            console.log(error);
            this.errorMessage = error.error.error + " " + error.error.message;
            this.isFetching = false;
        }
      );
  }

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
}
