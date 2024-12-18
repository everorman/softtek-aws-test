import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb';

export class DynamoRepository {
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
}