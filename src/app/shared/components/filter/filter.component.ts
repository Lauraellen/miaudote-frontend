import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  states: any[] = [
    {
      Id: 1,
      Name: 'Minas Gerais'
    },
    {
      Id: 2,
      Name: 'São Paulo'
    }
  ];

  cities: any[] = [
    {
      Id: 1,
      Name: 'Cambuí'
    },
    {
      Id: 2,
      Name: 'Santa Rita do Sapucaí'
    }
  ];

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
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formFilter = this.fb.group({
      species: [0],
      gender: [0],
      minAge: [null, [Validators.min(0)]],
      maxAge: [null, [Validators.min(0)]],
      state: [0],
      city: [0],
      breed: [0]
    })
  }

  onSpeciesSelect(_event: any) {

  }

  onGenderSelect(_event: any) {

  }

  onStateSelect(_event: any) {

  }

  onCitySelect(_event: any) {

  }

  onBreedSelect(_event: any) {

  }

  clearSelection(control: string): void {
    const speciesControl = this.formFilter.get(control);
    if (speciesControl) {
      speciesControl.setValue(0);
    }
  }  
  
}
