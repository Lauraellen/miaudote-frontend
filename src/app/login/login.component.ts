import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { take } from 'rxjs';
import { UserService } from '../services/user/user.sevice';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loginError: boolean = false;
  isNewAccount: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authServive: AuthService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,

  ) {

  }
  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      name: [null],
      celphone: [null],
      city: [''],
      registrationDate: [new Date()],
    })
  }

  login() {
    this.authServive.login(this.loginForm.getRawValue()).pipe(take(1))
    .subscribe({
      next: (response: any) => {
        this.authServive.setToken(response.token)
        this.authServive.setUserId(response.userId)
        this.router.navigate(['/adote'])
        this.loginError = false;
        
      },
      error: () => {
        this.loginError = true;

      },
    })
  }

  newAccount() {
    const body =  {...this.loginForm.getRawValue()}
    body.login = body.email;
    body.idSavedPets = []
  
    this.userService.createUser(body).pipe(take(1))
    .subscribe({
      next: (response: any) => {
        this.router.navigate(['/login'])
        this.loginError = false;
        
      },
      error: () => {
        this.loginError = true;

      },
    })
  }

  createAccount() {
    this.isNewAccount = true;
  }

  goToLogin() {
    this.isNewAccount = false
  }
}
