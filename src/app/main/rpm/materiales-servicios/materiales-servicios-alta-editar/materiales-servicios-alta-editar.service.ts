import { environment } from 'environments/environment';
// importación de librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map, share } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { ICRUD } from './../../../../shared/interfaces/crud';
import { IHttpResponse } from './../../../../shared/interfaces/http-response';

@Injectable()
export class MaterialesServiciosAltaEditar implements ICRUD {
    /** Url del servicio api a consumir por el servicio */
    private apiUrl = environment.urlApi.main + '/rpm/catalogos/grupo-articulos'; // URL web API
	private apiUrlFamArt = environment.urlApi.main + '/rpm/catalogos/familias-articulos/'; // URL web API
    /**127.0.0.1:3000/bitzu-api/rpm/catalogos/grupo-articulos
     *  Constructor de la clase
     * @param http Variable que representa al módulo HTTP
     */

    articulosSubject = new Subject();


    constructor(private http: HttpClient) {}

    // obtenerMateriales() {
    //     return [...this.materiales];
    // }


    public List(): Promise<IHttpResponse> {
        // Crea la promesa con la solicitud al servidor
        return new Promise((resolve, reject) => {
            this.http
                .get(this.apiUrl)
                .pipe(map((res: IHttpResponse) => res))
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => {
                        reject(err);
                    }
                );
        });
    }



    public ListFamArt(): Promise<IHttpResponse> {
        // Crea la promesa con la solicitud al servidor
        return new Promise((resolve, reject) => {
            this.http
                .get(this.apiUrlFamArt)
                .pipe(map((res: IHttpResponse) => res))
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => {
                        reject(err);
                    }
                );
        });
    }

    public ShowFamByBrupo( filter: any ): Promise<IHttpResponse> {
        // Crea la promesa con la solicitud al servidor

		const URL = this.apiUrlFamArt + filter;

        return new Promise((resolve, reject) => {
            this.http
                .get(URL)
                .pipe(map((res: IHttpResponse) => res))
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => {
                        reject(err);
                    }
                );
        });
    }




}
