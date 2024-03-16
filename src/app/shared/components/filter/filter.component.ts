import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { IbgeService } from 'src/app/services/ibge/ibge.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  formFilter!: FormGroup;
  species: any[] = [
    {
      Id: 1,
      Name: 'Cachorro'
    },
    {
      Id: 2,
      Name: 'Gato'
    }
  ];

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
    private ibgeService: IbgeService
  ) { }

  ngOnInit(): void {
    this.formFilter = this.fb.group({
      species: [0],
      gender: [0],
      minAge: [null, [Validators.min(0)]],
      maxAge: [null, [Validators.min(0)]],
      state: [0],
      city: [0],
      breed: [0]
    });

    this.getStates();
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

}
