export enum Genero {
    Masculino = 'masculino',
    Femenino = 'femenino',
}

export interface Planeta {
    nombre: string;
    gravedad: string;
    periodoRotacion: number;
    periodoTraslacion: number;
}

export interface Persona {
    nombre: string;
    genero: Genero;
    fechaNacimiento: string;
    planeta: Planeta;
}
