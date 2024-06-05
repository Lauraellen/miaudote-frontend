import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FilterComponent } from './components/filter/filter.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ListPetsComponent } from './components/list-pets/list-pets.component';
import { NewPetComponent } from './components/new-pet/new-pet.component';
import { ModalComponent } from './components/modal/modal.component';
import { FavoritePetsComponent } from './components/favorite-pets/favorite-pets.component';
import { SubscribesComponent } from './components/subscribes/subscribes.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicPipe } from './pipes/dynamic.pipe';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    SidebarComponent,
    FilterComponent,
    ProfileComponent,
    ListPetsComponent,
    NewPetComponent,
    ModalComponent,
    FavoritePetsComponent,
    SubscribesComponent,
    DynamicPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    LottieModule.forRoot({ player: playerFactory }),
    NgbDropdownModule,
  ],
  exports: [
    SidebarComponent,
    FilterComponent,
    ProfileComponent,
    ListPetsComponent,
    NewPetComponent,
    ModalComponent,
    FavoritePetsComponent,
    SubscribesComponent,
    DynamicPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
