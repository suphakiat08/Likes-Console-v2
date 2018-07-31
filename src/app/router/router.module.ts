import { RouterModule } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { DevicesComponent } from '../components/devices/devices.component';
import { MonitorComponent } from '../components/monitor/monitor.component';

const routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'device', component: DevicesComponent },
    { path: 'monitor', component: MonitorComponent }
];

export const RouteModule = RouterModule.forRoot(routes, {
    useHash: false
});