import { map, first, take, catchError, switchMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup, AsyncValidatorFn } from '@angular/forms';

export class BarcodeValidators {

    constructor() { }

    static correctLength(barcode: string): boolean {
        if (barcode.length !== 13)
            return false;

        return true;
    }

    static validChecksum(barcode: string): boolean {
        if (!this.correctLength(barcode)) return false;
        let sum = 0;
        for (let i = 0; i < 12; i++){
            sum += ((i % 2 === 0) ? 1 : 3) * Number.parseInt(barcode.charAt(i), 10);
        }
        let checksum = 10 - (sum % 10);
        return (Number.parseInt(barcode.charAt(12), 10) === checksum);
    }
    static checksumMustValidate(control: AbstractControl): ValidationErrors | null{
        if (!BarcodeValidators.validChecksum(control.value as string))
            return { checksumMustValidate: true};

        return null;
    }
}
