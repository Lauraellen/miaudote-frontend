import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loginError: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authServive: AuthService
  ) {

  }
  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]]
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
}
