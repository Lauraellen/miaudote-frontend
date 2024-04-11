import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { PetService } from '../services/pet/pet.service';
import { take } from 'rxjs/operators';

declare var $: any;
import 'slick-carousel';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../services/loader/loader.service';
@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {

  isProfile: boolean = false;
  isFavorite: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((res: any) => {
      this.isProfile = res.isProfile == "true" || res.isProfile == true ? true : false;
      this.isFavorite = res.isFavorite == "true" || res.isFavorite == true ? true : false;
    });
  }

}
