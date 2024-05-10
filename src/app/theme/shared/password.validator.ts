import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value.confirmPassword === control.value.password
    ? null
    : { PasswordNoMatch: true };
};

// export function PasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
//   const password = control.get('password');
//   const confirmPassword = control.get('confirmPassword');
//   if (password.pristine || confirmPassword.pristine) {
//     return null;
//   }
//   return password && confirmPassword && password.value !== confirmPassword.value ? { 'misMatch': true } : null;
// }