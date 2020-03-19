import { map, first, take, catchError, switchMap } from 'rxjs/operators';
import { UserService } from './../services/user.service';
import { Observable } from 'rxjs';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup, AsyncValidatorFn } from '@angular/forms';

export class UserValidators {
    static userService: UserService;

    constructor(userService: UserService) {
        UserValidators.userService = userService;
    }

    static cannotContainSpace(control: AbstractControl): ValidationErrors | null{
        if ((control.value as string).indexOf(' ') >= 0)
            return { cannotContainSpace: true};

        return null;
    }
    static newPwdEqual(gr: FormGroup): ValidationErrors | null {
        if (gr.get('password') && gr.get('passwordRepeat')){
            if (gr.get('password').value !== gr.get('passwordRepeat').value){
                return { newPwdEqual: true };
            }
        }
        return null;
    }
    static mustBeUnique(userService: UserService): AsyncValidatorFn {
        return (control: AbstractControl) => {
            return userService.headByUsername(control.value).pipe(
                map((status) => {
                    return (status === 204) ? null : { mustBeUnique: true};
                }),
                catchError(() => {
                    return null;
                }),
                take(1)
            );
        };
    }

    static emailMustBeUnique(userService: UserService): AsyncValidatorFn{
        return (control: AbstractControl) => {
            return userService.headByEmail(control.value).pipe(
                map(status => {
                    return (status === 204) ? null : { emailMustBeUnique: true};
                }),
                catchError(() => {
                    return null;
                }),
                take(1)
            );
        };
    }
}
