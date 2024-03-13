import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  }, 
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "adote",
    component: MainScreenComponent

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }