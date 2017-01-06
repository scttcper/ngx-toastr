import {
    NgModule,
    ModuleWithProviders,
    ComponentRef,
    Directive,
    TemplateRef,
    ComponentFactoryResolver,
    ViewContainerRef,
    OnDestroy,
    Input,
} from '@angular/core';
import {Portal, TemplatePortal, ComponentPortal, BasePortalHost} from './portal';


/**
 * Directive version of a `TemplatePortal`. Because the directive *is* a TemplatePortal,
 * the directive instance itself can be attached to a host, enabling declarative use of portals.
 *
 * Usage:
 * <template portal #greeting>
 *   <p> Hello {{name}} </p>
 * </template>
 */
@Directive({
  selector: '[toast-portal], [portal]',
  exportAs: 'toastPortal',
})
export class TemplatePortalDirective extends TemplatePortal {
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }
}


@NgModule({
  exports: [TemplatePortalDirective],
  declarations: [TemplatePortalDirective],
})
export class PortalModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PortalModule,
      providers: []
    };
  }
}
