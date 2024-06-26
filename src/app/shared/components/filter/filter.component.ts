import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IbgeService } from 'src/app/services/ibge/ibge.service';
import { PetService } from 'src/app/services/pet/pet.service';
import { SpecieService } from 'src/app/services/specie/specie.service';
import { UserService } from 'src/app/services/user/user.sevice';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input() isFromModal: boolean = false;

  formFilter!: FormGroup;
  species: any[] = [];
  agePets: any[] = [];

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


  constructor(
    private fb: FormBuilder,
    private ibgeService: IbgeService,
    private specieService: SpecieService,
    private petsService: PetService,
    private authService: AuthService,
    private userService: UserService,
    private utilsService: UtilsService

  ) { }

  ngOnInit(): void {
    this.formFilter = this.fb.group({
      specie: [null],
      gender: [null],
      age: [null],
      idState: [null],
      idCity: [null],
      breed: [null]
    });

    this.getStates();
    this.getSpecies();
    this.getAgePets();
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


  onStateSelect(event: any) {
    this.formFilter.get('idCity')?.setValue(null);
    const state = this.states.find((e: any) => e.id == this.formFilter.get('idState')?.value);
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

  clearSelection(control: string): void {

    const controls = this.formFilter.get(control);
    if (controls) {
      controls.setValue(null);
    }

    if(control == 'idState') {
      this.formFilter.get('idCity')?.setValue(null);
      this.cities = [];
    }
  }

  cleanFilters() {
    this.formFilter.reset();
    this.search(true);
  }

  search(isClean = false) {
    const body = this.formFilter.getRawValue();

    this.petsService.getPetsByFilter(body).pipe(take(1)).subscribe({
      next: (response) => {        
        this.petsService.setListPetsByFilterBehavior(response)
      },
      error: () => {
        this.petsService.setListPetsByFilterBehavior([])
      },
    })
  }

  savePetsInterest() {
    const body = {
      petData: this.formFilter.getRawValue(),
      idUser: this.authService.getUserId()
    }
    
    this.userService.addPetOfInterest(body).pipe(take(1)).subscribe({
      next: (response) => {
        this.utilsService.dismissAllModal();
      },
      error: () => {
      },
    })
  }
}
