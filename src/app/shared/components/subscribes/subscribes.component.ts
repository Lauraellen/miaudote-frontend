import { Component, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { forkJoin, Observable } from 'rxjs';
import { first, map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IbgeService } from 'src/app/services/ibge/ibge.service';
import { PetService } from 'src/app/services/pet/pet.service';
import { SpecieService } from 'src/app/services/specie/specie.service';
import { UserService } from 'src/app/services/user/user.sevice';

@Component({
  selector: 'app-subscribes',
  templateUrl: './subscribes.component.html',
  styleUrls: ['./subscribes.component.css']
})
export class SubscribesComponent implements OnInit{

  personId: string | undefined;
  subscribes: any;

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
  agePets: any[] = [];
  cities: any = [];
  species: any[] = [];

  loadingCities: boolean = false;

  options: AnimationOptions = {
    path: '../../assets/lotties/empty-subscribes.json'
  };

  animationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(0.5)
  };

  styles: Partial<CSSStyleDeclaration> = {
    maxWidth: '500px',
    maxHeight: '200px',
    margin: '0 auto'
  };
  
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private petsService: PetService,
    private specieService: SpecieService,
    private ibgeService: IbgeService
  ){
  }

  ngOnInit(): void {
    this.personId = this.authService.getUserId();
    // Combina as observáveis e aguarda até que todas estejam concluídas

    forkJoin({
      agePets: this.getAgePets(),
      species: this.getSpecies(),
      states: this.getStates()
    }).pipe(
      take(1),
      map(({ agePets, species, states }) => {
        this.agePets = agePets;
        this.species = species;
        this.states = states;
        // Depois que ambas as observáveis forem concluídas, chame getSubscribesByPerson()
        this.getSubscribesByPerson();
      })
    ).subscribe();
  }
  

  getSubscribesByPerson() {
    this.userService.getPetOfInterestByUser(this.personId).pipe(take(1)).subscribe({
      next: (response: any) => {
        console.debug(response)
        this.subscribes = response;
        console.debug(this.species)
        for (const subscribe of this.subscribes) {
          subscribe.specieType = this.species.find((e: any) => e._id == subscribe.specie)?.type;
          subscribe.genderType = this.genders.find((g: any) => g.Id == subscribe.gender)?.Name;
          subscribe.ageType = this.agePets.find((a: any) => a._id == subscribe.age)?.age;
          subscribe.stateSigla = this.states.find((s: any) => s.id == subscribe.idState)?.sigla;
        }
        this.getCitiesForSubscribes();
      }
    })
  }

  removeSubscribe(subscribe: any) {
    console.debug(subscribe)
    const body = {
      petData: subscribe,
      idUser: this.personId
    }
    this.userService.removePetOfInterest(body).pipe(take(1)).subscribe({
      next: (response: any) => {
        this.getSubscribesByPerson();
      }
    })
  }

  getAgePets(): Observable<any[]> {
    return this.petsService.getAgePets().pipe(
      map((data: any) => data as any[])
    );
  }

  getSpecies(): Observable<any[]> {
    return this.specieService.getAllSpecies().pipe(
      map((data: any) => data as any[])
    );
  }

  getCitiesForSubscribes() {
    this.loadingCities = true;
    // Crie um array de observáveis de busca de cidades
    const cityObservables = this.subscribes.map((subscribe: any) => {
      return this.ibgeService.getCitiesByStated(subscribe.idState).pipe(
        take(1),
        map((response: any) => ({
          cityName: response.find((s: any) => s.id == subscribe.idCity && subscribe.idState == s.microrregiao.mesorregiao.UF.id)?.nome,
          subscribeId: subscribe._id
        }))
      );
    });

    // Espere até que todas as buscas por cidades sejam concluídas
    forkJoin(cityObservables).pipe(
      take(1)
    ).subscribe((cities: any) => {
      // Atualize as subscrições com os nomes das cidades encontradas
      cities.forEach((city: any) => {
        const subscribeToUpdate = this.subscribes.find((subscribe: any) => subscribe._id === city.subscribeId);
        if (subscribeToUpdate) {
          subscribeToUpdate.cityName = city.cityName;
        }
      });
      this.loadingCities = false
      console.debug(this.subscribes);
    });
  }

  // onStateSelect(idState: any) {
  //   this.loadingCities = true;
  //   this.ibgeService.getCitiesByStated(idState).pipe(take(1)).subscribe({
  //     next: (response) => {
  //       this.cities = response;
  //       this.loadingCities = false;
  //       for (const subscribe of this.subscribes) {
  //         subscribe.cityName = this.cities.find((s: any) => s.id == subscribe.idCity && idState == subscribe?.microrregiao?.mesorregiao?.UF?.id)?.nome;
  //       }

  //       console.debug(this.subscribes)

  //     }
  //   })
  // }

  getStates() {
    return this.ibgeService.getStates().pipe(
      map((data: any) => data as any[])
    );
  }

}
