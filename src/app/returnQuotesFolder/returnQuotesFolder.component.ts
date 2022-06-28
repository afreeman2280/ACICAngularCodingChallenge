import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { from } from 'rxjs';
import { LineOfBusiness } from '../LineOfBusiness';
import { LINES_OF_BUSINESS } from '../mock-linesOfBusiness';
import { map,distinct } from 'rxjs/operators';
import { RecentQuote } from '../recentQuote';
import { LineOfBusinessService } from '../lineOfBusiness.service';
import { RecentQuoteService } from '../RecentQuote.service.';
import { variable } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-returnQuotesFolder',
  templateUrl: './returnQuotesFolder.component.html',
  styleUrls: [ './returnQuotesFolder.component.css' ]
})
export class ReturnQuotesFolderComponent implements OnInit {
  // i think should be most popular and second most popular should be String/At least not an array
  mostPopularQuote: RecentQuote[]= [];
  secondPopularQuote: RecentQuote[]= [];
  firstLineOfBusinessName: string|undefined;
  secondLineOfBusinessName: string|undefined;
  quoteList: RecentQuote[] = [];
  mostPopularCompanyName: string|undefined;
  secondMostPopularCompanyName: string|undefined;



  constructor(
    private route: ActivatedRoute,
    private lineOfBusinessService: LineOfBusinessService,
    private RecentQuoteService: RecentQuoteService
  
  ) {}

  ngOnInit(): void {
    this.getMostPopularRecentQuotesList();
    
  }
  getMostPopularRecentQuotesList(): void {
       this.RecentQuoteService.getRecentQuotesList()
    .subscribe((quoteList) => {this.quoteList = quoteList;
      this.getQuotesHelper()});
  }
  getSecondMostPopularRecentQuotesList(): void {
    this.RecentQuoteService.getRecentQuotesList()
 .subscribe((secondPopularQuote) => {this.secondPopularQuote = secondPopularQuote;
  this.getQuotesHelper()});
}
// I think this method could be better/more efficent
// I think i could separate the service calls so the method don't so big
// Maybe could use one ngfor in the html instead of two?
  getQuotesHelper(): void{
    
      const map = this.quoteList.reduce((acc, val) => {
         if(acc.has(val.lineOfBusiness)){
            acc.set(val.lineOfBusiness, acc.get(val.lineOfBusiness) + 1);
         }else{
            acc.set(val.lineOfBusiness, 1);
         };
         return acc;
      }, new Map);
      var mapAsc = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
      const first = [...mapAsc][0];
      const second = [...mapAsc][1];
  
  
       this.RecentQuoteService.getRecentQuotesByLineOfBusiness(first[0])
       .subscribe(mostPopularQuote => {this.mostPopularQuote = mostPopularQuote.slice(1,2)});

      this.RecentQuoteService.getRecentQuotesByLineOfBusiness(second[0])
      .subscribe(secondPopularQuote => {this.secondPopularQuote = secondPopularQuote.slice(1,2)});

      this.lineOfBusinessService.getLineOfBusiness(first[0])
      .subscribe(mostPopularCompanyName => this.mostPopularCompanyName = mostPopularCompanyName.name)

      this.lineOfBusinessService.getLineOfBusiness(second[0])
      .subscribe(secondMostPopularCompanyName => this.secondMostPopularCompanyName = secondMostPopularCompanyName.name)
       
      this.firstLineOfBusinessName = LINES_OF_BUSINESS.find(x => x.id === first[0])?.name;
      this.secondLineOfBusinessName = LINES_OF_BUSINESS.find(x => x.id === second[0])?.name;
    }
   
  } 

  
