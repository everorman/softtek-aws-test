import { DynamoDBClient, PutItemCommand, ScanCommand, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
    GetCommandInput,
    PutCommand,
    PutCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { DynamoAbstract } from '../interfaces/Dynamo.interface';
import { PERSONAS_TABLE_NAME } from '../common/constants';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Persona } from '../interfaces/types';

export class DynamoRepository implements DynamoAbstract {
    private client: DynamoDBDocumentClient;

    constructor(region: string, isLocal: boolean = false) {
        const options: any = { region };

        // Configura el endpoint para DynamoDB local si isLocal es true
        if (isLocal) {
            options.endpoint = 'http://localhost:8000';
        }

        const dynamoClient = new DynamoDBClient(options);
        this.client = DynamoDBDocumentClient.from(dynamoClient);
    }

    /**
     * Almacena un objeto en una tabla de DynamoDB.
     * @param tableName - El nombre de la tabla en DynamoDB.
     * @param item - El objeto que se almacenará en la tabla.
     */
    async saveItem(tableName: string, item: Record<string, any>): Promise<void> {
        const params: PutCommandInput = {
            TableName: tableName,
            Item: item,
        };

        try {
            await this.client.send(new PutCommand(params));
            console.log(`Item guardado exitosamente en la tabla ${tableName}`);
        } catch (error) {
            console.error('Error al guardar el item en DynamoDB:', error);
            throw new Error('No se pudo guardar el item en DynamoDB');
        }
    }

    /**
     * Obtiene un objeto en una tabla de DynamoDB.
     * @param tableName - El nombre de la tabla en DynamoDB.
     * @param id - Id de objeto a consultar.
     */
    async getItemById<T>(tableName: string, id: string): Promise<T | null> {
        const params: GetCommandInput = {
            TableName: tableName,
            Key: {
                id,
            },
        };

        try {
            const result = await this.client.send(new GetCommand(params));
            if (!result.Item) {
                console.warn(`El registro con ID ${id} no se encontró en la tabla ${tableName}`);
                return null;
            }
            console.log(`Registro obtenido de la tabla ${tableName}:`, result.Item);
            return result.Item as T;
        } catch (error) {
            console.error('Error al obtener el registro de DynamoDB:', error);
            throw new Error('No se pudo obtener el registro de DynamoDB');
        }
    }

    async getAllItemsPaginated<T>(
        tableName: string,
        limit: number,
        lastEvaluatedKey?: Record<string, any>
    ): Promise<{ items: T[]; lastEvaluatedKey?: Record<string, any> }> {
        const params: ScanCommandInput = {
            TableName: tableName,
            Limit: limit,
            ExclusiveStartKey: lastEvaluatedKey,
        };

        try {
            const result = await this.client.send(new ScanCommand(params));

            return {
                items: (result.Items || []) as T[],
                lastEvaluatedKey: result.LastEvaluatedKey,
            };
        } catch (error) {
            console.error('Error al obtener los registros paginados de DynamoDB:', error);
            throw new Error('No se pudo obtener los registros paginados de DynamoDB');
        }
    }

    async savePersona(persona: Persona): Promise<void> {
        try {
            const params = {
                TableName: PERSONAS_TABLE_NAME,
                Item: marshall({...persona}),
            };

            const command = new PutItemCommand(params);
            await this.client.send(command);
            console.log('Persona guardada exitosamente en DynamoDB');
        } catch (error) {
            console.error('Error al guardar la persona en DynamoDB:', error);
            throw error;
        }
    }
}
