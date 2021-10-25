import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';


// API URL
const apiUrl = 'https://more-movie-metadata.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
  
// API calls
class FetchApiService {
  constructor(private http: HttpClient) { }

  // Get all movies
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}movies`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get movies by genre
  public getMovieByGenre(genreId: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}movies/?genre=${genreId}`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get movies by actor
  public getMovieByActor(actor: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}movies/?actor=${actor}`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get movies by title
  public getMovieByTitle(title: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}movies/${title}`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get all genres
  public getGenres(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}genres`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get genre by name
  public getGenreByName(name: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}genres/${name}`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get all directors
  public getDirectors(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}directors`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get director by name
  public getDirectorByName(name: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}directors/${name}`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // User registration
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(`${apiUrl}users`, userDetails).pipe(
      catchError(this.handleError),
    );
  }

  // User deregistration
  public userDeregistration(): Observable<any> {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user')
    return this.http.delete(`${apiUrl}users/${userId}`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      catchError(this.handleError),
    );
  }

  // Get user information
  public getUserData(): Observable<any> {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user')
    return this.http.get(`${apiUrl}users/${userId}`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      catchError(this.handleError),
    );
  }

  // Update user information
  public updateUserData(updateDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user')
    return this.http.put(`${apiUrl}users/${userId}`, updateDetails, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
        catchError(this.handleError),
        );
      }
      
  // Get favorite movies
  public getFavorites(): Observable<any> {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user')
   return this.http.get(`${apiUrl}users/${userId}`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError),
    );
  }

  // Add movie to favorites
  public addFavorite(movieId: any): Observable<any> {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user')
    return this.http.put(`${apiUrl}users/${userId}/favorites/${movieId}`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      catchError(this.handleError),
    );
  }

  // Remove movie to favorites
  public removeFavorite(movieId: any): Observable<any> {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user')
    return this.http.delete(`${apiUrl}users/${userId}/favorites/${movieId}`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      catchError(this.handleError),
    );
  }

  // Response handler
  private extractResponseData(res: any): any {
      const body = res;
      return body || { };
    }

  // Error handler
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, `
        + `Error body is: ${error.error}`,
      );
    }
    return throwError(
      'Something bad happened; please try again later.',
    );
  }
}

export default FetchApiService;

 