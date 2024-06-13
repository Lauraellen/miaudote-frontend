import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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

  @ViewChild('modalSuccess') modalSuccess!: TemplateRef<any>;

  @Input() pet!: any;
  selectedFiles?: FileList;
  // currentFileUpload?: FileUpload;
  currentFileUploads: FileUpload[] = [];
  allFilesUploded: boolean = false;
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
  titleModal: string = "";
  messageModal: string = "";

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
      name: [null, [Validators.required]],
      gender: [0, [Validators.required]],
      breed: [null],
      specie: [0, [Validators.required]],
      age: [0, [Validators.required]],
      idState: [0, [Validators.required]],
      idCity: [0, [Validators.required]],
      description: [null],
      status: ['Disponível'],
      registrationDate: [new Date()],
      user: [null],
      photos: [null, [Validators.required]],
    });

    this.getStates();
    this.getSpecies();
    this.getAgePets();

    if (this.pet) {
      this.filesUploaded = this.pet.photos
      this.setData();
    }

    console.debug(this.formPets)
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
    if(this.currentFileUploads.length) {
      for (const fileUpload of this.currentFileUploads) {
        files.push({ url: fileUpload.url, alt: fileUpload.name });
      }
    }

    if(this.filesUploaded.length) {
      for (const fileUpload of this.filesUploaded) {
        files.push({ url: fileUpload.url, alt: fileUpload.alt});
      }
    }

    const body = this.formPets.getRawValue();

    body.user = {_id: userId};
    body.photos = files ;
    body.specie = {_id: body.specie};
    body.age = {_id: body.age}

    if(!this.pet) {
      this.petsService.createPet(body).subscribe(res => {
        this.utilsService.dismissAllModal();

        this.utilsService.openModal(this.modalSuccess, {centered: true, size: 'md'});
        this.titleModal = `Pet cadastrado!`;
        this.messageModal = `O pet ${body.name} foi cadastrado com sucesso!`
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
        this.formPets.get('photos')?.setValue(this.currentFileUploads)
        this.uploadService.pushFileToStorage(fileUpload).subscribe(
          (percentage: number | undefined) => {
            this.percentage = percentage;

            if(this.percentage == 100) {
              this.allFilesUploded = true;
            }
          }
        );
      }

      // Limpa a lista de arquivos selecionados
      this.selectedFiles = undefined;
    }
  }

  removeFile(file: any): void {
    console.debug(file)

    if(this.filesUploaded.length > 0) {
      this.filesUploaded = this.filesUploaded.filter((e: any) => e._id != file._id)
      this.formPets.get('photos')?.setValue(this.filesUploaded.length == 0 ? null : this.filesUploaded)

    }

    if(this.currentFileUploads.length > 0) {
      this.currentFileUploads = this.currentFileUploads.filter((e:any) => e.name != file.name)
      this.formPets.get('photos')?.setValue(this.currentFileUploads.length == 0 ? null : this.currentFileUploads)

    }

    console.debug('filesUploaded => ', this.currentFileUploads)

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

  closeModal(modal: NgbActiveModal) {
    this.utilsService.closeModal(modal);
    location.reload();
  }

}
