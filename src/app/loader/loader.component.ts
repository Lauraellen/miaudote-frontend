import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {

  loading: boolean = false;
  loader = null
  constructor(private loaderService: LoaderService, private spinner: NgxSpinnerService) {
    const v = this.loaderService.loading$.subscribe((v) => {
      console.debug(v)
      this.loading = v;
      if (this.loading) {
        this.spinner.show()
      } else {
        this.spinner.hide()
      }
    });
  }

  ngOnInit(): void {
    console.debug('laoder')
  }
}