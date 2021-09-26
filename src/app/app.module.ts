import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// External imports
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table'; 
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


// Custom components
import { HomeComponent } from './home.component';
import { SearchComponent } from './search/search.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { AggregationComponent } from './aggregation/aggregation.component';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { FormDownloadComponent } from './form-download/form-download.component';
import { InstructionComponent } from './instruction/instruction.component';
import { AggregationGraphComponent } from './aggregation-graph/aggregation-graph.component';
import { SearchResultComponent } from './search-result/search-result.component';


@NgModule({
  declarations: [
    HomeComponent,
    SearchComponent,
    TopNavbarComponent,
    AggregationComponent,
    AboutComponent,
    NotFoundComponent,
    FormDownloadComponent,
    InstructionComponent,
    AggregationGraphComponent,
    SearchResultComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [HomeComponent]
})
export class AppModule { }
