import { Fridge } from './../models/fridge';
import { FridgeService } from './../services/fridge.service';
import { Observable } from 'rxjs';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent implements OnInit {
  currentUser: User;
  isShown = false;
  fridges: Fridge[] = [];
  currentFridge$: Observable<Fridge>;

  constructor(
    public authService: AuthService,
    private router: Router,
    private fridgeService: FridgeService
  ) {
      this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
        this.currentFridge$ = fridgeService.currentFridge;
        if (this.currentUser)
          this.fridgeService.getAll().subscribe(fridges => this.fridges = fridges);
        else
          this.fridges = [];
      });
    }

  ngOnInit() {
  }

  activateFridge(fridge: Fridge){
    this.toggleBurger();
    this.fridgeService.setFridgeToLocal(fridge);
    console.log('tolocal: ', fridge);
  }
  toggleBurger(){
    this.isShown = !this.isShown;
  }

  onLogout() {
    this.fridgeService.setFridgeToLocal(null);
    this.authService.logout().subscribe(() => {
      this.router.navigate([ '/' ]);
    });
  }

  removeFridge() {
    this.fridgeService.setFridgeToLocal(null);
  }

}
