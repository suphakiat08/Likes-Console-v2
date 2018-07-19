import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { DatabaseService } from '../../services/database.service';
import { ManageMonitorComponent } from './manage-monitor/manage-monitor.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  pageReady = false;
  displayedColumns = ['position', 'prod_name', 'device', 'switch', 'status', 'operation'];
  dataSource: any;
  dataStatus: {
    switch_off: number,
    online: number,
    offline: number
  }
  filter_temp = '';
  filter_status = '';

  constructor(
    private dialog: MatDialog,
    private service: DatabaseService
  ) { }

  ngOnInit() {
    this.getMonitor();
    setTimeout(() => {
      this.ngOnInit();
    }, 5000);
  }

  initStatus() {
    this.dataSource.filter = 'switch off';
    let switch_off = this.dataSource.filteredData.length;

    this.dataSource.filter = 'online';
    let online = this.dataSource.filteredData.length;

    this.dataSource.filter = 'offline';
    let offline = this.dataSource.filteredData.length;

    this.dataSource.filter = "";
    this.dataStatus = {
      switch_off: switch_off,
      online: online,
      offline: offline
    }
  }

  initFilter() {
    this.dataSource.filterPredicate = (data, filters) => {
      const matchFilter = [];
      const filterArray = filters.split('*');
      const columns = [data.prod_name, data.device.detail, data.statusText];

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

  filter(str) {
    let filter = this.filter_status ?
      str.trim().toLowerCase() + '*' + this.filter_status :
      str.trim().toLowerCase();
    this.filter_temp = str;
    this.dataSource.filter = filter;
    console.log(filter);
  }

  filterStatus(status) {
    this.dataSource.filter = status;
    this.filter_status = status;
  }

  getMonitor() {
    this.service.get(
      'https://localhost:3000/monitor'
    ).then((res: any) => {
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].status == 0) {
          res.data[i].statusText = "switch off";
        } else if (res.data[i].status > 0 && res.data[i].status < 4) {
          res.data[i].statusText = "online";
        } else {
          res.data[i].statusText = "offline";
        }
      }
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.initFilter();
      this.initStatus();
      this.filter(this.filter_temp);
      setTimeout(() => { this.pageReady = true }, 500);
    });
  }

  addMonitor(data) {
    console.log(data);
    this.service.post(
      'https://localhost:3000/monitor',
      data
    ).then(() => {
      this.getMonitor();
    });
  }

  editMonitor(id, data) {
    this.service.put(
      'https://localhost:3000/monitor',
      id,
      data
    ).then(() => {
      this.getMonitor();
    });
  }

  switchChange(data) {
    let status = data.switch > 0 ?
      0 : 1;

    const payload = {
      device: {
        serial_number: data.device.serial_number,
        detail: data.device.detail
      },
      switch: !data.switch,
      status: status
    }
    this.service.put(
      'https://localhost:3000/monitor',
      data._id,
      payload
    ).then(() => {
      this.getMonitor();
    });
  }

  deleteMonitor(id) {
    this.service.delete(
      'https://localhost:3000/monitor',
      id
    ).then(() => {
      this.getMonitor();
    })
  }

  openDialogAdd() {
    this.dialog.open(ManageMonitorComponent, {
      data: {},
      width: '800px',
      maxHeight: '900px',
      autoFocus: false
    }).afterClosed().subscribe(result => {
      if (result) {
        this.addMonitor(result);
      }
    });
  }

  openDialogEdit(device) {
    this.dialog.open(ManageMonitorComponent, {
      data: device,
      width: '800px',
      maxHeight: '900px',
      autoFocus: false
    }).afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.editMonitor(
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
      if (result) this.deleteMonitor(id);
    });
  }

  setStatus(status) {
    if (status <= 3 && status >= 1) {
      status = "online";
    } else if (status > 3) {
      status = "offline";
    } else {
      status = "switch off";
    }
    return status;
  }

  statusStyle(status) {
    let color;
    if (status <= 3 && status >= 1) {
      color = "rgba(0, 179, 24, 0.7)";
    } else if (status > 3) {
      color = "rgba(223, 15, 0, 0.7)";
    } else {
      color = "rgba(158, 158, 158, 0.7)";
    }

    return {
      "width": "75px",
      "color": "#fff",
      "background-color": color,
      "border-radius": "4px",
      "margin": "auto",
    };
  }
}