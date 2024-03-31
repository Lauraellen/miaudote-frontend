import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpecieService {

  constructor(private http: HttpClient) { }

  getAllSpecies() {
    return this.http.get(`${environment.url}/specie`)
  }

}
