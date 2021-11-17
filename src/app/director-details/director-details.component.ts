import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-director-details',
  templateUrl: './director-details.component.html',
  styleUrls: ['./director-details.component.scss']
})
export class DirectorDetailsComponent implements OnInit {

  /** Data that gets passed to this dialog on opening it. */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      name: string,
      description: string,
      birthYear: string,
      deathYear: string
    }
  ) { }

  ngOnInit(): void {
  }

}
