import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { PetService } from '../services/pet/pet.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

declare var $: any;
import 'slick-carousel';
@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit, AfterViewInit{

  //listPets: any[] = [];

  listPets: any[] = [
    {
      name: 'Floquinho',
      breed: 'Vira-lata',
      age: '5 anos',
      city: 'Cambuí - MG',
      description: 'Minha avó faleceu e não podemos cuidar',
      photos: [
        { url: '/assets/images/golden-photo-01.jpeg', alt: 'Photo 1' },
        { url: '/assets/images/golden-photo-02.jpg', alt: 'Photo 2' },
        { url: '/assets/images/golden-photo-03.jpeg', alt: 'Photo 3' },
        { url: '/assets/images/golden-photo-04.jpg', alt: 'Photo 4' }
      ]

    },
    {
      name: 'Mili',
      breed: 'Siamês',
      age: 'indefinido',
      city: 'Cambuí - MG',
      description: 'Encontrei na rua e não posso ficar',
      photos: [
        { url: '/assets/images/golden-photo-01.jpeg', alt: 'Photo 1' },
        { url: '/assets/images/golden-photo-02.jpg', alt: 'Photo 2' },
        { url: '/assets/images/golden-photo-03.jpeg', alt: 'Photo 3' },
        { url: '/assets/images/golden-photo-04.jpg', alt: 'Photo 4' }
      ]
    },
    {
      name: 'Pantera',
      breed: 'Shih-tzu',
      age: '2 anos',
      city: 'Cambuí - MG',
      description: 'Foi resgatada',
      photos: [
        { url: '/assets/images/golden-photo-01.jpeg', alt: 'Photo 1' },
        { url: '/assets/images/golden-photo-02.jpg', alt: 'Photo 2' },
        { url: '/assets/images/golden-photo-03.jpeg', alt: 'Photo 3' },
        { url: '/assets/images/golden-photo-04.jpg', alt: 'Photo 4' }
      ]
    },
    {
      name: 'Mel',
      photos: [
        { url: '/assets/images/golden-photo-01.jpeg', alt: 'Photo 1' },
        { url: '/assets/images/golden-photo-02.jpg', alt: 'Photo 2' },
        { url: '/assets/images/golden-photo-03.jpeg', alt: 'Photo 3' },
        { url: '/assets/images/golden-photo-04.jpg', alt: 'Photo 4' }
      ]
    },
  ]
  slickCarousels: any[] = []; // Inicializa a propriedade slickCarousels como uma array vazia

  constructor(
    private elementRef: ElementRef,
    private petService: PetService,
  ) {}

  ngOnInit(): void {
    // this.getPets().subscribe(
    //   (pets: any[]) => {
    //     this.listPets = pets;
    //   },
    //   (error) => {
    //     console.error('Erro ao carregar pets', error);
    //   }
    // );
  }

  // ngAfterViewInit() {
  //   // this.slickCarousels.forEach((carousel, index) => {
  //   //   $(carousel).slick({
  //   //     slidesToShow: 1,
  //   //     slidesToScroll: 1,
  //   //     dots: true,
  //   //     arrows: true,
  //   //     autoplay: false,
  //   //     infinite: true
  //   //   });
  //   // });
  //   $(this.elementRef.nativeElement.querySelector('.slick-carousel')).slick({
  //     slidesToShow: 1,
  //     slidesToScroll: 1,
  //     dots: true,
  //     arrows: true,
  //     autoplay: false, // Desabilita o autoplay
  //     infinite: true
  //   });
  // }

  ngAfterViewInit() {
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

  getPets(): Observable<any[]> {
    return this.petService.getPets().pipe(
      map((res: any) => {
        if (res && Array.isArray(res)) {
          console.log(res)
          return res;
        } else return [];
      })
    ) as Observable<any[]>;
  }
}
