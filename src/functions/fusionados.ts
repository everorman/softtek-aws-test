import { ResponseHandler } from '../common/Response';
import { DynamoRepository } from '../repository/Dynamo.repository';
import { PersonaRepository } from '../repository/Persona.repository';
import { PlanetaRepository } from '../repository/Planeta.repository';
import { FusionService } from '../services/Fusion.service';

module.exports.handler = async (event) => {
    
    const dynamoRepository = new DynamoRepository('us-east-1');
    const planetaRepository = new PlanetaRepository(dynamoRepository);
    const personaRepository = new PersonaRepository(dynamoRepository);
    const service = new FusionService(planetaRepository, personaRepository, dynamoRepository);
    const payload = event.queryStringParameters ?? event.query ?? {};
    const responseHandler = new ResponseHandler();
    if(!payload.id) return responseHandler.badRequest('Id is required')
    try {
        const result = await service.getPerson(payload.id);
        return responseHandler.ok(result, 'consulta realizada con exito');
    } catch (err: any) {
        return responseHandler.internalError(err.message);
    }
};
