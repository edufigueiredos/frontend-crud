import {Routes} from "@angular/router";
import {CampaignsService} from "../../services/campaigns/campaigns.service";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./campaigns.component').then(component => component.CampaignsComponent)
  }
]
