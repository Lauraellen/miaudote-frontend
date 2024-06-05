import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { PetService } from '../services/pet/pet.service';
import { take } from 'rxjs/operators';

declare var $: any;
import 'slick-carousel';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../services/loader/loader.service';
import { UserService } from '../services/user/user.sevice';
import { AuthService } from '../services/auth/auth.service';
import { format } from 'date-fns';
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
    private authService: AuthService,
    private petService: PetService,
    private router: Router
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

        this.notifications.forEach(e => {
          e.createDate = format(new Date(e?.notificationDate), 'dd/MM/yyyy');
        })
        console.debug('response => ', response)
      }
    })
  }

  filterPet(notification: any) {
    this.petService.getPet(notification.petId).pipe(take(1)).subscribe({
      next: (response: any) => {
        if(response) {
          

          const body = {
            specie: response?.specie?._id,
            gender: response?.gender,
            age: response?.age?._id,
            idState: response?.age?.idState,
            idCity: response?.age?.idCity,
            breed: response?.age?.breed,
          };

          this.petService.getPetsByFilter(body).pipe(take(1)).subscribe({
            next: (response) => {        
              this.petService.setListPetsByFilterBehavior(response);
              this.router.navigate([`/adote`]);
            },
            error: () => {
              this.petService.setListPetsByFilterBehavior([])
            },
          })
        }
      }
    })
  }
}
