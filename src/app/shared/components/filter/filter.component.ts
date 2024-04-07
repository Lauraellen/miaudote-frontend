import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { IbgeService } from 'src/app/services/ibge/ibge.service';
import { PetService } from 'src/app/services/pet/pet.service';
import { SpecieService } from 'src/app/services/specie/specie.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

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

  breeds: any[] = [
    {
      Id: 1,
      Name: 'Golden Retriver'
    },
    {
      Id: 2,
      Name: 'Shitzu'
    }
  ];


  constructor(
    private fb: FormBuilder,
    private ibgeService: IbgeService,
    private specieService: SpecieService,
    private petsService: PetService
  ) { }

  ngOnInit(): void {
    this.formFilter = this.fb.group({
      specie: [null],
      gender: [null],
      age: [null],
      state: [null],
      city: [null],
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

  onSpeciesSelect(_event: any) {

  }

  onGenderSelect(_event: any) {

  }

  onStateSelect(event: any) {
    const state = this.formFilter.get('state')?.value;

    this.ibgeService.getCitiesByStated(state.sigla).pipe(take(1)).subscribe({
      next: (response) => {
        this.cities = response;
      }
    })
  }

  onCitySelect(_event: any) {

  }

  onBreedSelect(_event: any) {

  }

  getStates() {
    this.ibgeService.getStates().pipe(take(1)).subscribe({
      next: (response) => {
        this.states = response
      }
    })
  }

  clearSelection(control: string): void {

    const speciesControl = this.formFilter.get(control);
    if (speciesControl) {
      speciesControl.setValue(0);
    }

    if(control == 'state') {
      this.formFilter.get('city')?.setValue(0);
      this.cities = [];
    }
  }

  search() {
    const body = this.formFilter.getRawValue();

    this.petsService.getPetsByFilter(body).pipe(take(1)).subscribe({
      next: (response) => {
        this.states = response
      }
    })
  }
}
