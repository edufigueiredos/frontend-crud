import {inject} from "@angular/core";

import {MatSnackBar} from "@angular/material/snack-bar";

export abstract class NotifyUtil {

  private _snackBar = inject(MatSnackBar);
  protected notify(message: string): void {
    this._snackBar.open(message, 'Fechar', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 6000
    })
  }
}
