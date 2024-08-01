import {Component, DestroyRef, inject, OnInit, output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";

import {MatInputModule} from "@angular/material/input";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {debounceTime, distinctUntilChanged, map, startWith} from "rxjs";

import {DateRangeFormModel, DateRangeModel} from "../../../../models/date-range-form.model";
import {MatIconModule} from "@angular/material/icon";
import {CampaignSort} from "../../../../models/campaigns/campaign";
import {MatSelectModule} from "@angular/material/select";

@Component({
  selector: 'app-campaigns-filter',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, MatIconModule, MatSelectModule],
  templateUrl: './campaigns-filter.component.html',
  styleUrl: './campaigns-filter.component.scss'
})
export class CampaignsFilterComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);

  protected searchControl = new FormControl<string | null>(null)
  protected dateForm = new FormGroup<DateRangeFormModel>({
    startDate: new FormControl(null),
    endDate: new FormControl(null)
  });
  protected sortByControl = new FormControl<CampaignSort | null>(null)
  protected orderBy: Array<CampaignSort> = [
    {
      key: 'title',
      label: 'Título (decrescente)',
      sort: 'desc'
    },
    {
      key: 'title',
      label: 'Título (crescente)',
      sort: 'asc'
    },
    {
      key: 'createdAt',
      label: 'Data de criação (decrescente)',
      sort: 'desc'
    },
    {
      key: 'createdAt',
      label: 'Data de criação (crescente)',
      sort: 'asc'
    },
  ]

  public dateSelected = output<DateRangeModel>();
  public textFilter = output<string | null>();
  public sortBy = output< CampaignSort| null>();

  ngOnInit(): void {
    this._listenDateForm();
    this._listenSeachControl();
    this._listenOrderByControl();
  }

  private _listenDateForm(): void {
    this.dateForm.valueChanges
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        debounceTime(500)
      )
      .subscribe(value => {
        if (this.dateForm.controls.startDate && this.dateForm.controls.endDate) {
          this.dateSelected.emit(this.dateForm.value as DateRangeModel)
        } else {
          this.dateSelected.emit({startDate: null, endDate: null})
        }
      })
  }

  private _listenSeachControl(): void {
    this.searchControl.valueChanges
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        distinctUntilChanged(),
        startWith(''),
        debounceTime(500),
        map(value => value ? value.toLowerCase() : null)
      )
      .subscribe(value => {
        this.textFilter.emit(value)
      });
  }

  private _listenOrderByControl(): void {
    this.sortByControl.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(value => this.sortBy.emit(value))
  }
}
