import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { PetService } from 'src/app/services/pet/pet.service';
declare var $: any;
import 'slick-carousel';

@Component({
  selector: 'app-list-pets',
  templateUrl: './list-pets.component.html',
  styleUrls: ['./list-pets.component.css']
})
export class ListPetsComponent implements OnInit {

  @Input() getById: boolean = false;
  @Input() personId: number = 0;

  listPets: any;
  loadingPets: boolean = false;
  slickCarousels: any[] = [];

  constructor(
    private elementRef: ElementRef,
    private petService: PetService,
    private cdr: ChangeDetectorRef

  ) { }

  ngOnInit(): void {
    if(this.getById) {
      console.debug(this.personId)
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

          this.cdr.detectChanges();
          this.initializeCarousels()
          
        }
      })
  }
}
