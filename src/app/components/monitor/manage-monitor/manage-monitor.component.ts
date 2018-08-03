import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { MyCookieService } from '../../../services/cookie.service';
import { DeviceDialogComponent } from './device-dialog/device-dialog.component';

@Component({
  selector: 'app-manage-monitor',
  templateUrl: './manage-monitor.component.html',
  styleUrls: ['./manage-monitor.component.css']
})
export class ManageMonitorComponent implements OnInit {

  mainGroup: FormGroup;
  device: {
    serial_number: string,
    detail: string
  }

  other = {
    promotion: false,
    stock: false,
    limited: false,
    hot_sale: false
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ManageMonitorComponent>,
    private cookie: MyCookieService
  ) { }

  ngOnInit() {
    this.formBuild();
  }

  formBuild() {
    this.initInput();
    this.mainGroup = new FormGroup({
      'device': new FormGroup({
        'serial_number': new FormControl(this.device.serial_number, Validators.required),
        'detail': new FormControl(this.device.detail)
      }),
      'url': new FormControl(this.data.url, Validators.required),
      'post_id': new FormControl(this.data.post_id),
      'prod_name': new FormControl(this.data.prod_name, Validators.required),
      'price': new FormControl(this.data.price, [
        Validators.required,
        Validators.min(0),
        Validators.max(9999999)
      ]),
      'icons': new FormGroup({
        'promotion': new FormGroup({
          'amount': new FormControl(this.data.icons.promotion.amount),
          'unit': new FormControl(this.data.icons.promotion.unit),
          'date': new FormControl(this.data.icons.promotion.date)
        }),
        'stock': new FormControl(this.data.icons.stock),
        'limited': new FormControl(this.data.icons.limited),
        'hot_sale': new FormControl(this.data.icons.hot_sale)
      }),
      'token': new FormControl(this.cookie.getCookie('token')),
      'expire': new FormControl(this.cookie.getCookie('expire')),
      'switch': new FormControl(this.data.switch)
    });
  }

  initInput() {
    if (this.data.device) {
      this.device = this.data.device;
    } else {
      this.device = {
        serial_number: null,
        detail: ""
      }
    }

    if (this.data.icons) {
      if (this.data.icons.promotion && Object.keys(this.data.icons.promotion).length) {
        this.other.promotion = true
        this.data.icons.promotion.date = new Date(this.data.icons.promotion.date);
      } else {
        this.data.icons.promotion = {};
      }

      this.data.icons.stock ?
        this.other.stock = true : null;

      this.data.icons.limited ?
        this.other.limited = true : null;

      this.data.icons.hot_sale ?
        this.other.hot_sale = true : null;

    } else {
      this.data.icons = {
        promotion: {}
      }
    }
  }

  async openDialogDevice() {
    await this.dialog.open(DeviceDialogComponent, {
      data: {},
      width: '608px',
      maxHeight: (window.screen.height - 200) + 'px',
      autoFocus: false
    }).afterClosed().subscribe(result => {
      if (result) {
        this.mainGroup.value.device.serial_number = result.serial_number;
        this.device = {
          serial_number: result.serial_number,
          detail: result.detail
        }
      }
    });
  }

  submit() {
    this.mainGroup.value.device.detail = this.device.detail;
    if (this.mainGroup.valid) {
      this.resultSet();
      this.dialogRef.close(this.mainGroup.value);
    }
  }

  resultSet() {
    !this.mainGroup.value.switch ?
      this.mainGroup.value.switch = false : null;

    this.mainGroup.value.status = !this.data.status ?
      0 : 1;

    if (!this.other.promotion && !this.other.stock && !this.other.limited && !this.other.hot_sale) {
      delete this.mainGroup.value.icons;
    } else {
      if (!this.other.promotion || !Object.keys(this.mainGroup.value.icons.promotion).length) {
        delete this.mainGroup.value.icons.promotion;
      } else {
        let date = new Date(this.mainGroup.value.icons.promotion.date).toLocaleDateString().split('/');
        for (let i = 0; i < 2; i++) {
          if (date[i].length == 1) {
            date[i] = '0' + date[i];
          }
        }
        this.mainGroup.value.icons.promotion.date = date[0] + '/' + date[1] + '/' + date[2];
      }

      this.other.stock ?
        this.mainGroup.value.icons.stock = true :
        delete this.mainGroup.value.icons.stock;

      this.other.limited ?
        this.mainGroup.value.icons.limited = true :
        delete this.mainGroup.value.icons.limited;

      this.other.hot_sale ?
        this.mainGroup.value.icons.hot_sale = true :
        delete this.mainGroup.value.icons.hot_sale;
    }

    let pageID;
    let postID;
    let arr = this.mainGroup.value.url.split("/");
    pageID = arr[3];
    arr[arr.length - 1].charAt(0) == "?" ?
      (postID = arr[arr.length - 2]) :
      (postID = arr[arr.length - 1]);
    this.mainGroup.value.post_id = pageID + "_" + postID;
  }

  matcher = new MyErrorStateMatcher();
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}