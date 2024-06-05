import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { PetService } from '../services/pet/pet.service';
import { take } from 'rxjs/operators';

declare var $: any;
import 'slick-carousel';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../services/loader/loader.service';
import { UserService } from '../services/user/user.sevice';
import { AuthService } from '../services/auth/auth.service';
@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {

  isProfile: boolean = false;
  isFavorite: boolean = false;
  isSubscribes: boolean = false;
  userId!: string;
  notifications: any[] = [];
  
  constructor(
    private activatedRoute: ActivatedRoute,
    public loaderService: LoaderService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();

    this.activatedRoute.queryParams.subscribe((res: any) => {
      this.isProfile = res.isProfile == "true" || res.isProfile == true ? true : false;
      this.isFavorite = res.isFavorite == "true" || res.isFavorite == true ? true : false;
      this.isSubscribes = res.isSubscribes == "true" || res.isSubscribes == true ? true : false;
    });

    console.debug('userId => ',this.userId)
    if(this.userId) {
      this.getNotifications();
    }
  }


  getNotifications() {
    this.userService.getNotificationsByUser(this.userId).pipe(take(1)).subscribe({
      next: (response: any) => {
        this.notifications = response;
        console.debug('response => ', response)
      }
    })
  }

}
