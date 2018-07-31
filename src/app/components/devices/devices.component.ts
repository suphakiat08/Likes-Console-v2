import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { DatabaseService } from '../../services/database.service';
import { ManageDevicesComponent } from './manage-devices/manage-devices.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  pageReady = false;
  displayedColumns = ['position', 'serial_number', 'detail', 'operation'];
  dataSource: any;
  filter_temp = '';

  constructor(
    private dialog: MatDialog,
    private service: DatabaseService
  ) { }

  ngOnInit() {
    this.getDevices();
    setTimeout(() => {
      this.ngOnInit();
    }, 10000);
  }

  initFilter() {
    this.dataSource.filterPredicate = (data, filters) => {
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
    this.filter_temp = filter.trim().toLowerCase();
    this.dataSource.filter = filter.trim().toLowerCase();
  }

  openDialogAdd() {
    this.dialog.open(ManageDevicesComponent, {
      data: {},
      width: '800px',
      maxHeight: '900px',
      autoFocus: false
    }).afterClosed().subscribe(result => {
      if (result) this.addDevices(result);
    });
  }

  openDialogEdit(device) {
    this.dialog.open(ManageDevicesComponent, {
      data: {
        serial_number: device.serial_number,
        detail: device.detail
      },
      width: '800px',
      maxHeight: '900px',
      autoFocus: false
    }).afterClosed().subscribe(result => {
      if (result) {
        this.editDevices(
          device._id,
          result
        );
      }
    });
  }

  openDialogDelete(id, serial_number) {
    this.dialog.open(DeleteDialogComponent, {
      data: serial_number,
      width: '500px',
      autoFocus: false
    }).afterClosed().subscribe(result => {
      if (result) this.deleteDevices(id);
    });
  }

  getDevices() {
    this.service.get(
      'https://localhost:3000/devices'
    ).then((res: any) => {
      try {
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.initFilter();
        this.filter(this.filter_temp);
        setTimeout(() => { this.pageReady = true }, 500);
      } catch (e) { }
    });
  }

  addDevices(data) {
    this.service.post(
      'https://localhost:3000/devices',
      data
    ).then(() => {
      this.getDevices();
    });
  }

  editDevices(id, data) {
    this.service.put(
      'https://localhost:3000/devices',
      id,
      data
    ).then(() => {
      this.getDevices();
    });
  }

  deleteDevices(id) {
    this.service.delete(
      'https://localhost:3000/devices',
      id
    ).then(() => {
      this.getDevices();
    })
  }
}