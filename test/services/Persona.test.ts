import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { PERSONAS_TABLE_NAME, CACHE_PLANETA_TABLE_NAME } from '../../src/common/constants';
import { DynamoAbstract } from '../../src/interfaces/Dynamo.interface';
import { PersonaService } from '../../src/services/Persona.service';
import { Genero, Persona } from '../../src/interfaces/types';

jest.mock('uuid');
const mockedUuidv4 = uuidv4 as jest.MockedFunction<typeof uuidv4>;

describe('PersonaService', () => {
    let dynamoRepositoryMock: jest.Mocked<DynamoAbstract>;
    let personaService: PersonaService;

    beforeEach(() => {
        dynamoRepositoryMock = {
            getAllItemsPaginated: jest.fn(),
            savePersona: jest.fn(),
            getCache: jest.fn(),
            saveToCache: jest.fn(),
            saveItem: jest.fn(),
        } as unknown as jest.Mocked<DynamoAbstract>;

        personaService = new PersonaService(dynamoRepositoryMock);

        // Mock para uuid
        mockedUuidv4.mockReturnValue('mocked-uuid' as any as Uint8Array);
    });

    describe('get', () => {
        it('should fetch paginated items from DynamoDB and unmarshall them', async () => {
            const mockItems = [
                { id: { S: '1' }, name: { S: 'Luke Skywalker' } },
                { id: { S: '2' }, name: { S: 'Leia Organa' } },
            ];
            const mockLastKey = { id: { S: '2' } };

            dynamoRepositoryMock.getAllItemsPaginated.mockResolvedValueOnce({
                items: mockItems,
                lastEvaluatedKey: mockLastKey,
            });

            const result = await personaService.get(10);

            expect(dynamoRepositoryMock.getAllItemsPaginated).toHaveBeenCalledWith(PERSONAS_TABLE_NAME, 10, undefined);

            expect(result.items).toEqual([
                { id: '1', name: 'Luke Skywalker' },
                { id: '2', name: 'Leia Organa' },
            ]);

            expect(result.lastEvaluatedKey).toEqual({ id: '2' });
        });

        it('should return an empty array if no items are returned', async () => {
            dynamoRepositoryMock.getAllItemsPaginated.mockResolvedValueOnce({
                items: [],
                lastEvaluatedKey: undefined,
            });

            const result = await personaService.get(10);

            expect(result.items).toEqual([]);
            expect(result.lastEvaluatedKey).toBeUndefined();
        });
    });

    describe('getCache', () => {
        it('should fetch paginated items from cache and unmarshall them', async () => {
            const mockItems = [
                { id: { S: '1' }, name: { S: 'Tatooine' } },
                { id: { S: '2' }, name: { S: 'Naboo' } },
            ];
            const mockLastKey = { id: { S: '2' } };

            dynamoRepositoryMock.getAllItemsPaginated.mockResolvedValueOnce({
                items: mockItems,
                lastEvaluatedKey: mockLastKey,
            });

            const result = await personaService.getCache(10);

            expect(dynamoRepositoryMock.getAllItemsPaginated).toHaveBeenCalledWith(
                CACHE_PLANETA_TABLE_NAME,
                10,
                undefined
            );

            expect(result.items).toEqual([
                { id: '1', name: 'Tatooine' },
                { id: '2', name: 'Naboo' },
            ]);

            expect(result.lastEvaluatedKey).toEqual({ id: '2' });
        });
    });

    describe('save', () => {
        it('should save the persona item and return the generated id', async () => {
            const mockPersona: Persona = {
                id: '1',
                nombre: 'Evert Ortiz',
                genero: Genero.Masculino,
                fechaNacimiento: '19BBY',
                planeta: {
                    nombre: 'Tatooine',
                    gravedad: '1 standard',
                    periodoRotacion: 23,
                    periodoTraslacion: 304,
                },
            };

            dynamoRepositoryMock.savePersona.mockResolvedValueOnce(undefined);

            const result = await personaService.save(mockPersona);

            expect(dynamoRepositoryMock.savePersona).toHaveBeenCalledWith({
                ...mockPersona,
                id: 'mocked-uuid',
            });

            expect(result).toEqual({ id: 'mocked-uuid' });
        });
    });
});
