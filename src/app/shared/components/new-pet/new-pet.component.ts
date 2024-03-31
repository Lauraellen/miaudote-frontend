import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { take } from 'rxjs';
import { FileUpload } from 'src/app/models/model-upload';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IbgeService } from 'src/app/services/ibge/ibge.service';
import { PetService } from 'src/app/services/pet/pet.service';
import { SpecieService } from 'src/app/services/specie/specie.service';
import { UploadServiceService } from 'src/app/services/upload/upload-service.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-new-pet',
  templateUrl: './new-pet.component.html',
  styleUrls: ['./new-pet.component.css']
})
export class NewPetComponent implements OnInit {

  selectedFiles?: FileList;
  // currentFileUpload?: FileUpload;
  currentFileUploads: FileUpload[] = [];

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
  agePets: any[] = [];
  cities: any = [];
  species: any[] = [];

  formPets!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ibgeService: IbgeService,
    private authService: AuthService,
    private petsService: PetService,
    private uploadService: UploadServiceService,
    private specieService: SpecieService,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    this.formPets = this.fb.group({
      name: [null],
      gender: [0],
      breed: [null],
      idSpecie: [0],
      typeSpecie: [null],
      age: [0],
      idAge: [null],
      idState: [0],
      idCity: [0],
      description: [null],
      status: ['Disponível'],
      registrationDate: [new Date()],
      idUser: [null],
      photos: [null],

    });

    this.getStates();
    this.getSpecies();
    this.getAgePets();
  }

  saveNewPet() {
    console.debug(this.filesUploaded);
    console.debug(this.currentFileUploads);
    const userId = this.authService.getUserId();
    console.debug(this.selectedFiles);
  
    const files = [];
  
    // Adicione todos os arquivos à lista de files
    for (const fileUpload of this.currentFileUploads) {
      files.push({ url: fileUpload.url, alt: fileUpload.name });
    }
    
    const body = this.formPets.getRawValue();
    const age = body.age;
    const specie = body.idSpecie;

    body.idUser = userId;
    body.photos = files;
    body.idState = body.idState.id;
    body.idAge = age.id;
    body.age = age.age;
    body.idSpecie = specie._id;
    body.typeSpecie = specie.type;
  
    this.petsService.createPet(body).subscribe(res => {
      console.debug(res);
      this.utilsService.dismissAllModal();
      location.reload();
    });
    console.debug(body);
  }

  getSpecies() {
    this.specieService.getAllSpecies().pipe(take(1)).subscribe({
      next: (response: any) => {
        this.species = response
      }
    })
  }

  getAgePets() {
    this.petsService.getAgePets().pipe(take(1)).subscribe({
      next: (response: any) => {
        this.agePets = response
      }
    })
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.upload();
  }

  upload(): void {
    if (this.selectedFiles) {
      // Limita o número de arquivos selecionados a 5
      const files: FileList = this.selectedFiles;
  
      // Itera sobre os arquivos selecionados
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        const fileUpload: FileUpload = new FileUpload(file);
        this.currentFileUploads.push(fileUpload);
  
        this.uploadService.pushFileToStorage(fileUpload).subscribe(
          (percentage: number | undefined) => {
            this.percentage = percentage;
          }
        );
      }
  
      // Limpa a lista de arquivos selecionados
      this.selectedFiles = undefined;
    }
  }

  // upload(): void {
  //   if (this.selectedFiles) {
  //     const file: File | null = this.selectedFiles.item(0);
  //     this.selectedFiles = undefined;

  //     if (file) {
  //       this.currentFileUpload = new FileUpload(file);
  //       console.debug('currentFileUpload => ', this.currentFileUpload)
  //       this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
  //         (percentage: number | undefined) => {
  //           this.percentage = percentage;
  //         }
  //       );
  //     }
  //   }
  // }

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
