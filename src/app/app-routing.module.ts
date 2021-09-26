import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { AggregationComponent } from './aggregation/aggregation.component';
import { InstructionComponent } from './instruction/instruction.component';
import { SearchComponent } from './search/search.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';

const routes: Routes = [
	{ path: 'about', component: AboutComponent },
	{ path: 'aggregation', component: AggregationComponent },
	{ path: 'search/instruction', component: InstructionComponent },
	{ path: 'search', component: SearchComponent },
	// Redirecting base path to search
	{path: '', pathMatch: 'full', redirectTo: 'search'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
