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
export class MaterialesSevice implements ICRUD {
    /** Url del servicio api a consumir por el servicio */
    private apiUrl = environment.urlApi.main + '/rpm/materiales/tipo/listarTipoMaterial'; // URL web API
    /**
     *  Constructor de la clase
     * @param http Variable que representa al módulo HTTP
     */

    materialesSubject = new Subject();

    // materiales = ['uno', 'dos', 'tres'];

    private materiales: any = [
        { _id: '1', descripcion: 'Computadora de escritorio', idMaterial: 1 },
        { _id: '2', descripcion: 'Silla ergonómica', idMaterial: 2 },
        { _id: '3', descripcion: 'Mesa en forma de L', idMaterial: 3 },
        { _id: '4', descripcion: 'Proyector', idMaterial: 4 },
        { _id: '5', descripcion: 'Tinta para impresora', idMaterial: 5 }
    ];

    // agregarLibro(libroNombre: string) {
    //     this.libros.push(libroNombre);
    //     this.librosSubject.next();
    // }

    constructor(private http: HttpClient) {}

    obtenerMateriales() {
        return [...this.materiales];
    }

    buscarMaterial(materialNombre: string) {
        this.materiales = this.materiales.filter((x) => x.idMaterial == materialNombre);
        this.materialesSubject.next();
    }

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

    // eliminarLibros(libroNombre: string) {
    //     this.libros = this.libros.filter((x) => x !== libroNombre);
    //     this.librosSubject.next();
    // }
}
