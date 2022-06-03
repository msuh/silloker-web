import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { TagEntity } from '../record-entity/record-entity.component';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
// /tag/:name
export class TagComponent implements OnInit {

  tagName: string;

  constructor(private http: HttpClient,
              private route:ActivatedRoute) {
    this.tagName = this.route.snapshot.params['name'];
  }

  ngOnInit(): void {
    // TODO: have the server directly retrieve RecordEntitys for a given tag name
    // this.http.get<TagEntity>("http://localhost:8080/record/id/" + this.recordId)
    // .subscribe( (response) => {
    //       this.record = response;
    //     },
    //     error => {
    //       console.log(error);
    //     }
    // );
  }

}
