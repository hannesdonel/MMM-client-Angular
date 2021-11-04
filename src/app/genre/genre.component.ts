import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss']
})
export class GenreComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      genreNames: String[],
      genres: Object[]  
    }
  ) { }

  selectedGenres: any = []

  ngOnInit(): void {
    this.data.genreNames.forEach((genreName: String) =>
    this.selectedGenres.push(this.data.genres.find((genre: any) =>
    genre.name === genreName)))
  }
}
