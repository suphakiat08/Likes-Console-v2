import { RouterModule } from '@angular/router';
import { DevicesComponent } from '../components/devices/devices.component';
import { MonitorComponent } from '../components/monitor/monitor.component';

const routes = [
    { path: '', redirectTo: 'device', pathMatch: 'full' },
    { path: 'device', component: DevicesComponent, data: { page: 'device' } },
    { path: 'monitor', component: MonitorComponent, data: { page: 'monitor' } }
];

export const RouteModule = RouterModule.forRoot(routes, {
    useHash: false
});