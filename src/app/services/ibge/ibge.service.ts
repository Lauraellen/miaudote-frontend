import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IbgeService {

  api = '/api/v1';
  constructor(private http: HttpClient) { }

  getStates() {
    return this.http.get(`${environment.ibge}${this.api}/localidades/estados`)
  }

  getCitiesByStated(uf: string) {
    return this.http.get(`${environment.ibge}${this.api}/localidades/estados/${uf}/municipios`)
  }
}
