import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { PERSONAS_TABLE_NAME } from '../common/constants';
import { DynamoAbstract } from '../interfaces/Dynamo.interface';
import { unmarshall } from '@aws-sdk/util-dynamodb';

export abstract class PersonaServiceAbstract {
    abstract get(limit?: number);
}

export class PersonaService implements PersonaServiceAbstract {
    private dynamoRepository: DynamoAbstract;
    constructor(dynamoRepository: DynamoAbstract) {
        this.dynamoRepository = dynamoRepository;
    }
    async get(limit = 10, lastKey?: Record<string, AttributeValue>) {
        console.log('#################',lastKey)
        const { items, lastEvaluatedKey } = await this.dynamoRepository.getAllItemsPaginated(
            PERSONAS_TABLE_NAME,
            limit,
            lastKey
        );

        // Asegúrate de que 'items' es un arreglo de registros con atributos serializados
        const unmarshalledItems = items.map((item: Record<string, AttributeValue>) => unmarshall(item));
        const unmarshalledLastKey = lastEvaluatedKey ? unmarshall(lastEvaluatedKey) : undefined;

        return {
            items: unmarshalledItems,
            lastEvaluatedKey: unmarshalledLastKey,
        };
    }
}
