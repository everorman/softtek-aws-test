import { ResponseHandler } from '../common/Response';
import { DynamoRepository } from '../repository/Dynamo.repository';
import { PersonaService } from '../services/Persona.service';

module.exports.handler = async (event) => {
    const dynamoRepository = new DynamoRepository('us-east-1', true);
    const service = new PersonaService(dynamoRepository);
    const payload = event.body ? JSON.parse(event.body) : {};

    const responseHandler = new ResponseHandler();
    try {
        const result = await service.save(payload);
        return responseHandler.ok(result, 'item guardado con exito');
    } catch (err: any) {
        return responseHandler.internalError(err.message);
    }
};
