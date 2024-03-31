import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  isHomeSelected = false;
  isNotificationsSelected = false;
  isBookmarksSelected = false;
  isProfileSelected = false;

  constructor(
    private router: Router,

  ){}
  
  navigateTo() {
    console.debug('auqi')
  }

  navigateToHome() {
    this.isHomeSelected = true;
    this.isNotificationsSelected = false;
    this.isBookmarksSelected = false;
    this.isProfileSelected = false;
    this.router.navigate(['/adote'], { queryParams: { isProfile: false }})

  }

  navigateToProfile() {
    this.isHomeSelected = false;
    this.isNotificationsSelected = false;
    this.isBookmarksSelected = false;
    this.isProfileSelected = true;
    this.router.navigate(['/meu-perfil'], { queryParams: { isProfile: true }})

  }
}
