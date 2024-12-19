import { Persona } from './types';

export abstract class DynamoAbstract {
    abstract saveItem(tableName: string, item: Record<string, any>);
    abstract getItemById(tableName: string, id: string);
    abstract getAllItemsPaginated<T>(
        tableName: string,
        limit: number,
        lastEvaluatedKey?: Record<string, any>
    ): Promise<{ items: T[]; lastEvaluatedKey?: Record<string, any> }>;
    abstract savePersona(persona: Persona);
}
