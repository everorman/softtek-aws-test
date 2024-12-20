
import { v4 as uuidv4 } from 'uuid';
import { RepositoryAbstract } from '../../src/interfaces/Repository.interface';
import { PERSONAS_TABLE_NAME } from '../../src/common/constants';
import { DynamoAbstract } from '../../src/interfaces/Dynamo.interface';
import { Genero } from '../../src/interfaces/types';
import { FusionService } from '../../src/services/Fusion.service';

jest.mock('uuid');
const mockedUuidv4 = uuidv4 as jest.MockedFunction<typeof uuidv4>;

describe('FusionService', () => {
    let planetaRepositoryMock: jest.Mocked<RepositoryAbstract>;
    let personaRepositoryMock: jest.Mocked<RepositoryAbstract>;
    let dynamoRepositoryMock: jest.Mocked<DynamoAbstract>;
    let fusionService: FusionService;

    beforeEach(() => {
        // Mock de los repositorios
        planetaRepositoryMock = {
            get: jest.fn(),
        } as jest.Mocked<RepositoryAbstract>;

        personaRepositoryMock = {
            get: jest.fn(),
        } as jest.Mocked<RepositoryAbstract>;

        dynamoRepositoryMock = {
            getCache: jest.fn(),
            saveToCache: jest.fn(),
            saveItem: jest.fn(),
        } as unknown as jest.Mocked<DynamoAbstract>;

        fusionService = new FusionService(planetaRepositoryMock, personaRepositoryMock, dynamoRepositoryMock);

        // Mock para uuid
        mockedUuidv4.mockReturnValue(('mocked-uuid' as any as Uint8Array));
    });

    it('should fetch data from persona and planeta repositories, map the results, and save to DynamoDB', async () => {
        const mockPersona = {
            properties: {
                name: 'Luke Skywalker',
                gender: 'male',
                birth_year: '19BBY',
            },
        };

        const mockPlaneta = {
            properties: {
                name: 'Tatooine',
                gravity: '1 standard',
                rotation_period: '23',
                orbital_period: '304',
            },
        };

        personaRepositoryMock.get.mockResolvedValueOnce(mockPersona);
        planetaRepositoryMock.get.mockResolvedValueOnce(mockPlaneta);

        const result = await fusionService.getPerson(1);

        expect(personaRepositoryMock.get).toHaveBeenCalledWith(1);
        expect(planetaRepositoryMock.get).toHaveBeenCalled();
        expect(dynamoRepositoryMock.saveItem).toHaveBeenCalledWith(PERSONAS_TABLE_NAME, {
            id: 'mocked-uuid',
            nombre: 'Luke Skywalker',
            genero: Genero.Masculino,
            fechaNacimiento: '19BBY',
            planeta: {
                nombre: 'Tatooine',
                gravedad: '1 standard',
                periodoRotacion: 23,
                periodoTraslacion: 304,
            },
        });

        expect(result).toEqual({
            id: 'mocked-uuid',
            nombre: 'Luke Skywalker',
            genero: Genero.Masculino,
            fechaNacimiento: '19BBY',
            planeta: {
                nombre: 'Tatooine',
                gravedad: '1 standard',
                periodoRotacion: 23,
                periodoTraslacion: 304,
            },
        });
    });

    it('should handle errors when fetching persona or planeta data', async () => {
        personaRepositoryMock.get.mockRejectedValueOnce(new Error('Persona not found'));

        await expect(fusionService.getPerson(1)).rejects.toThrow('Persona not found');

        expect(personaRepositoryMock.get).toHaveBeenCalledWith(1);
        expect(planetaRepositoryMock.get).toHaveBeenCalled();
        expect(dynamoRepositoryMock.saveItem).not.toHaveBeenCalled();
    });
});
