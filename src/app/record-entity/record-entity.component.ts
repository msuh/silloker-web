import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';

import { RecordEntity } from '../search/search.component';

// TODO: move all the commonly used objects to a separate export file.
// Representation for some key value pair.
export interface KeyValue {
  key: string;
  value: number;
}

// The returned object for a single tag entity
export interface TagEntity {
  id?: number;
  recordId?: number;
  recordType: string;
  tagName: string;
  tagContent: string;
}

@Component({
  selector: 'app-record-entity',
  templateUrl: './record-entity.component.html',
  styleUrls: ['./record-entity.component.css']
})
export class RecordEntityComponent implements OnInit {

  // A single record to display in detail.
  //@Input() 
  record: RecordEntity;
  // A list of tags associated with the record.
  tags: TagEntity[] = [];
  recordId : number;
  @ViewChild("content") content: ElementRef;

  readonly displayedColumns: string[] = ['category', 'tag'];

  constructor(private http: HttpClient,
              private route:ActivatedRoute) {
    this.recordId = this.route.snapshot.params['id'];
  }

  // TODO: do a fork-join so that the main content doesn't render faster
  ngOnInit(): void {
    this.http.get<RecordEntity>("http://localhost:8080/record/id/" + this.recordId)
    .subscribe( (response) => {
          this.record = response;
        },
        error => {
          console.log(error);
        }
    );
    this.http.get<TagEntity[]>("http://localhost:8080/tag/record/" + this.recordId)
    .subscribe( (response) => {
          this.tags = response;
          // this.colorTags(this.tags);

        },
        error => {
          console.log(error);
        }
        );
  }

  // TODO: figure out later
  // public colorTags(tags : TagEntity[]): void {
  //   let content = this.record.content;
  //   for (let tag of tags) {
  //     if (content.includes(tag.tagContent)) {
  //       content = content.replaceAll(tag.tagContent, '<span style="color:red;">' + tag.tagContent + "</span>");
  //     }
  //   }
  //   this.content.nativeElement.innerHTML = content;
  // }

}
