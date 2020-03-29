import { NotFoundError } from './../common/not-found-error';
import { AppError } from './../common/app-error';
import { FridgeManagerService } from './../fridge-manager.service';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { FridgeService } from './../services/fridge.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Fridge } from '../models/fridge';

@Component({
  selector: 'app-fridge-settings',
  templateUrl: './fridge-settings.component.html',
  styleUrls: ['./fridge-settings.component.css']
})
export class FridgeSettingsComponent implements OnInit {

  fridge: Fridge;
  notFound = false;

  form = new FormGroup({
    input: new FormControl('', [Validators.email, Validators.required]),
    creator: new FormControl(''),
    members: new FormArray([])
  });
  constructor(
    private router: ActivatedRoute,
    private fridgeService: FridgeService,
    private fridgeManager: FridgeManagerService
  ) {
    this.router.paramMap
      .pipe(
        switchMap(params => {
          let fridgeId = params.get('fridgeId');
          return this.fridgeService.get(fridgeId, true);
        })
      )
      .subscribe(fridge => {
        this.updateFridge(fridge);
      });
  }

  private updateFridge(fridge: Fridge) {
    this.fridge = fridge;
    this.members.clear();
    fridge.owner.forEach(owner => {
      if (fridge.creator.uuid === owner.uuid)
        this.creator.setValue(owner.displayname + ' (creator)');
      else
        this.members.push(new FormControl(owner.displayname));
    });
  }

  get members(): FormArray {
    return this.form.get('members') as FormArray;
  }
  get creator(): FormControl {
    return this.form.get('creator') as FormControl;
  }
  get input(): FormControl {
    return this.form.get('input') as FormControl;
  }
  addUser(email: HTMLInputElement) {
    email.blur(); // to trigger potential error messages

    if (this.input.invalid) return;

    this.fridgeManager.addOwner(this.fridge.id, email.value)
      .subscribe(fridge => {
        this.updateFridge(fridge);
        email.value = '';
        this.notFound = false;
      }, (error: AppError) => {
        if (error instanceof NotFoundError) {
          this.notFound = true;
        } else {
          throw error;
        }
      });
  }
  removeUser(member: FormControl) {
    if (!confirm('Are you sure you want to delete the user ' + member.value + ' from the fridge?')) return;

    let delMember = this.fridge.owner.find(owner => owner.displayname === member.value);

    this.fridgeManager.removeOwner(this.fridge.id, delMember)
      .subscribe(() => {
        let index = this.members.controls.indexOf(member);
        this.members.controls.splice(index, 1);
      });
  }

  removeFridge() {
    this.fridgeService.delete(this.fridge.id).subscribe();
  }

  ngOnInit() {
  }

}
