import { Component, OnInit, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  @Input() settings;
  constructor() { }

  floatTo: string = 'right';
  ngOnInit(): void {
  }

}
