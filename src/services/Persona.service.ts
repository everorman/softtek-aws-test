import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { CACHE_PLANETA_TABLE_NAME, PERSONAS_TABLE_NAME } from '../common/constants';
import { DynamoAbstract } from '../interfaces/Dynamo.interface';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Persona } from '../interfaces/types';
import { v4 as uuidv4 } from 'uuid';

export abstract class PersonaServiceAbstract {
    abstract get(limit?: number);
    abstract save(item: Persona);
    abstract getCache(limit?:number, lastKey?: Record<string, AttributeValue>);
}

export class PersonaService implements PersonaServiceAbstract {
    private dynamoRepository: DynamoAbstract;

    constructor(dynamoRepository: DynamoAbstract) {
        this.dynamoRepository = dynamoRepository;
    }

    async get(limit = 10, lastKey?: Record<string, AttributeValue>) {
        const { items, lastEvaluatedKey } = await this.dynamoRepository.getAllItemsPaginated(
            PERSONAS_TABLE_NAME,
            limit,
            lastKey
        );

        const unmarshalledItems = items.map((item: Record<string, AttributeValue>) => unmarshall(item));
        const unmarshalledLastKey = lastEvaluatedKey ? unmarshall(lastEvaluatedKey) : undefined;

        return {
            items: unmarshalledItems,
            lastEvaluatedKey: unmarshalledLastKey,
        };
    }

    async getCache(limit = 10, lastKey?: Record<string, AttributeValue>) {
        const { items, lastEvaluatedKey } = await this.dynamoRepository.getAllItemsPaginated(
            CACHE_PLANETA_TABLE_NAME,
            limit,
            lastKey
        );

        const unmarshalledItems = items.map((item: Record<string, AttributeValue>) => unmarshall(item));
        const unmarshalledLastKey = lastEvaluatedKey ? unmarshall(lastEvaluatedKey) : undefined;

        return {
            items: unmarshalledItems,
            lastEvaluatedKey: unmarshalledLastKey,
        };
    }

    async save(item: Persona){
        const uuid = uuidv4()
        await this.dynamoRepository.savePersona({...item, id:uuid})
        return {id:uuid};
    }
}
