import {Component, inject, signal, ViewChild, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatFormFieldModule} from "@angular/material/form-field";

import {NotifyUtil} from "../../utils/notify/notify.util";
import {DateRangeModel} from "../../models/campaigns/date-range-form.model";
import {ModalComponent} from "../../components/modal/modal.component";
import {CampaignsService} from "../../services/campaigns/campaigns.service";
import {CampaignCardComponent} from "./components/campaign-card/campaign-card.component";
import {CampaignsFilterComponent} from "./components/campaigns-filter/campaigns-filter.component";
import {ImageUploadComponent} from "../../components/image-upload/image-upload.component";
import {Campaign, CampaignFilter, CampaignForm, CampaignParams, CampaignSort} from "../../models/campaigns/campaign";
import {CampaignPagination} from "../../models/pagination/pagination.model";

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    CampaignsFilterComponent,
    CampaignCardComponent,
    ModalComponent,
    ImageUploadComponent
  ],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.scss'
})
export class CampaignsComponent extends NotifyUtil {
  @ViewChild('paginator') paginator!: MatPaginator

  private _campaignsService = inject(CampaignsService)
  private _campaignFilter!: CampaignFilter;
  private _campaignSort: CampaignSort = {
    sort: "desc",
    key: "createdAt",
  }

  protected pagination: CampaignPagination = {
    pageIndex: 0,
    pageSize: 5,
    pageSizeOptions: [5, 10, 15, 20],
    length: 0,
  }
  protected campaignParams: CampaignParams = {
    sort: this._campaignSort,
  }
  protected createOrEditCampaignModal = false
  protected deleteCampaignWarningModal = false;
  protected allCampaignsList: WritableSignal<Array<Campaign>> = signal([])
  protected campaignsList: WritableSignal<Array<Campaign>> = signal([])
  protected campaignToDelete: WritableSignal<Campaign | null> = signal(null)
  protected campaignToEdit: WritableSignal<Campaign | null> = signal(null)
  protected campaignForm = new FormGroup<CampaignForm>({
    id: new FormControl<string | null>(null),
    title: new FormControl<string | null>('', [Validators.required]),
    description: new FormControl<string>('', [Validators.required]),
    imageUrl: new FormControl<string>('', [Validators.required]),
    createdAt: new FormControl<Date | string | null>(null)
  })

  private _getCampaigns(): void {
    this._campaignsService
      .getCampaigns(this.campaignParams)
      .subscribe(data => {
        this.allCampaignsList.set(data);
        this.pagination = {
          ...this.pagination,
          length: data.length,
          pageIndex: 0
        }
        this.setItensOnPage()
      });
  }

  protected confirmCampaignDeletion(id: string | null): void {
    if (id) {
      const campaign = this.campaignsList().find(campaign => campaign.id === id)
      if (campaign) {
        this.campaignToDelete.set(campaign);
        this.openDeleteConfirmationModal();
      }
    }
  }

  protected deleteCampaign(id: string | null | undefined): void {
    if (id) {
      this._campaignsService.deleteCampaign(id).subscribe(() => {
        this._getCampaigns();
        this.notify('Apagado com sucesso!')
        this.closeDeleteConfirmationModal();
      });
    }
  }

  protected registerCampaign(): void {
    const newCampaign: Campaign = {
      title: this.campaignForm.value.title as string,
      description: this.campaignForm.value.description as string,
      imageUrl: this.campaignForm.value.imageUrl as string,
      createdAt: new Date()
    }

    this._campaignsService
      .saveCampaign(newCampaign)
      .subscribe(_ => {
        this.notify('Cadastrado com sucesso!');
        this._getCampaigns();
        this.closeCreateOrEditModal()
      });
  }

  protected editCampaign(): void {
    const campaignToEdit: Campaign = {
      id: this.campaignForm.value.id,
      title: this.campaignForm.value.title as string,
      description: this.campaignForm.value.description as string,
      imageUrl: this.campaignForm.value.imageUrl as string,
      createdAt: this.campaignForm.value.createdAt as string
    }
    this._campaignsService
      .editCampaign(campaignToEdit)
      .subscribe(campaign => {
        const index = this.campaignsList().findIndex(campaign => campaign.id === campaignToEdit.id)
        this.campaignsList()[index] = {...campaign};
        this.notify('Editado com sucesso!');
        this.closeCreateOrEditModal()
      });
  }

  protected setToEditCampaign(campaign: Campaign): void {
    this.campaignToEdit.set(campaign);
    this.campaignForm.setValue({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      imageUrl: campaign.imageUrl,
      createdAt: campaign.createdAt
    });

    this.openCreateOrEditModal();
  }

  protected handlePageEvent(event: PageEvent): void {
    this.pagination = {
      ...this.pagination,
      length: event.length,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex,
    }

    this.setItensOnPage()
  }

  protected setItensOnPage(): void {
    const index = this.pagination.pageIndex + 1;
    const perPage = this.pagination.pageSize;
    const lastItem = perPage * index;
    const firstItem = lastItem - perPage;

    const campaignsOnPage: Campaign[] = this.allCampaignsList().filter((item, index) => index >= firstItem && index < lastItem);
    this.campaignsList.set(campaignsOnPage);
  }

  protected openDeleteConfirmationModal(): void {
    this.deleteCampaignWarningModal = true;
  }

  protected closeDeleteConfirmationModal(): void {
    this.deleteCampaignWarningModal = false;
  }

  protected openCreateOrEditModal(): void {
    this.createOrEditCampaignModal = true
  }

  protected closeCreateOrEditModal(): void {
    this.createOrEditCampaignModal = false;
    this.campaignToEdit.set(null);
  }

  protected filterByText(value: string | null): void {
    this._campaignFilter = {...this._campaignFilter, title: value};
    this.campaignParams = {...this.campaignParams, filter: this._campaignFilter}
    this._getCampaigns();
  }

  protected filterByDate(value: DateRangeModel): void {
    this._campaignFilter = {...this._campaignFilter, startDate: value.startDate, endDate: value.endDate};
    this.campaignParams = {...this.campaignParams, filter: this._campaignFilter}
    this._getCampaigns();
  }

  protected sortBy(value: CampaignSort | null): void {
    this._campaignSort = {...this._campaignSort, ...value};
    this.campaignParams = {...this.campaignParams, sort: this._campaignSort}
    this._getCampaigns()
  }
}
