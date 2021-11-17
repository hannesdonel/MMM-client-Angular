import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-actors',
  templateUrl: './actors.component.html',
  styleUrls: ['./actors.component.scss']
})
export class ActorsComponent implements OnInit {

  /** Data that gets passed to this dialog on opening it. */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      actors: Array<string>
    }
  ) { }

  ngOnInit(): void {
  }
}
