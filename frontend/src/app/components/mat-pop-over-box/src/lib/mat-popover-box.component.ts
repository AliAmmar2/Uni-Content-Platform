import { Component, Inject, InjectionToken, OnInit } from '@angular/core';

import * as _ from 'lodash';
import { PopoverBoxService } from './service/popover-box.service';
import { MatActionList, MatListItem } from '@angular/material/list';
import { NgForOf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PopoverBoxInterface } from '../../../interface/popover-box.interface';

export const POPOVER_BOX_CONTAINER_ACTION_LIST = new InjectionToken<any>('POPOVER_BOX_CONTAINER_ACTION_LIST');
export const POPOVER_BOX_CONTAINER_DATA_CONTEXT = new InjectionToken<any>('POPOVER_BOX_CONTAINER_DATA_CONTEXT');

@Component({
  templateUrl: 'mat-popover-box.component.html',
  styleUrls: ['mat-popover-box.component.scss'],
  imports: [
    MatActionList,
    NgForOf,
    MatListItem,
    FaIconComponent
  ],
  standalone: true
})
export class MatPopoverBoxComponent implements OnInit {
  constructor(@Inject(POPOVER_BOX_CONTAINER_ACTION_LIST) public itemList: Array<PopoverBoxInterface>,
              @Inject(POPOVER_BOX_CONTAINER_DATA_CONTEXT) public dataContext: any,
              private popoverBoxService: PopoverBoxService) {
  }

  ngOnInit(): void {
    this.itemList = _.filter(this.itemList, { visible: true });
  }

  public invokeHandler(item: PopoverBoxInterface) {
    item.handler(this.dataContext);
    this.popoverBoxService.dismissAll();
  }
}
