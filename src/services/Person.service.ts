import { RepositoryAbstract } from '../interfaces/Repository.interface';

export abstract class PersonServiceAbstract {
    abstract getPerson(id: number): {};
}

export class PersonService implements PersonServiceAbstract {
    private planetaRepository: RepositoryAbstract;
    private personaRepository: RepositoryAbstract;
    constructor(planetaRepository: RepositoryAbstract, personaRepository:RepositoryAbstract){
        this.planetaRepository = planetaRepository;
        this.personaRepository = personaRepository;
    }
    async getPerson(id: number) {
        const [persona, planeta] = await Promise.all([
            this.personaRepository.get(id),
            this.planetaRepository.get(this.generatePlanetIds()),
        ]);
        return this.mapping(persona.properties, planeta.properties);
    }

    private generatePlanetIds() {
        const id = Math.floor(Math.random() * 50);
        console.log('id plante', id);
        return id;
    }

    private mapping(persona, planeta) {
        return {
            genero: persona.gender === 'male' ? 'masculino' : 'femenino',
            fechaNacimiento: persona.birth_year,
            nombre: persona.nombre,
            planeta: {
                nombre: planeta.name,
                gravedad: planeta.gravity,
                periodoRotacion: planeta.rotation_period,
                periodoTraslacion: planeta.orbital_period,
            },
        };
    }
}
