import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

  data: string;

  constructor(
    // optional กัน result == null
    @Optional() @Inject(MAT_DIALOG_DATA) public result: any,
    private dialogRef: MatDialogRef<DeleteDialogComponent>
  ) { }

  ngOnInit() {
    this.data = this.result;
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
