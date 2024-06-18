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
    return this.http.put(`${environment.url}/user/${id}`, body);
  }

  deleteUser(id: String) {
    return this.http.delete(`${environment.url}/user/${id}`);
  }

  addFavoritePet(body: any) {
    return this.http.post(`${environment.url}/addFavoritePet`, body)
  }

  removeFavoritePet(body: any) {
    return this.http.post(`${environment.url}/removeFavoritePet`, body)
  }

  addPetOfInterest(body: any) {
    return this.http.post(`${environment.url}/addPetOfInterest`, body)
  }

  getPetOfInterestByUser(personId: string | undefined) {
    return this.http.get(`${environment.url}/getPetOfInterestByUser/${personId}`)
  }

  removePetOfInterest(body: any) {
    return this.http.post(`${environment.url}/removePetOfInterest`, body)

  }

  getNotificationsByUser(userId: string) {
    return this.http.get(`${environment.url}/getNotificationsByUser/${userId}`)
  }

  markNotificationsWasRead(notificationId: string, body?: any) {
    return this.http.put(`${environment.url}/notification/${notificationId}/marcar-lida/`, body)

  }
}
