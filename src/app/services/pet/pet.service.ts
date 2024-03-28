import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PetService {
  constructor(private http: HttpClient) { }

  createPet(body: any) {
    return this.http.post(`${environment.url}/pet`, body)
  }

  getPets() {
    return this.http.get(`${environment.url}/pet`);
  }

  getPet(id: String) {
    return this.http.get(`${environment.url}/pet${id}`);
  }

  updatePet(id: String, body: any) {    
    return this.http.put(`${environment.url}/pet${id}`, body);
  }

  deletePet(id: String) {
    return this.http.delete(`${environment.url}/pet${id}`);
  }

  //ex. body: {"idUser": 123456789}
  getPetsByUser(idUser: string) {
    return this.http.get(`${environment.url}/getPetsByUser/${idUser}`)
  }

  //ex. body: {"city": "Santa Rita do Sapucaí"}
  getPetsByCity(body: any) {
    return this.http.post(`${environment.url}/getPetsByCity`, body)
  }

  //ex. body: {"status": "available", "race": "Vira lata"}
  getPetsByFilter(body: any) {
    return this.http.post(`${environment.url}/getPetsByFilter`, body)
  }
}