import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-record-type-selector',
  templateUrl: './record-type-selector.component.html',
  styleUrls: ['./record-type-selector.component.css']
})
export class RecordTypeSelectorComponent {

  @Output() recordSelectEvent = new EventEmitter<string[]>();
  selectedRecordTypesForm: FormGroup;

  private selectedReocrdTypes: string[];
  readonly recordTypes = ['WANGJO', 'SECRETARIAT', 'GARRISON'];

  constructor(fb: FormBuilder) {
  	this.selectedRecordTypesForm = fb.group({
       WANGJO: true,
       GARRISON: true,
       SECRETARIAT: true
    });
  }

  // event of type EventEmitter,MatCheckboxChange>
  checkChanged(event): void {
  	let selectedTypes = [];
    for (let key in this.selectedRecordTypesForm.value) {
      if (this.selectedRecordTypesForm.value[key]) {
        selectedTypes.push(key);
      }
    }

    this.recordSelectEvent.emit(selectedTypes);
  	this.selectedReocrdTypes = selectedTypes;
  }

  getCurrentSelectedRecordTypes() : string[] {
  	return this.selectedReocrdTypes;
  }

}
