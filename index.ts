import { ResponseHandler } from './src/common/Response';
import { PersonaRepository } from './src/repository/Persona.repository';
import { PlanetaRepository } from './src/repository/Planeta.repository';
import { PersonService } from './src/services/Person.service';

module.exports.handler = async (event) => {
    console.log('Esto es una prueba');
    const personaRepository = new PersonaRepository();
    const planetaRepository = new PlanetaRepository();
    const service = new PersonService(planetaRepository, personaRepository);

    const responseHandler = new ResponseHandler();
    try {
        const result = await service.getPerson(1);
        return responseHandler.ok(result, 'consulta realizada con exito');
    } catch (err: any) {
        return responseHandler.internalError(err.message);
    }
};
