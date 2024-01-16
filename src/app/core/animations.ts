import { animate, group, query, style, transition, trigger } from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter', [
      style({
        position: 'absolute',
        top: '-5%',
        left: 0,
        width: '100%',
        opacity: 0,
      }),
    ]),
    query(':enter', [animate('300ms ease-in-out', style({ opacity: 1, top: 0 }))]),
  ]),
]);
