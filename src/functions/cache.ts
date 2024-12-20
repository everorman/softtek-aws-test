import { ResponseHandler } from '../common/Response';
import { DynamoRepository } from '../repository/Dynamo.repository';
import { PersonaService } from '../services/Persona.service';

module.exports.handler = async (event) => {
    const dynamoRepository = new DynamoRepository('us-east-1');
    const service = new PersonaService(dynamoRepository);
    const payload = event.queryStringParameters ?? event.query ?? {};

    const responseHandler = new ResponseHandler();
    const lastKey = payload.lastKey
        ? {
              id: { S: payload.lastKey },
          }
        : undefined;
    try {
        const result = await service.getCache(payload.limit, lastKey);
        return responseHandler.ok(result, 'consulta realizada con exito');
    } catch (err: any) {
        return responseHandler.internalError(err.message);
    }
};
