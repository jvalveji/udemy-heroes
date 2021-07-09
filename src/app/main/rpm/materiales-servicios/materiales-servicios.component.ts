import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'bitzu-materiales-servicios',
    templateUrl: './materiales-servicios.component.html',
    styleUrls: ['./materiales-servicios.component.scss'],
    animations: [
        // Evento que se ejecuta la transición 'slide' para los componentes que tiene como identificador 'slideBtnMenuApps'
        trigger('slideBtnMenuApps', [
            // Evento que se dispara cuando el estado está 'cerrado'
            state(
                'closed',
                style({
                    height: '40px'
                })
            ),
            // Transición que se ejecuta cuando el estado cambia de abierto a cerrado
            transition('open => closed', [animate('0.2s')]),
            // Transición que se ejecuta cuando el estado cambia de cerrado a abierto
            transition('closed => open', [animate('0.2s')])
        ]),
        // Evento que se ejecuta la transición 'slide' para los componentes que tienen como identificador 'slideMenuApps'
        trigger('slideMenuApps', [
            // Evento que se dispara cuando el estado está 'cerrado'
            state(
                'closed',
                style({
                    display: 'none'
                })
            ),
            // Transición que se ejecuta cuando el estado cambia de abierto a cerrado
            transition('open => closed', [animate('0.2s')]),
            // Transición que se ejecuta cuando el estado cambia de cerrado a abierto
            transition('closed => open', [animate('0.2s')])
        ]),
        // Evento que se ejecuta la transición 'fade in o fade out' para los componentes que tienen como identificador 'apps'
        trigger('apps', [
            // Transición de cualquier identificador a 'fadeIn'
            transition('* => fadeIn', [
                style({ opacity: 0 }),
                animate(1000, style({ opacity: 1 }))
            ]),
            // Transición de cualquier identificador a 'fadeOut'
            transition('* => fadeOut', [animate(1000, style({ opacity: 0 }))])
        ])
    ]
})
export class MaterialesServiciosComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
