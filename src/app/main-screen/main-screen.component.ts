import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { PetService } from '../services/pet/pet.service';
import { take } from 'rxjs/operators';

declare var $: any;
import 'slick-carousel';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {

  isProfile: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((res: any) => {
      console.debug(res)
      this.isProfile = res.isProfile == "true" || res.isProfile == true ? true : false;
    });
  }

}
