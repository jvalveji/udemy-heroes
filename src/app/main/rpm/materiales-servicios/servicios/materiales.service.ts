import { Subject } from 'rxjs';

export class MaterialesSevice {
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

    obtenerMateriales() {
        return [...this.materiales];
    }

    buscarMaterial(materialNombre: string) {
        this.materiales = this.materiales.filter((x) => x.idMaterial == materialNombre);
        this.materialesSubject.next();
    }

    // eliminarLibros(libroNombre: string) {
    //     this.libros = this.libros.filter((x) => x !== libroNombre);
    //     this.librosSubject.next();
    // }
}
