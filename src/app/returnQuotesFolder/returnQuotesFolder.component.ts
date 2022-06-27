import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { from } from 'rxjs';
import { LineOfBusiness } from '../LineOfBusiness';
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
  mostPopularQuote: RecentQuote[]= [];
  secondPopularQuote: RecentQuote[]= [];
  quoteList: RecentQuote[] = [];
  firstQuote: Map<any, any[]> = new Map();
  secondQuote: Map<any, any[]> = new Map();
  mostPopularCompanyName: any;
  secondMostPopularCompanyName: any;



  constructor(
    private route: ActivatedRoute,
    private lineOfBusinessService: LineOfBusinessService,
    private RecentQuoteService: RecentQuoteService
  
  ) {}

  ngOnInit(): void {
    this.getMostPopularRecentQuotesList();
    this.getMostPopularRecentQuotesList(); 
  }
  getMostPopularRecentQuotesList(): void {
       this.RecentQuoteService.getRecentQuotesList()
    .subscribe((quoteList) => {this.quoteList = quoteList;this.getQuotesHelper()});
  }
  getSecondMostPopularRecentQuotesList2(): void {
    this.RecentQuoteService.getRecentQuotesList()
 .subscribe((secondPopularQuote) => {this.secondPopularQuote = secondPopularQuote;this.getQuotesHelper()});
}
// I think this method could be better/more efficent
// I think i could separate the service calls so the method don't so big/less service calls?
// Maybe could use one ngfor in the html?
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
      console.log(mapAsc)
      const first = [...mapAsc][0];
      const second = [...mapAsc][1];
      this.firstQuote = first[0];
      this.secondQuote = second[0];
  
       this.RecentQuoteService.getRecentQuotesByLineOfBusiness(Number(this.firstQuote))
       .subscribe(mostPopularQuote => {this.mostPopularQuote = mostPopularQuote.slice(1,2)});
      this.RecentQuoteService.getRecentQuotesByLineOfBusiness(Number(this.secondQuote))
      .subscribe(secondPopularQuote => {this.secondPopularQuote = secondPopularQuote.slice(1,2)});
      this.lineOfBusinessService.getLineOfBusiness(Number(this.firstQuote))
      .subscribe(mostPopularCompanyName => this.mostPopularCompanyName = mostPopularCompanyName.name)
      this.lineOfBusinessService.getLineOfBusiness(Number(this.secondQuote))
      .subscribe(secondMostPopularCompanyName => this.secondMostPopularCompanyName = secondMostPopularCompanyName.name)

    }
   
  } 

  
