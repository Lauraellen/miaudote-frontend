import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { PetService } from 'src/app/services/pet/pet.service';
declare var $: any;
import 'slick-carousel';
import { UploadServiceService } from 'src/app/services/upload/upload-service.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user/user.sevice';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-list-pets',
  templateUrl: './list-pets.component.html',
  styleUrls: ['./list-pets.component.css']
})
export class ListPetsComponent implements OnInit {

  @ViewChild('editPet') editPet!: TemplateRef<any>;
  @ViewChild('deletePet') deletePet!: TemplateRef<any>;

  @Input() getById: boolean = false;
  @Input() showButtonsToMenu: boolean = true;
  @Input() showButtonToProfile: boolean = false;
  @Input() showButtonToFavorite: boolean = false;

  listPets: any;
  loadingPets: boolean = false;
  slickCarousels: any[] = [];
  petToEdit: any;
  pet!: any;
  personId: string = '';

  constructor(
    private elementRef: ElementRef,
    private petService: PetService,
    private cdr: ChangeDetectorRef,
    private uploadService: UploadServiceService,
    private utilService: UtilsService,
    private userService: UserService,
    private authService: AuthService

  ) { }

  ngOnInit(): void {
    this.personId = this.authService.getUserId();
    if (this.getById) {
      if(this.showButtonToFavorite) {
        this.getListFavoritePetsByUser()
      } else {
        this.getListPetsByUser();
      }
      this.listPets = []
    } else {
      this.getPets();
    }

  }

  initializeCarousels() {
    const petCarousels = this.elementRef.nativeElement.querySelectorAll('.pet-carousel');

    petCarousels.forEach((petCarousel: any) => {
      const slickCarousels = petCarousel.querySelectorAll('.slick-carousel');

      slickCarousels.forEach((slickCarousel: any) => {
        $(slickCarousel).slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
          autoplay: false,
          infinite: true,
          autoplaySpeed: 5000
        });
      });
    });
  }

  getPets() {
    this.loadingPets = true;
    this.petService.getPets().pipe(take(1))
      .subscribe({
        next: response => {
          this.listPets = response;
          this.loadingPets = false;

          console.debug('listPets => ', this.listPets)
          this.cdr.detectChanges();
          this.initializeCarousels()

        }
      })
  }


  getListPetsByUser() {
    this.loadingPets = true;
    this.petService.getPetsByUser(this.personId).pipe(take(1))
      .subscribe({
        next: response => {
          this.listPets = response;
          this.loadingPets = false;

          this.cdr.detectChanges();
          this.initializeCarousels()

        }
      })
  }

  getListFavoritePetsByUser() {
    this.loadingPets = true;
    this.petService.getSavedPetsByUser(this.personId).pipe(take(1))
      .subscribe({
        next: response => {
          this.listPets = response;
          this.loadingPets = false;
          console.debug(this.listPets)
          this.cdr.detectChanges();
          this.initializeCarousels()

        }
      })
  }

  getPhotos(fileName: string) {
    this.uploadService.getAllFiles(fileName).snapshotChanges().pipe(
    ).subscribe(res => {
      console.debug(res)
    })
  }

  openModalToEdit(pet: any) {
    this.petToEdit = pet;
    this.utilService.openModal(this.editPet, {centered: true, size: 'lg'})
  }

  openModalToConfirm(pet: any) {
    this.pet = pet;    
    this.utilService.openModal(this.deletePet, {centered: true, size: 'sm'})

  }
 
  closeModal(modal: NgbActiveModal) {
    this.utilService.closeModal(modal)
  }

  addFavoritePet(pet: any) {
    const body = {
      idPet: pet._id,
      idUser: this.personId
    }

    this.userService.addFavoritePet(body).pipe(take(1))
    .subscribe({
      next: response => {
        console.debug(response)
      }
    })
    console.debug(pet)
  }

  removePet(pet: any) {
    console.debug(pet)
    this.petService.deletePet(pet._id).pipe(take(1))
    .subscribe({
      next: response => {
        if(response) {
          location.reload()
        }
      }
    })
  }

  removeFromFavorite(pet: any) {
    const body = {
      idPet: pet._id,
      idUser: this.personId
    }

    this.userService.removeFavoritePet(body).pipe(take(1))
    .subscribe({
      next: response => {
        console.debug(response)
      }
    })
    console.debug(pet)
  }
}
