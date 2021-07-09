// Definición typescript para el componente AtpTimePickerComponent v1.0.2
// Proyecto: Arca - MEAN
// Definiciones por:
// Modificado: (24-06-2019) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import {
	Component, ViewChild, ViewContainerRef, Output, ComponentFactoryResolver, OnInit, ApplicationRef, EventEmitter
} from '@angular/core';
import { TimePickerComponent } from '../time-picker/time-picker.component';
import { TimePickerConfig } from '../definitions';

// We need to import like this, because of backward compatibility of angular
import { Subject } from 'rxjs';

@Component({
	selector: 'atp-time-picker',
	templateUrl: './atp-time-picker.component.html',
	styleUrls: ['./atp-time-picker.component.scss']
})

export class AtpTimePickerComponent implements OnInit {
	@ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
	@Output() timeSelected: EventEmitter<string> = new EventEmitter<string>();
	public config: TimePickerConfig = {};

	constructor(
		private resolver: ComponentFactoryResolver,
		private appRef: ApplicationRef,
	) { }

	ngOnInit() {
		let config = this.config;
		config = {
			time: config.time || '00:00',
			theme: ['light', 'dark', 'material'].indexOf(config.theme) > 0 ? config.theme : 'light' || config.theme || 'light',
			rangeTime: config.rangeTime || { start: '0:0', end: '24:0' },
			arrowStyle: config.arrowStyle || {}
		};
		config.arrowStyle = {
			background: (config.arrowStyle.background) ?
				config.arrowStyle.background : config.theme !== undefined ?
					config.theme === 'dark' ? 'rgb(128, 203, 196)' : 'blue' : 'blue',
			color: config.arrowStyle.color || '#fff'
		};
		const cfr = this.resolver.resolveComponentFactory(TimePickerComponent);
		const tsc = this.container.createComponent(cfr);
		tsc.instance.subject = new Subject<any>();
		tsc.instance._ref = tsc;
		tsc.instance.appRef = this.appRef;
		tsc.instance.timerElement = '';
		tsc.instance.config = config;
		tsc.instance.activeModal = true;
		tsc.instance.isPopup = false;
		tsc.instance.ParseStringToTime(config.time);
		tsc.instance.subject.asObservable().subscribe(time => {
			this.timeSelected.emit(time);
		});
	}
}
