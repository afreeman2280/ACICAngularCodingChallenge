import { Component, OnInit } from '@angular/core';

import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';

@Component({
  selector: 'app-linesOfBusiness',
  templateUrl: './linesOfBusiness.component.html',
  styleUrls: ['./linesOfBusiness.component.css']
})
export class LineOfBusinessComponent implements OnInit {
  linesOfBusiness: LineOfBusiness[] = [];

  constructor(private lineOfBusinessService: LineOfBusinessService) { } 

  ngOnInit() {
    this.getLinesOfBusiness();
  }

  getLinesOfBusiness(): void {
    this.lineOfBusinessService.getLinesOfBusiness()
    .subscribe(linesOfBusiness => this.linesOfBusiness = linesOfBusiness);
  }

  add(name: string, description: string): void {
    name = name.trim();
    if (!name) { return; }
    this.lineOfBusinessService.addLineOfBusiness({ name, description } as LineOfBusiness)
      .subscribe(lineOfBusiness => {
        this.linesOfBusiness.push(lineOfBusiness);
      });
  }

  delete(lineOfBusiness: LineOfBusiness): void {
    this.linesOfBusiness = this.linesOfBusiness.filter(lob => lob !== lineOfBusiness);
    this.lineOfBusinessService.deleteLineOfBusiness(lineOfBusiness.id).subscribe();
  }

}
