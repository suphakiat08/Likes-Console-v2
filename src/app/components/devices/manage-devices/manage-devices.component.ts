import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DatabaseService } from '../../../services/database.service';

@Component({
  selector: 'app-manage-devices',
  templateUrl: './manage-devices.component.html',
  styleUrls: ['./manage-devices.component.css']
})
export class ManageDevicesComponent implements OnInit {

  mainGroup: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ManageDevicesComponent>,
    private service: DatabaseService
  ) { }

  ngOnInit() {
    this.mainGroup = new FormGroup({
      'serial_number': new FormControl(this.data.serial_number, [
        Validators.required,
        Validators.minLength(16)
      ]),
      'detail': new FormControl(this.data.detail, Validators.required)
    });
  }

  submit() {
    if (this.mainGroup.valid) {
      this.dialogRef.close(this.mainGroup.value);
    }
  }

  matcher = new MyErrorStateMatcher();

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}