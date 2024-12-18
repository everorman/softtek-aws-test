export abstract class DynamoAbstract {
    abstract saveItem(tableName: string, item: Record<string, any>);
}