import { ElementRef, inject, Injectable, Injector } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { PopoverBoxInterface } from '../../../../interface/popover-box.interface';
import {
  MatPopoverBoxComponent,
  POPOVER_BOX_CONTAINER_ACTION_LIST,
  POPOVER_BOX_CONTAINER_DATA_CONTEXT
} from '../mat-popover-box.component';

@Injectable({ providedIn: 'root' })
export class PopoverBoxService {
  private isOverlayOpen = false;
  private overlayRef: OverlayRef | null = null; // TS-safe
  private subscription = new Subscription();

  private overlay = inject(Overlay);
  private injector = inject(Injector);

  constructor() {
  }

  public openPanel(
    event: MouseEvent,
    actionListItems: Array<PopoverBoxInterface>,
    dataContext?: any,
    popoverOverlayConfig?: OverlayConfig
  ) {
    if (this.isOverlayOpen) {
      this.dismissAll();
    }

    const target = {
      getBoundingClientRect: () => ({
        top: event.clientY,
        right: event.clientX
      })
    };
    const el = new ElementRef(target);

    // Overlay config
    let config: OverlayConfig = popoverOverlayConfig || new OverlayConfig();
    config.hasBackdrop = true;
    config.positionStrategy = this.overlay.position()
      .flexibleConnectedTo(el)
      .withFlexibleDimensions()
      .withPositions([
        { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' },
        { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' },
        { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom' },
        { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom' }
      ]);

    // Create overlay
    this.overlayRef = this.overlay.create(config);

    // Close on backdrop click
    const subscription$ = this.overlayRef.backdropClick().subscribe(() => {
      this.dismissAll();
    });

    // Attach portal with injector
    const portalInjector = Injector.create({
      providers: [
        { provide: POPOVER_BOX_CONTAINER_ACTION_LIST, useValue: actionListItems },
        { provide: POPOVER_BOX_CONTAINER_DATA_CONTEXT, useValue: dataContext || {} }
      ],
      parent: this.injector
    });

    this.overlayRef.attach(new ComponentPortal(MatPopoverBoxComponent, null, portalInjector));

    this.isOverlayOpen = true;
    this.subscription.add(subscription$);
  }

  public dismissAll() {
    this.isOverlayOpen = false;
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
  }
}
