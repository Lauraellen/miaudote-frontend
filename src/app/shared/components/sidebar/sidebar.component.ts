import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(
    private router: Router,

  ){}
  
  navigateTo() {
    console.debug('auqi')
  }

  navigateToHome() {
    this.router.navigate(['/adote'], { queryParams: { isProfile: false }})

  }

  navigateToProfile() {
    this.router.navigate(['/meu-perfil'], { queryParams: { isProfile: true }})

  }
}
