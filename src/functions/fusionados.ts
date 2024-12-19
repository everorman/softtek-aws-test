import { ResponseHandler } from '../common/Response';
import { DynamoRepository } from '../repository/Dynamo.repository';
import { PersonaRepository } from '../repository/Persona.repository';
import { PlanetaRepository } from '../repository/Planeta.repository';
import { FusionService } from '../services/Fusion.service';

module.exports.handler = async (event) => {
    const personaRepository = new PersonaRepository();
    const planetaRepository = new PlanetaRepository();
    const dynamoRepository = new DynamoRepository('us-east-1', true);
    const service = new FusionService(planetaRepository, personaRepository, dynamoRepository);

    const responseHandler = new ResponseHandler();
    try {
        const result = await service.getPerson(1);
        return responseHandler.ok(result, 'consulta realizada con exito');
    } catch (err: any) {
        return responseHandler.internalError(err.message);
    }
};
