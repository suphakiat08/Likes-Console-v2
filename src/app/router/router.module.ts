import { RouterModule } from '@angular/router';
import { DevicesComponent } from '../components/devices/devices.component';
import { MonitorComponent } from '../components/monitor/monitor.component';

const routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: DevicesComponent, data: { page: 'login' } },
    { path: 'device', component: DevicesComponent, data: { page: 'device' } },
    { path: 'monitor', component: MonitorComponent, data: { page: 'monitor' } }
];

export const RouteModule = RouterModule.forRoot(routes, {
    useHash: false
});