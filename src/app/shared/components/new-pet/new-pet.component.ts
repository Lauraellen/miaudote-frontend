import { Component, Input, OnInit } from '@angular/core';
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

  @Input() pet!: any;
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
      specie: [0],
      age: [0],
      idState: [0],
      idCity: [0],
      description: [null],
      status: ['Disponível'],
      registrationDate: [new Date()],
      user: [null],
      photos: [null],
    });

    this.getStates();
    this.getSpecies();
    this.getAgePets();

    if (this.pet) {
      this.setData();
    }
  }

  setData() {
    this.formPets.patchValue(this.pet)
    this.formPets.get('age')?.setValue(this.pet.age._id)
    this.formPets.get('specie')?.setValue(this.pet.specie._id)

  }

  saveNewPet() {
    const userId = this.authService.getUserId();

    const files = [];

    // Adicione todos os arquivos à lista de files
    for (const fileUpload of this.currentFileUploads) {
      files.push({ url: fileUpload.url, alt: fileUpload.name });
    }

    const body = this.formPets.getRawValue();
    const age = body.age;
    const specie = body.specie;

    body.user = {_id: userId};
    body.photos = this.pet.photos ?? files ;
    body.specie = {_id: body.specie};
    body.age = {_id: body.age}

    if(!this.pet) {
      this.petsService.createPet(body).subscribe(res => {
        this.utilsService.dismissAllModal();
        location.reload();
      });
    } else {
      this.petsService.updatePet(this.pet._id, body).subscribe(res => {
        this.utilsService.dismissAllModal();
        location.reload();
      });
    }
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

  onStateSelect(event: any) {
    const state = this.states.find((e: any) => e.id == this.formPets.get('idState')?.value)
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

        if(this.pet) {
          this.formPets.get('idState')?.setValue(parseInt(this.pet.idState))
          const sigla = this.states.find((e: any) => e.id == parseInt(this.pet.idState))
          this.onStateSelect(sigla);
        }
      }
    })
  }

}
