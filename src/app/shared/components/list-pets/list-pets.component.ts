import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { PetService } from 'src/app/services/pet/pet.service';
declare var $: any;
import 'slick-carousel';
import { UploadServiceService } from 'src/app/services/upload/upload-service.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user/user.sevice';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-pets',
  templateUrl: './list-pets.component.html',
  styleUrls: ['./list-pets.component.css']
})
export class ListPetsComponent implements OnInit, OnDestroy {

  subscription: Subscription = new Subscription();

  options: AnimationOptions = {
    path: '../../assets/lotties/empty-list.json'
  };

  animationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(0.5)
  };

  styles: Partial<CSSStyleDeclaration> = {
    maxWidth: '500px',
    maxHeight: '200px',
    margin: '0 auto'
  };

  @ViewChild('editPet') editPet!: TemplateRef<any>;
  @ViewChild('deletePet') deletePet!: TemplateRef<any>;
  @ViewChild('modalConfirmRemover') modalConfirmRemover!: TemplateRef<any>;
  @ViewChild('modalSuccess') modalSuccess!: TemplateRef<any>;

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
  byFilter: boolean = false;
  petRemove: any;
  listPetsFavorites: any;
  titleModal: string = "";
  messageModal: string = "";
  goToLogin: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private petService: PetService,
    private cdr: ChangeDetectorRef,
    private uploadService: UploadServiceService,
    private utilService: UtilsService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,


  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.personId = this.authService.getUserId();
    if (this.getById) {
      if (this.showButtonToFavorite) {
        this.getListFavoritePetsByUser()
      } else {
        this.getListPetsByUser();
      }
      this.listPets = [];
    } else {
      this.getPets();
    }

    this.subscription.add(
      this.petService.getListPetsByFilterBehavior().subscribe({
        next: (res: any) => {
          this.loadingPets = true;
          if (res) {
            this.listPets = res;
            this.byFilter = true;
            this.loadingPets = false;
            this.cdr.detectChanges();
            this.initializeCarousels()

          }

          if (res?.length == 0) {
            this.byFilter = false;
          }

        }
      })
    )
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
          arrows: true,
          autoplay: false,
          infinite: false,
          autoplaySpeed: 5000,
        });
      });
    });
  }

  adoptPet(pet: any) {
    this.userService.getUser(pet.user).subscribe((res: any) => {
      console.debug(res)
      const mensagem = encodeURIComponent('Olá ' + res?.name + ' tudo bem? Estive procurando um aumigo na plataforma Miaudote e me interessei pelo ' + pet.name + '! Como posso fazer para adotá-lo?');
      const clearCelphone = res.celphone.replace(/\D/g, "")
      const phoneNumber = '+55' + clearCelphone;
      const linkWhatsApp = `https://wa.me/${phoneNumber}?text=${mensagem}`;
      window.open(linkWhatsApp);
    })
  }

  getPets() {
    if (this.personId) {
      this.getListFavoritePetsByUserOnMenu();
    }

    this.loadingPets = true;
    this.petService.getPets().pipe(take(1))
      .subscribe({
        next: response => {
          this.listPets = response;
          this.loadingPets = false;

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
          this.byFilter = false;
          this.cdr.detectChanges();
          this.initializeCarousels()

        },
        error: () => {
          this.listPets = [];
          this.loadingPets = false;
          this.byFilter = false;
        },
      })
  }

  getListFavoritePetsByUser() {
    this.loadingPets = true;
    this.petService.getSavedPetsByUser(this.personId).pipe(take(1))
      .subscribe({
        next: response => {
          this.listPets = response;
          this.listPetsFavorites = response;
          this.loadingPets = false;
          this.byFilter = false;
          this.cdr.detectChanges();
          this.initializeCarousels()

        },
        error: () => {
          this.listPets = [];
          this.loadingPets = false;
          this.byFilter = false;
        },
      })

  }

  getListFavoritePetsByUserOnMenu() {
    console.debug('aqui')
    this.petService.getSavedPetsByUser(this.personId).pipe(take(1))
      .subscribe({
        next: response => {
          this.listPetsFavorites = response;
          console.debug(this.listPetsFavorites)
          this.byFilter = false;
        },
        error: () => {
          this.listPetsFavorites = [];
        },
      })

  }

  getPhotos(fileName: string) {
    this.uploadService.getAllFiles(fileName).snapshotChanges().pipe(
    ).subscribe(res => {
    })
  }

  openModalToEdit(pet: any) {
    console.debug('pet => ', pet)
    this.petToEdit = pet;
    this.utilService.openModal(this.editPet, { centered: true, size: 'lg' })
  }

  openModalToConfirm(pet: any) {
    this.pet = pet;
    this.utilService.openModal(this.deletePet, { centered: true, size: 'sm' })

  }

  closeModal(modal: NgbActiveModal) {
    this.utilService.closeModal(modal)
  }

  addFavoritePet(pet: any) {

    if (this.personId) {
      const isOnList = this.listPetsFavorites.find((e: any) => e?._id == pet?._id);
      console.debug(isOnList)
      if (!isOnList) {
        const body = {
          idPet: pet._id,
          idUser: this.personId
        }
        this.titleModal = 'Pet adicionado!'
        this.messageModal = `O pet ${pet?.name} foi adicionado aos seus favoritos!`
        this.userService.addFavoritePet(body).pipe(take(1))
          .subscribe({
            next: response => {
              if (response) {
                this.utilService.openModal(this.modalSuccess, { centered: true, size: 'lg' });
                this.getListFavoritePetsByUserOnMenu();
              }
            }
          })
      } else {
        this.titleModal = 'Atenção!'
        this.messageModal = `O pet ${pet?.name} já está em sua lista de favoritos!`
        this.utilService.openModal(this.modalSuccess, { centered: true, size: 'lg' })
      }
    } else {
      this.titleModal = 'Atenção!'
      this.messageModal = `Faça login na plataforma Miaudote e adicione o pet em seus favoritos!`
      this.goToLogin = true;
      this.utilService.openModal(this.modalSuccess, { centered: true, size: 'lg' })
    }

  }

  removePet(pet: any) {
    this.petService.deletePet(pet._id).pipe(take(1))
      .subscribe({
        next: response => {
          if (response) {
            location.reload();
          }
        }
      })
  }

  openConfirmModal(pet: any) {
    this.utilService.openModal(this.modalConfirmRemover, { centered: true, size: 'lg' })
    this.petRemove = pet
  }

  removeFromFavorite() {
    const body = {
      idPet: this.petRemove._id,
      idUser: this.personId
    }

    this.userService.removeFavoritePet(body).pipe(take(1))
      .subscribe({
        next: response => {
          this.utilService.dismissAllModal();
          location.reload();
        }
      })
  }

  navigateToLogin() {
    this.utilService.dismissAllModal();
    this.router.navigate(['/login']);
  }
}
