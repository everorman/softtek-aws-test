import { DynamoAbstract } from '../interfaces/Dynamo.interface';
import { RepositoryAbstract } from '../interfaces/Repository.interface';
import { Genero, Persona } from '../interfaces/types';
import { v4 as uuidv4 } from 'uuid';

export abstract class PersonServiceAbstract {
    abstract getPerson(id: number): Promise<Persona>;
}

export class PersonService implements PersonServiceAbstract {
    private planetaRepository: RepositoryAbstract;
    private personaRepository: RepositoryAbstract;
    private dynamoRepository: DynamoAbstract;
    constructor(
        planetaRepository: RepositoryAbstract,
        personaRepository: RepositoryAbstract,
        dynamoRespository: DynamoAbstract
    ) {
        this.planetaRepository = planetaRepository;
        this.personaRepository = personaRepository;
        this.dynamoRepository = dynamoRespository;
    }
    async getPerson(id: number) {
        const [persona, planeta] = await Promise.all([
            this.personaRepository.get(id),
            this.planetaRepository.get(this.generatePlanetIds()),
        ]);
        const personaResult = this.mapping(persona.properties, planeta.properties);
        const dynamoRecord = {...personaResult, id: uuidv4()}
        console.log('Persona obtenida: ', dynamoRecord)
        await this.dynamoRepository.saveItem('personasTable', dynamoRecord);
        return personaResult;
    }

    private generatePlanetIds() {
        const id = Math.floor(Math.random() * 50);
        console.log('id plante', id);
        return id;
    }

    private mapping(persona, planeta): Persona {
        return {
            nombre: persona.name,
            genero: persona.gender === 'male' ? Genero.Masculino : Genero.Femenino,
            fechaNacimiento: persona.birth_year,
            planeta: {
                nombre: planeta.name,
                gravedad: planeta.gravity === 'unknown' ? 'desconocida' : planeta.gravity,
                periodoRotacion: Number(planeta.rotation_period),
                periodoTraslacion: Number(planeta.orbital_period),
            },
        };
    }
}
