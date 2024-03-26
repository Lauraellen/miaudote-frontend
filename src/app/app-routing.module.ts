import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './shared/components/profile/profile.component';


const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "adote",
    component: MainScreenComponent
  },
  {
    path: "meu-perfil",
    component: MainScreenComponent
  },
  {
    path: "",
    redirectTo: "adote",
    pathMatch: "full"
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }