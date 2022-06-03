# SillokerWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.7.



### Introduction
Angular starts by executing main.ts file. It bootstraps the AppModule (app.module.ts) which loads everything and controls the startup of the application. 

The @NgModule would list all components needed for index.html and the circle closes.

angular.json configures build and configuration so that the app runs. For example, the "index" that configures which html is the first place that lands when users go to "/" as well as the "main" that configures which typescript gets executed and bootstraps Angular first.

```
"architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
			"index": "src/index.html",
			"main": "src/main.ts",
```

### Angular CLI
With Angular, you use Angular CLI (https://angular.io/cli) to configure and build the Angular application, so that you don't have to manually configure the application. In the directory that you want your Angular application run

`$ng new <application-name>`

Run linting on the project
`$ng lint`

Run the application
`$ng serve`

With `ng generate <sub-command> ...`, you can generate various components that make up Angular. But I don't know anything other than `ng generate component <component-name>`.

###Selector
The "selector" of a @Component indicates the custom made tag that can plug into another component's html.

```
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent..
```

### Routing
We define routing in the routing module by defining a list of Routes and an NgModule that imports and exports. You can define a specific outlet that something routes to. 
```
const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
  {path: <base-path>, component: <component>, outlet: <target_outlet_name>},
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

You define where the routed data should replace and can have different outlets:
```
<router-outlet></router-outlet>
<router-outlet name='left'></router-outlet>
<router-outlet name='right'></router-outlet>
```

Then we can use the links to move to certain components by using the "routerLink".

```
<nav>
  <ul>
    <li><a routerLink="/first-component" routerLinkActive="active">First Component</a></li>
    <li><a routerLink="/second-component" routerLinkActive="active">Second Component</a></li>
  </ul>
</nav>
```

## Styling (CSS)
Angular Material CSS styling does not get applied automatically. We must import (or build custom) one of the prebuilt themes to ensure the Angular Material standard css gets applied. In order to do so, import the themes from material in a globally applied css file by adding this line:

`@import "~@angular/material/prebuilt-themes/indigo-pink.css";`

Global css file is configured in `angular.json` under `styles` where it is defaulted to be "src/style.css".


Useful examples of using angular components: https://mdbootstrap.com/docs/angular/navigation/mega-menu/

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Module
TODO: explain module configuration, import, and usage. There generally is a central location (app.module.ts) that handles all used internal Components as well as the imported Modules. For example, there are a bunch of pre-configured Angular Material (https://material.angular.io/components/categories) that you can import and use. 

If you want to use the Angular Input component (https://material.angular.io/components/input/overview), use the guide in the doc and API to import the appropriate Module `import {MatInputModule} from '@angular/material/input';` into *app.modules.ts*.

**Icon**
In terms of icons shown in this resource list: https://material.io/resources/icons/?style=baseline, you can either include the CSS stylesheet in your index.html (<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">), or install the npm module by `npm install material-design-icons` and add styles to angular.json:
```
"styles": [
  "node_modules/material-design-icons/iconfont/material-icons.css"
]
```

## Binding
In Angular, you can control almost like a read/write permission of components and fields. 
`(variableName)` means that you can only read the value in the corresponding *.ts* file and the user inputs some value, whereas `[varabileName]` indicates the data can only be provided to the component and not written over by the user. Having both means bi-directional `[(variableName)]` actions are possible.
For example, if you have 

You would need to examine which variable binds to Angular components. For example, You could have an Angular input that looks like this:

```
<mat-form-field appearance="fill">
	<mat-label for="sel1" class="col-sm-4 col-form-label">Record Type</mat-label>
	  <mat-select [(value)]="selectedType">
		<mat-option *ngFor="let type of types" [value]="type.value">
			{{type.displayValue}}
	  </mat-option>
	</mat-select>
</mat-form-field>
```

Here, the corresponding *.ts* file would have a variable named `selectedType: RecordType;` where `RecordType` is defined as interface:
```
interface RecordType {
  value: string;
  displayValue: string;
}
```

####Input Value
For inputs, we can get the Input value by defining a variable when declaring the input as below with `#keyword`. Within the same component, the variable declared in the input can be used by accessing `<inputVariable>.value`. 
```
<mat-form-field appearance="fill">
  <mat-label for="content" class="col-sm-4 col-form-label">Keyword</mat-label>
	<input #keyword matInput
                       type="text"
                       placeholder="進取京城"
                       (keyup.enter)="$event.target.blur()"
                       required>
</mat-form-field>
<button mat-raised-button (click)="searchRecords(keyword.value)">Search</button>
```

And the corresponding *ts* file can have a parameter that takes in the value type.
```
searchRecords(keyword: string) {}
```

## ng-template
```
<ng-template [ngIf]="hasData" [ngIfElse]="otherTemplate"></ng-template>
<ng-template #otherTemplate></ng-template>
```
You can choose to display different chunks of html elements and data by defining a `ng-template` with a `[ngIf]` data where *hasData* is a variable in the corresponding Component. The `[ngIfElse]` can point to another template variable.

## HTTP requests
Using pipe snatches the response or error before `subscribe` takes to do something. For example, if we want in-between computation or modification to the response, we can use pipe to return some new object `of({<variable>: <object>})`. This will add `<variable>` in the response in the `result` of subscribe.

```
this.http.post<inputObject>("/record/aggregation", input, httpOptions)
        .pipe(
           catchError(errorHttpResponse: HttpResponse<{}> => {
             const error =
                  this.errorUtil.getHttpErrorStatus(errorHttpResponse);
              return of({errorMessage: error.message});
           });
        )
        .subscribe( (result) => {
          console.log(result);
        });
```

If there is no need for interception of the response, you can directly subscribe to handle the HTTP output or error.
```
this.http.post<inputObject>("/record/aggregation", input, httpOptions)
        .subscribe( (response) => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
        );
```

## Display Architecture
`index.html` is the main location that initially displays the contents when routed to `/` (home). It uses the `<app-root></app-root>` selector to display the components. The selectors for each component are determined in the `.ts` file within each component directory. 

```
<top-navbar></top-navbar>

<!-- ///// Main Content ///// -->
<div class="main-container container-fluid text-center">
  <router-outlet></router-outlet>
</div>

<app-footer></app-footer>
```

The `<router-outlet></router-outlet>` defines where the selected routed components should be generated and displayed. 




