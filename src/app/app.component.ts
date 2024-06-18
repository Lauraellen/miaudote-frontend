import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from './services/utils/utils.service';
import { AuthService } from './services/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private readonly _message = new BehaviorSubject<any>(undefined);

  @ViewChild('subscribePets') subscribePets!: TemplateRef<any>;

  title = 'miaudote-frontend';

  message$ = this._message.asObservable();
  personId: any;
  showButton: boolean = false;

  constructor(
    private utilsService: UtilsService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.personId = this.authService.getUserId();

    if(!this.personId) {
      this.showButton = false;
    } else {
      this.showButton = true;

    }

    console.debug(this.personId)
  }

  closeModal(modal: NgbActiveModal) {
    this.utilsService.closeModal(modal)
  }

  openModal() {

    if(!this.personId) {
      this.showButton = false;
      this.router.navigate(['/login']);
      return
    }


    this.utilsService.openModal(this.subscribePets, {size: 'lg', centered: true})
  }
}
