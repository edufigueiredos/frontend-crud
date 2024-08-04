import {FormControl} from "@angular/forms";

export interface Campaign {
  id?: string | null;
  title: string;
  description: string;
  createdAt: Date | string;
  imageUrl: string;
}

export interface CampaignForm {
  id?: FormControl<string | null>;
  title: FormControl<string | null>;
  description: FormControl<string | null>;
  imageUrl: FormControl<string| null>;
  createdAt: FormControl<Date | string | null>;
}

export interface CampaignFilter {
  title?: string | null,
  startDate?: Date | null,
  endDate?: Date | null
}

export interface CampaignSort {
  key: ColumnName,
  label?: string,
  sort: 'desc' | 'asc',
}

export interface CampaignParams {
  filter?: CampaignFilter;
  sort?: CampaignSort;
}

export type ColumnName = 'title' | 'description' | 'createdAt' | 'imageUrl';
