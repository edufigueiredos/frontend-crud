import {FormControl} from "@angular/forms";

export interface  DateRangeFormModel {
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
}

export interface  DateRangeModel {
  startDate: Date | null;
  endDate: Date | null;
}
