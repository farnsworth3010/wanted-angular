import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SettingsService } from '../services/settings.service';

export const wantedInterceptor: HttpInterceptorFn = (req, next) => {
  let office!: string | null;
  let settingsSerice = inject(SettingsService);
  settingsSerice.$officeState.subscribe((res: string | null) => (office = res));

  req = req.clone({
    setParams: {
      field_offices: office && office != 'any' ? office : '',
    },
  });

  return next(req);
};
