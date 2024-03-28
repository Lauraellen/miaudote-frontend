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
  percentage: number | undefined = 0;
  filesUploaded: any[] = [];

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
      idSpecie: [null],
      age: [null],
      idState: [0],
      idCity: [0],
      description: [null],
      status: ['Disponível'],
      registrationDate: [new Date()],
      idUser: [null],
      photos: [null],

    });

    this.getStates();
  }

  saveNewPet() {
    console.debug(this.filesUploaded)
    console.debug(this.currentFileUpload)
    const userId = this.authService.getUserId();
    console.debug(this.selectedFiles)

    const files = [];

    files.push({url: this.currentFileUpload?.url, alt: this.currentFileUpload?.name})
  
    const body = this.formPets.getRawValue()
    body.idUser = userId
    body.photos = files;
    body.idState = body.idState.id

    this.petsService.createPet(body).subscribe(res => {
      console.debug(res)
    })
    console.debug(JSON.stringify(body))
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.upload();
  }

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        console.debug('currentFileUpload => ', this.currentFileUpload)
        this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
          (percentage: number | undefined) => {
            this.percentage = percentage;
          }
        );


        // const url =  this.uploadService.pushFileToStorage(this.currentFileUpload).url;
        // const alt =  this.uploadService.pushFileToStorage(this.currentFileUpload).alt;
        // this.uploadService.pushFileToStorage(this.currentFileUpload).percentageChanges.pipe().subscribe(
        //   (res: any) => {
        //     this.percentage = res;
        //     console.debug(res)

        //     if(this.percentage === 100) {
        //       this.filesUploaded.push({url: url, alt: alt})
        //     }
        //   }
        // )
      }

      // file => {
      //   console.debug('percentage => ', file)
      //   // this.percentage = Math.round(file.percentage ? file.percentage : 0);
      //   this.filesUploaded.push({
      //     url: file.url, alt: file.name
      //   })
      // },
      // error => {
      //   console.log(error);
      // }
    }
  }

  onStateSelect(event: any) {
    const state = this.formPets.get('idState')?.value;
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
