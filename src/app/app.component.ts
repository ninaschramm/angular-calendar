import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template: `
    <h1>Calendar App</h1>
    <app-calendar></app-calendar>
  `,
  styles: []
})
export class AppComponent {
  title = 'calendar-test';
}
