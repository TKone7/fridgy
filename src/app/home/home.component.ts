import { AuthService } from './../services/auth.service';
import { User } from './../models/user';
import { UnauthorizedError } from './../common/unauthorized-error';
import { TokenExpiredError } from './../common/token-expired-error';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DummyDataService } from '../services/dummy-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  data: any;
  currentUser: User;
  currentUserSubs: Subscription;

  constructor(
    private dummyService: DummyDataService,
    private authService: AuthService) {
    this.currentUserSubs = authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubs.unsubscribe();
  }

}
