import {Component, input, output} from '@angular/core';

import {DatePipe} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";

import {Campaign} from "../../../../models/campaigns/campaign";

@Component({
  selector: 'app-campaign-card',
  standalone: true,
  imports: [
    DatePipe,
    MatIconModule
  ],
  templateUrl: './campaign-card.component.html',
  styleUrl: './campaign-card.component.scss'
})
export class CampaignCardComponent {
  public campaign = input<Campaign>();
  public editCampaign = output<Campaign>();
  public deleteCampaign = output<string | null>();

  protected editCampaignEmitter(campaign: Campaign | undefined): void {
    if (campaign) this.editCampaign.emit(campaign)
  }

  protected deleteCampaignEmitter(): void {
    this.deleteCampaign.emit(this.campaign()?.id ?? null)
  }
}
