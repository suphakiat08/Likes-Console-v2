import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatTableDataSource, MatDialogRef } from '@angular/material';
import { DatabaseService } from '../../../../services/database.service';

@Component({
  selector: 'app-device-dialog',
  templateUrl: './device-dialog.component.html',
  styleUrls: ['./device-dialog.component.css']
})
export class DeviceDialogComponent implements OnInit {

  pageReady = false;
  devices: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DeviceDialogComponent>,
    private service: DatabaseService
  ) { }

  ngOnInit() {
    this.service.get(
      'https://localhost:3000/devices'
    ).then((res: any) => {
      this.devices = new MatTableDataSource(res.data);
      this.initFilter();
      setTimeout(() => { this.pageReady = true }, 300);
    });
  }

  initFilter() {
    this.devices.filterPredicate = (data, filters) => {
      const matchFilter = [];
      const filterArray = filters.split('*');
      const columns = [data.serial_number, data.detail];

      filterArray.forEach(filter => {
        const customFilter = [];
        columns.forEach(column => {
          customFilter.push(column.toLowerCase().includes(filter))
        });
        matchFilter.push(customFilter.some(Boolean));
      });
      return matchFilter.every(Boolean);
    }
  }

  filter(filter) {
    this.devices.filter = filter.trim().toLowerCase();
  }

  submit(data) {
    this.data.serial_number = data.serial_number;
    this.data.detail = data.detail;
    this.dialogRef.close(this.data);
  }

  listStyle = {
    "font-family": "'Kanit', sans-serif",
    "height": "70px",
    "border-top": "1px solid #dfdfdf"
  }

  serialStyle = {
    "font-size": "10pt",
    "color": "#3562be"
  }

  detail = {
    "font-size": "12pt",
    "font-weight": "bold"
  }
}