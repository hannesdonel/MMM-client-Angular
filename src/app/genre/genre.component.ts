import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss']
})
export class GenreComponent implements OnInit {

  /** Data that gets passed to this dialog on opening it. */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      genreNames: Array<string>,
      genres: Array<object>  
    }
  ) { }

  /** Genres that will be handed to template. */
  selectedGenres: any[] = []

  ngOnInit(): void {
    this.setGenres();
  }

  /** Compares the given genre to all genres and sets the selected genre. */
  setGenres = (): void => {
    this.data.genreNames.forEach((genreName: string) =>
      this.selectedGenres.push(this.data.genres.find((genre: { name?: string }) =>
        genre.name === genreName
      ))
    );
  }
}
