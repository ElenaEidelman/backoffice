import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../app/admin/login/login.component';
import { AdminComponent } from '../app/admin/admin/admin.component';
import { EditingComponent } from './admin/editing/editing.component';
import { AdminLoginGuard } from '../app/guard/admin-login.guard';


const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "admin", component:AdminComponent, children :[
    {path: "editing/:id", component: EditingComponent}
  ], canActivate: [AdminLoginGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AdminLoginGuard]
})
export class AppRoutingModule { }
