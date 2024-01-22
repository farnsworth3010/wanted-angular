import { animate, query, style, transition, trigger } from '@angular/animations';

export const contentRouteAnimation = trigger('contentRouteAnimations', [
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

export const authRouteAnimation = trigger('authRouteAnimations', [
  transition('* <=> *', [
    query(':enter', [
      style({
        transform: 'translate(-50%, -60%)',
        opacity: 0,
      }),
    ], {optional: true}),
    query(':enter', [animate('250ms ease-out', style({ opacity: 1, transform: 'translate(-50%, -50%)' }))], {optional: true}),
  ]),
]);
