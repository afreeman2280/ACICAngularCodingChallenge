import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { RecentQuote } from './recentQuote';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class RecentQuoteService {
  // URL to web api
  private recentQuotesUrl = 'api/recentQuotes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  

    /** GET Recent Quote List from the server */
    getRecentQuotesList(): Observable<RecentQuote[]> {
      return this.http.get<RecentQuote[]>(this.recentQuotesUrl)
        .pipe(
          tap(_ => this.log('fetched recent quote list')),
          catchError(this.handleError<RecentQuote[]>('getRecentQuotesList', []))
        );
    }



    /** GET line of business by id. Return `undefined` when id not found */
    getRecentQuoteNo404<Data>(id: number): Observable<RecentQuote> {
      const url = `${this.recentQuotesUrl}/?lineOfBusiness=${id}`;
      return this.http.get<RecentQuote[]>(url)
        .pipe(
          map(linesOfQuote => linesOfQuote[0]), // returns a {0|1} element array
          tap(h => {
            const outcome = h ? `fetched` : `did not find`;
            this.log(`${outcome} recentQuote lineOfBusiness=${id}`);
          }),
          catchError(this.handleError<RecentQuote>(`recentQuote id=${id}`))
        );
    }


  getRecentQuotesByLineOfBusiness(lineOfBusiness: number): Observable<RecentQuote[]> {
    const url = `${this.recentQuotesUrl}/?lineOfBusiness=${lineOfBusiness}`;
    return this.http.get<RecentQuote[]>(url).pipe(
      tap(_ => this.log(`fetched recentQuote lineOfBusiness=${lineOfBusiness}`)),
      catchError(this.handleError<RecentQuote[]>(`getRecentQuote lineOfBusiness=${lineOfBusiness}`))
    );
  }


  //////// Save methods //////////

  /** POST: add a new line of business to the server */
  

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a LineOfBusinessService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`LineOfBusinessService: ${message}`);
  }
}
