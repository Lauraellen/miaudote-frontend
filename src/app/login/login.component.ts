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
    this.authServive.login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value, this.loginForm.getRawValue())
      .then(() => {
        console.log('Login bem-sucedido.');
        this.loginError = false;
      })
      .catch(() => {
        console.error('Erro ao fazer login.');
        this.loginError = true;
      });
  }

  newAccount() {
    const body =  {...this.loginForm.getRawValue()}
    body.login = body.email;
    body.idSavedPets = []
  
    this.userService.createUser(body).pipe(take(1))
    .subscribe({
      next: (response: any) => {
        this.authServive.newUser(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
        this.router.navigate(['/login'])
        this.loginError = false;
        
      },
      error: () => {
        this.loginError = true;

      },
    })
  }

  public registerUser() {
    const body =  {...this.loginForm.getRawValue()}
    body.login = body.email;
    body.idSavedPets = []

    this.userService.createUser(body).pipe(take(1)).subscribe({
      next: (response: any) => {
        this.authServive.newUser(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value).then(() => {
          this.router.navigate(['/login']);
          this.loginError = false;
        }).catch((error) => {
          console.error('Erro ao criar usuário no Firebase:', error);
          // Lidar com o erro de criação de usuário no Firebase, se necessário
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        console.error('Erro ao criar usuário no backend:', error);
        // Lidar com o erro de criação de usuário no backend, se necessário
        this.router.navigate(['/login']);
      }
    });
  }

  
  createAccount() {
    this.loginError = false;
    this.isNewAccount = true;
  }

  goToLogin() {
    this.isNewAccount = false
  }
}
