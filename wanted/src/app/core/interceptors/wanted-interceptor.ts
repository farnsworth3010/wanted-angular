import { HttpInterceptorFn } from '@angular/common/http';

export const wantedInterceptor: HttpInterceptorFn = (req, next) => {
  const office: string | null = localStorage.getItem('field_office')
  req = req.clone({
    setParams:
    {
      field_offices: office && office != 'any' ? office : ''
    }
  })
  return next(req)
}