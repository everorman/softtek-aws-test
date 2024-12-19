import { ResponseHandler } from '../common/Response';
import { SchemaError } from '../common/SchemaError';
import { DynamoRepository } from '../repository/Dynamo.repository';
import { personaSchema } from '../schema/RequestSchema';
import { RequestValidator } from '../schema/RequestValidator';
import { PersonaService } from '../services/Persona.service';

module.exports.handler = async (event) => {
    const dynamoRepository = new DynamoRepository('us-east-1', true);
    const service = new PersonaService(dynamoRepository);
    const payload = event.body ? JSON.parse(event.body) : {};

    const responseHandler = new ResponseHandler();
    try {
        RequestValidator.validate(personaSchema, payload);
        const result = await service.save(payload);
        return responseHandler.ok(result, 'item guardado con exito');
    } catch (err: any) {
        if(err instanceof SchemaError){
            return responseHandler.badRequest(err.message)
        }
        return responseHandler.internalError(err.message);
    }
};
