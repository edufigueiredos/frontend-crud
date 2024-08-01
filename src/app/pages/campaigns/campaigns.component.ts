import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {CampaignsFilterComponent} from "./components/campaigns-filter/campaigns-filter.component";
import {CampaignsService} from "../../services/campaigns/campaigns.service";
import {Campaign, CampaignFilter, CampaignParams, CampaignSort} from "../../models/campaigns/campaign";
import {CampaignCardComponent} from "./components/campaign-card/campaign-card.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {DateRangeModel} from "../../models/date-range-form.model";
import {ModalComponent} from "../../components/modal/modal.component";

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [
    CampaignsFilterComponent,
    CampaignCardComponent,
    MatButtonModule,
    MatIconModule,
    ModalComponent
  ],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.scss'
})
export class CampaignsComponent implements OnInit {
  private _campaignsService = inject(CampaignsService)
  private _campaignFilter!: CampaignFilter;
  private _campaignSort: CampaignSort = {
    sort: "desc",
    key: "createdAt",
  }
  private _campaignParams: CampaignParams = {
    sort: this._campaignSort
  }

  protected campaignsList: WritableSignal<Array<Campaign>> = signal([])
  protected deleteCampaignWarning = false;
  protected campaignToDelete: WritableSignal<Campaign | null> = signal(null)

  ngOnInit() {
    this._getCampaigns();
  }

  private _getCampaigns(): void {
    this._campaignsService
      .getCampaigns(this._campaignParams)
      .subscribe(data => this.campaignsList.set(data));
  }

  protected confirmCampaignDeletion(id: string | null): void {
    if (id) {
      const campaign = this.campaignsList().find(campaign => campaign.id === id)
      if (campaign) {
        this.campaignToDelete.set(campaign);

        this.deleteCampaignWarning = true;
      }
    }
  }

  protected deleteCampaign(id: string | null): void {
    if (id) {
      this._campaignsService.deleteCampaign(id).subscribe(() => this._getCampaigns());
    }
  }

  protected filterByText(value: string | null): void {
    this._campaignFilter = {...this._campaignFilter, title: value};
    this._campaignParams = {...this._campaignParams, filter: this._campaignFilter}
    this._getCampaigns();
  }

  protected filterByDate(value: DateRangeModel): void {
    this._campaignFilter = {...this._campaignFilter, startDate: value.startDate, endDate: value.endDate};
    this._campaignParams = {...this._campaignParams, filter: this._campaignFilter}
    this._getCampaigns();
  }

  protected sortBy(value: CampaignSort | null): void {
    this._campaignSort = {...this._campaignSort, ...value};
    this._campaignParams = {...this._campaignParams, sort: this._campaignSort}
    this._getCampaigns()
  }

}
