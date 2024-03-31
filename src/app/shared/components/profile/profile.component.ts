import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.sevice';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @ViewChild('newPet') newPet!: TemplateRef<any>;

  userId!: string;
  loadingPerson: boolean = false;
  person: any;
  showPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  modeEdit: boolean = false;
  formProfile!: FormGroup;
  
  constructor(

    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private utilService: UtilsService
  ){

  }

  ngOnInit(): void {
    this.formProfile = this.fb.group({
      name: [null],
      email: [null, [Validators.email]],
      celphone: [null],
      city: [null],
      password: [null],
      newPassword: [null],
      confirmPassword: [null]
     
    });

    this.userId = this.authService.getUserId();
    if(this.userId) {
      this.getUser()
    }
  }

  togglePasswordVisibility(passwordInput: HTMLInputElement): void {
    this.showPassword = !this.showPassword;
    passwordInput.type = this.showPassword ? 'text' : 'password';
  }

  toggleNewPasswordVisibility(input: HTMLInputElement): void {
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = this.formProfile.get('newPassword')?.value;
    const confirmPassword = this.formProfile.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      this.formProfile.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      this.formProfile.get('confirmPassword')?.setErrors(null);
    }
  }

  getUser() {
    this.loadingPerson = true;
    this.userService.getUser(this.userId).pipe(take(1))
      .subscribe({
        next: response => {
          this.loadingPerson = false;
          this.person = response;
          this.setPerson();
          console.debug(response)
        }
      })
  }

  setPerson() {
    this.formProfile.patchValue(this.person)
    this.formProfile.disable({emitEvent: false, onlySelf: true})
  }

  editProfile() {
    this.modeEdit = true;
    this.formProfile.enable({emitEvent: false, onlySelf: true})
  }

  cancelEdit() {
    this.modeEdit = false;
    this.formProfile.disable({emitEvent: false, onlySelf: true})
  }

  saveProfile() {
    
  }

  goToLogin(isNewAccount?: boolean) {
    if(isNewAccount) {
      this.router.navigate(['/login'], { queryParams: { isNew: isNewAccount }})
    } else {
      this.router.navigate(['/login'])
    }
  }

  logout() {
    localStorage.clear();
    location.reload();
  }

  openModalNewPet() {
    this.utilService.openModal(this.newPet, {centered: true, size: 'lg'})
  }
 
  closeModal(modal: NgbActiveModal) {
    this.utilService.closeModal(modal)
  }
}
