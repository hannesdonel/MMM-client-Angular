import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import FetchApiService from '../fetch-api-data.service';
import { AppComponent } from '../app.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GenreComponent } from '../genre/genre.component';
import { ActorsComponent } from '../actors/actors.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';
import { DirectorDetailsComponent } from '../director-details/director-details.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
class MovieCardComponent implements OnInit {
  public allMovies: any[] = []
  public movies: any = []
  public genres: any[] = []
  public directors: any[] = []
  public userData: Object = {} 
  public favorites: string[] = []
  public nothingFound: Boolean = false
  public selectedGenre!: Number
  public selectedDirector!: Number
  public genreFilter: any = ''
  public directorFilter: any = ''
  public scrolled: Boolean = false
    
  constructor(
    private fetchApi: FetchApiService,
    public app: AppComponent,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  showFavorites: Boolean = false
  selectedMovie: any = false
  searchString: String = ''

  async ngOnInit() {
    localStorage.removeItem('genreFilter');
    localStorage.removeItem('directorFilter');
    this.app.navigationHome = true;
    this.app.navigationUser = false;
    this.app.setLoggedIn(true);
    document.addEventListener('scroll', () => this.getScrollPosition())
    await this.fetchData();
    this.setSelectedMovie();
  }
  
  // Get all data from API
  fetchData = async () => {
    this.app.loading = true;
    try {
      // Get genres
      this.fetchApi.getGenres().subscribe((response: any) => {
        this.genres = response.sort((a: any, b: any) => {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        });
      });
      
      // Get directors
      this.fetchApi.getDirectors().subscribe((response: any) => {
        this.directors = response.sort((a: any, b: any) => {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        });
      });

      // Get user data
      this.fetchApi.getUserData().subscribe((response: any) => {
        this.userData = response.user;
        response.user.favorites.forEach((favorite: any) => this.favorites.push(favorite._id))
      })
      
      await new Promise((resolve) => {
        // Get movies
        this.fetchApi.getAllMovies().subscribe((response: any) => {
          this.allMovies = response.sort((a: any, b: any) => {
            if (a.title < b.title) { return -1; }
            if (a.title > b.title) { return 1; }
            return 0;
          });
          resolve(true);
        });
      });
      
      this.movies = this.allMovies;
      this.app.loading = false;
      return true
    } catch {
      this.app.loading = false;
      return false
    }
  }

  // Get scroll position
  getScrollPosition = (): void => {
    if (window.scrollY > 1000) {
      this.scrolled = true;
    } else {
      this.scrolled = false;
    }
  }

  // Scroll to top
  toTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // One and only function to filter over array of movies to display
  search = () => {
    this.nothingFound = false;
    let searchArray = this.allMovies;

    // Set favorites
    if (this.showFavorites) {
      const resetToFavorites = this.allMovies.filter((movie) => this.favorites.includes(movie._id));
      searchArray = resetToFavorites;
      // this.genreFilter = '';
      // this.directorFilter = '';
    }

    // Filter for genre
    if (this.genreFilter) {
      searchArray = searchArray.filter((el: any): Boolean => (
        el.genre.some(
          (genre: any) => genre.name.toLowerCase().indexOf(this.genreFilter.toLowerCase()) > -1,
        ) === true
      ));
    }

    // Filter for director
    if (this.directorFilter) {
      searchArray = searchArray.filter((el: any): Boolean => (
        el.director.some(
          (director: any) => director.name.toLowerCase().indexOf(this.directorFilter.toLowerCase()) > -1
        ) === true
      ));
    }

    // Filter for search input
    if (this.searchString === '') {
      this.movies = searchArray
    } else {
      this.movies = searchArray.filter((el) => (
        el.title.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1
          || el.director.some(
            (director: any) => director.name.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1
          ) === true
          || el.genre.some(
            (genre: any) => genre.name.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1
          ) === true
          || el.actors.some(
            (actor: any) => actor.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1
          ) === true
      ));
    }
    
    if (this.movies.length === 0) {
      this.nothingFound = true;
    }
  }

  // Toggle to see favorite movies
  favoritesToggle = () => {
    this.showFavorites = !this.showFavorites
    if (this.showFavorites) {
      this.movies = this.allMovies.filter((movie) => this.favorites.includes(movie._id))
    } else {
      this.movies = this.allMovies
    }
    this.search();
  }

  // Set filter
  filter(value: any) {
    // Set filter for genre
    if (value.genreName) {
      if (this.genreFilter !== value.genreName) {
        this.genreFilter = value.genreName;
      } else {
        this.genreFilter = '';
      }
    }

    // Set filter for director
    if (value.directorName) {
      if (this.directorFilter !== value.directorName) {
        this.directorFilter = value.directorName;
      } else {
        this.directorFilter = '';
      }
    }
    this.search();
  }

  // Show one movie
  showMovieDetails = (movieTitle: string): void => {
    this.router.navigate([`/movies/${movieTitle}`]);
  }

  // Determine which movie to show (if there's only one to show)
  setSelectedMovie = (): void => {
    const movieTitle: string = this.route.snapshot.paramMap.get('title')!;
    if (movieTitle) {
      this.selectedMovie = this.allMovies.find((movie: any): Boolean => movie.title === movieTitle);
      this.app.navigationHome = false;
    } else {
      this.selectedMovie = false;
      this.app.navigationHome = true;
    }
  }

  // Trigger genre popups
  genreDetails = (genres: any): void => {
    let genreNames: String[] = [];
    genres.forEach((genre: any) => genreNames.push(genre.name));
    this.dialog.open(GenreComponent, {
      data: {
        genreNames,
        genres: this.genres  
      }
    });
  }

  // Trigger actor popup
  actorsDetails = (actors: any): void => {
    this.dialog.open(ActorsComponent, {
      data: {
        actors
      }
    });
  }

  // Trigger director popup
  directorDetails = (directorName: any): void => {
    const director = this.directors.find((director: any): Boolean => director.name === directorName)
    this.dialog.open(DirectorDetailsComponent, {
      data: {
        name: director.name,
        description: director.bio,
        birthYear: director.birth_year,
        deathYear: director.death_year
      }
    })
  }
  
  // Trigger synopsis popup
  synopsisDetails = (description: any): void => {
    this.dialog.open(SynopsisComponent, {
      data: {
        description
      }
    });
  }

  addFavorite = (movie: string) => {
    this.fetchApi.addFavorite(movie).subscribe(
      () => this.favorites.push(movie),
      () => this.snackBar.open('Something went wrong.', 'OK', { duration: 3000 })
    );
  }

  removeFavorite = (movie: string) => {
    this.fetchApi.removeFavorite(movie).subscribe(
      () => {
        const index = this.favorites.indexOf(movie);
        if (index > -1) {
          this.favorites.splice(index, 1);
        };
        this.movies = this.allMovies.filter((movie) => this.favorites.includes(movie._id));
      },
      () => this.snackBar.open('Something went wrong.', 'OK', { duration: 3000 })
    );
  }
}

export default MovieCardComponent;