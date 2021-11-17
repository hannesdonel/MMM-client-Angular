import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-synopsis',
  templateUrl: './synopsis.component.html',
  styleUrls: ['./synopsis.component.scss']
})
export class SynopsisComponent implements OnInit {

  /** Data that gets passed to this dialog on opening it. */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      description: string
    }
  ) { }

  ngOnInit(): void {
  }
}
