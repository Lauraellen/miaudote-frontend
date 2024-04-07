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



@NgModule({
  declarations: [
    SidebarComponent,
    FilterComponent,
    ProfileComponent,
    ListPetsComponent,
    NewPetComponent,
    ModalComponent,
    FavoritePetsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  exports: [
    SidebarComponent,
    FilterComponent,
    ProfileComponent,
    ListPetsComponent,
    NewPetComponent,
    ModalComponent,
    FavoritePetsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
