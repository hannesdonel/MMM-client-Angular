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

import { Movie, Genre, Director } from 'src/data-types';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
  
class MovieCardComponent implements OnInit {
  
  constructor(
    private fetchApi: FetchApiService,
    public app: AppComponent,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  
  /** This is the exact array that comes from the server. */
  allMovies: any[] = []
  /** These are the movies that are display. */
  public movies: any[] = []
  public genres: any[] = []
  public directors: any[] = []
  public userData: object = {}
  /** The users favorite movies as IDs. */
  public favorites: string[] = []
  /** Activates a message if a filter or search doesn't produce any result. */
  public nothingFound: boolean = false
  /** This number is needed to only check one filter. */
  public selectedGenre!: number
  /** This number is needed to only check one filter. */
  public selectedDirector!: number
  /** String that gets set by filter checkbox. */
  public genreFilter: string = ''
  /** String that gets set by filter checkbox. */
  public directorFilter: string = ''
  /** Needed to determine if the up button gets displayed. */
  public scrolled: boolean = false
  /** If true, only favorite movies get displayed. */
  showFavorites: boolean = false
  /** If true the movie view will only show one movie with advanced information. */
  selectedMovie: any = false
  /** String that gets produced by the search input field to search for movies, actors, directors and genres. */
  searchString: string = ''

  async ngOnInit(): Promise<void> {
    localStorage.removeItem('genreFilter');
    localStorage.removeItem('directorFilter');
    // These two variables make sure that the correct menu item is highlighted.
    this.app.navigationHome = true;
    this.app.navigationUser = false;
    this.app.setLoggedIn(true);
    document.addEventListener('scroll', () => this.getScrollPosition())
    await this.fetchData();
    this.setSelectedMovie();
  }
  
  /** This function combines all API calls to one function. Since this is an asynchronous function it's possible to halt onInit until this is finished.
   * 
   * @async
   */
  fetchData = async (): Promise<boolean> => {
    this.app.loading = true;
    try {
      // Get genres and sort them alphabetically
      this.fetchApi.getGenres().subscribe((response: any) => {
        this.genres = response.sort((a: { name: string }, b: { name: string }): number => {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        });
      });
      
      // Get directors and sort them alphabetically
      this.fetchApi.getDirectors().subscribe((response: any) => {
        this.directors = response.sort((a: { name: string }, b: { name: string }): number => {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        });
      });

      // Get user data
      this.fetchApi.getUserData().subscribe((response: any) => {
        this.userData = response.user;
        response.user.favorites.forEach((favorite: { _id: string }) => this.favorites.push(favorite._id))
      })
      
      await new Promise((resolve) => {
        // Get movies and sort them alphabetically
        this.fetchApi.getAllMovies().subscribe((response: any) => {
          this.allMovies = response.sort((a: { title: string }, b: { title: string }): number => {
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

  /** Get scroll position and display up button after 1000 px.*/
  getScrollPosition = (): void => {
    if (window.scrollY > 1000) {
      this.scrolled = true;
    } else {
      this.scrolled = false;
    }
  }

  /** Scroll to top after click on up button. */
  toTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /** This function is the one and only to filter movies for a search string, gerne, director or favorites. It alters the array movies that get displayed. */
  search = (): void => {
    this.nothingFound = false;

    // A copy of all movies to preserve the original array.
    let searchArray = this.allMovies;

    // Set favorites
    if (this.showFavorites) {
      const resetToFavorites = this.allMovies.filter((movie: { _id: string }): boolean => this.favorites.includes(movie._id));
      searchArray = resetToFavorites;
    };

    // Filter for genre
    if (this.genreFilter) {
      searchArray = searchArray.filter((el: { genre: Array<Genre> }) => (
        el.genre.some(
          (genre): boolean => genre.name.toLowerCase().indexOf(this.genreFilter.toLowerCase()) > -1
        ) === true
      ));
    };

    // Filter for director
    if (this.directorFilter) {
      searchArray = searchArray.filter((el: { director: Array<Director> }) => (
        el.director.some(
          (director: any) => director.name.toLowerCase().indexOf(this.directorFilter.toLowerCase()) > -1
        ) === true
      ));
    };

    // Filter for search input
    if (this.searchString === '') {
      this.movies = searchArray
    } else {
      this.movies = searchArray.filter((el: Movie) => (
        el.title.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1
        || el.director.some(
            (director) => director.name.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1
          ) === true
        || el.genre.some(
            (genre) => genre.name.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1
          ) === true
        || el.actors.some(
            (actor) => actor.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1
          ) === true
      ));
    };
    
    if (this.movies.length === 0) {
      this.nothingFound = true;
    };
  }

  /** Toggle function to filter all movies for favorites. */
  favoritesToggle = (): void => {
    this.showFavorites = !this.showFavorites
    if (this.showFavorites) {
      this.movies = this.allMovies.filter((movie: { _id: string }) => this.favorites.includes(movie._id));
    } else {
      this.movies = this.allMovies;
    }

    this.search();
  }

  /** Sets filter for genre or director and then executes the search function to filter the movies to be displayed. */
  filter(value: { genreName?: string, directorName?: string }): void {
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

  /** When user clicks on movie picture this function gets fired to insert a param in the URL. */
  showMovieDetails = (movieTitle: string): void => {
    this.router.navigate([`/movies/${movieTitle}`]);
  }

  /** If there's a param in the URL /movies/:title this function will handle the request and set one movie with advanced information to display. */
  setSelectedMovie = (): void => {
    const movieTitle: string = this.route.snapshot.paramMap.get('title')!;
    if (movieTitle) {
      this.selectedMovie = this.allMovies.find((movie: { title: string }) => movie.title === movieTitle);
      this.app.navigationHome = false;
    } else {
      this.selectedMovie = false;
      this.app.navigationHome = true;
    }
  }

  /** Triggers a genre popup. */
  genreDetails = (genres: Array<{ name: string }>): void => {
    let genreNames: String[] = [];
    genres.forEach((genre) => genreNames.push(genre.name));
    this.dialog.open(GenreComponent, {
      data: {
        genreNames,
        genres: this.genres  
      }
    });
  }

  /** Triggers an actor popup. */
  actorsDetails = (actors: Array<string>): void => {
    this.dialog.open(ActorsComponent, {
      data: {
        actors
      }
    });
  }

  /** Triggers a director popup. */
  directorDetails = (directorName: string): void => {
    interface Director {
      name: string,
      bio: string,
      birth_year: string,
      death_year: string
    }

    const director: Director = this.directors.find((director: { name: string }) => director.name === directorName)
    this.dialog.open(DirectorDetailsComponent, {
      data: {
        name: director.name,
        description: director.bio,
        birthYear: director.birth_year,
        deathYear: director.death_year
      }
    })
  }
  
  /** Triggers a synopsis popup. */
  synopsisDetails = (description: string): void => {
    this.dialog.open(SynopsisComponent, {
      data: {
        description
      }
    });
  }

  /** Add movie to favorites locally and on remote. */
  addFavorite = (movie: string): void => {
    this.fetchApi.addFavorite(movie).subscribe(
      () => this.favorites.push(movie),
      () => this.snackBar.open('Something went wrong.', 'OK', { duration: 3000 })
    );
  }

  /** Remove movie to favorites locally and on remote. */
  removeFavorite = (movie: string): void => {
    this.fetchApi.removeFavorite(movie).subscribe(
      () => {
        const index: number = this.favorites.indexOf(movie);
        if (index > -1) {
          this.favorites.splice(index, 1);
        };
        if (this.showFavorites) {
          this.movies = this.allMovies.filter((movie: { _id: string }) => this.favorites.includes(movie._id));
        };
        this.search();
      },
      () => this.snackBar.open('Something went wrong.', 'OK', { duration: 3000 })
    );
  }
}

export default MovieCardComponent;