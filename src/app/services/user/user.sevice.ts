import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(private http: HttpClient) { }

  createUser(body: any) {
    return this.http.post(`${environment.url}/user`, body)
  }

  getUsers() {
    return this.http.get(`${environment.url}/user`);
  }

  getUser(id: String) {
    return this.http.get(`${environment.url}/user/${id}`);
  }

  updateUser(id: String, body: any) {    
    return this.http.put(`${environment.url}/user${id}`, body);
  }

  deleteUser(id: String) {
    return this.http.delete(`${environment.url}/user${id}`);
  }

  addFavoritePet(body: any) {
    return this.http.post(`${environment.url}/addFavoritePet`, body)
  }

  removeFavoritePet(body: any) {
    return this.http.post(`${environment.url}/addFavoritePet`, body)
  }
}