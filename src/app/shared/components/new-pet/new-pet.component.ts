import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { take } from 'rxjs';
import { FileUpload } from 'src/app/models/model-upload';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IbgeService } from 'src/app/services/ibge/ibge.service';
import { PetService } from 'src/app/services/pet/pet.service';
import { UploadServiceService } from 'src/app/services/upload/upload-service.service';

@Component({
  selector: 'app-new-pet',
  templateUrl: './new-pet.component.html',
  styleUrls: ['./new-pet.component.css']
})
export class NewPetComponent implements OnInit {

  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;

  genders: any[] = [
    {
      Id: 1,
      Name: 'Macho'
    },
    {
      Id: 2,
      Name: 'Fêmea'
    }
  ];

  states: any = [];

  cities: any = [];

  formPets!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ibgeService: IbgeService,
    private authService: AuthService,
    private petsService: PetService,
    private uploadService: UploadServiceService
  ) { }

  ngOnInit(): void {
    this.formPets = this.fb.group({
      name: [null],
      gender: [0],
      breed: [null],
      species: [null],
      age: [null],
      state: [0],
      city: [0],
      description: [null],
      status: ['Disponível'],
      registrationDate: [new Date()],
      idUser: [null],
      photos: [null],

    });

    this.getStates();
  }

  saveNewPet() {
    // const userId = this.authService.getUserId();
    // console.debug(this.selectedFiles)

    // const files = [];
    // for (const file of this.selectedFiles) {
    //   const fileName = file.name;
    //   const alt = fileName.split('.')[0];
    //   files.push({url: file.name, alt: alt})
    // }

    // const body = this.formPets.getRawValue()
    // body.idUser = userId
    // body.photos = files;
    // body.state = body.state.id

    // this.petsService.createPet(body).subscribe(res => {
    //   console.debug(res)
    // })
    // console.debug(JSON.stringify(body))
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
          percentage => {
            this.percentage = Math.round(percentage ? percentage : 0);
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }

  onStateSelect(event: any) {
    const state = this.formPets.get('state')?.value;
    this.ibgeService.getCitiesByStated(state.sigla).pipe(take(1)).subscribe({
      next: (response) => {
        this.cities = response;
      }
    })
  }

  getStates() {
    this.ibgeService.getStates().pipe(take(1)).subscribe({
      next: (response) => {
        this.states = response
      }
    })
  }

}
