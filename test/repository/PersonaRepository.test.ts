import axios from 'axios';
import { PersonaRepository } from '../../src/repository/Persona.repository';
import { CACHE_PERSONA_TABLE_NAME } from '../../src/common/constants';
import { DynamoAbstract } from '../../src/interfaces/Dynamo.interface';

jest.mock('axios');

describe('PersonaRepository', () => {
    let personaRepository: PersonaRepository;
    let dynamoRepositoryMock: jest.Mocked<DynamoAbstract>;

    beforeEach(() => {
        dynamoRepositoryMock = {
            getCache: jest.fn(),
            saveToCache: jest.fn(),
        } as unknown as jest.Mocked<DynamoAbstract>;

        personaRepository = new PersonaRepository(dynamoRepositoryMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return cached data if it exists and is not expired', async () => {
        const id = 1;
        const cachedData = {
            data: { name: 'Luke Skywalker', gender: 'male' },
            lastUpdated: Date.now(),
        };

        dynamoRepositoryMock.getCache.mockResolvedValueOnce(cachedData);

        const result = await personaRepository.get(id);

        expect(dynamoRepositoryMock.getCache).toHaveBeenCalledWith(CACHE_PERSONA_TABLE_NAME, id);
        expect(result).toEqual(cachedData.data);
        expect(axios.get).not.toHaveBeenCalled();
        expect(dynamoRepositoryMock.saveToCache).not.toHaveBeenCalled();
    });

    it('should fetch from API if cache is expired', async () => {
        const id = 1;
        const cachedData = {
            data: { name: 'Luke Skywalker', gender: 'male' },
            lastUpdated: Date.now() - 31 * 60 * 1000, // Expired cache
        };

        const apiResponse = {
            data: {
                message: 'ok',
                result: { name: 'Luke Skywalker', gender: 'male' },
            },
        };

        dynamoRepositoryMock.getCache.mockResolvedValueOnce(cachedData);
        (axios.get as jest.Mock).mockResolvedValueOnce(apiResponse);

        const result = await personaRepository.get(id);

        expect(dynamoRepositoryMock.getCache).toHaveBeenCalledWith(CACHE_PERSONA_TABLE_NAME, id);
        expect(axios.get).toHaveBeenCalledWith(`https://www.swapi.tech/api/people/${id}`);
        expect(result).toEqual(apiResponse.data.result);
        expect(dynamoRepositoryMock.saveToCache).toHaveBeenCalledWith(
            CACHE_PERSONA_TABLE_NAME,
            id,
            apiResponse.data.result
        );
    });

    it('should fetch from API if cache is empty', async () => {
        const id = 1;

        const apiResponse = {
            data: {
                message: 'ok',
                result: { name: 'Leia Organa', gender: 'female' },
            },
        };

        dynamoRepositoryMock.getCache.mockResolvedValueOnce(null);
        (axios.get as jest.Mock).mockResolvedValueOnce(apiResponse);

        const result = await personaRepository.get(id);

        expect(dynamoRepositoryMock.getCache).toHaveBeenCalledWith(CACHE_PERSONA_TABLE_NAME, id);
        expect(axios.get).toHaveBeenCalledWith(`https://www.swapi.tech/api/people/${id}`);
        expect(result).toEqual(apiResponse.data.result);
        expect(dynamoRepositoryMock.saveToCache).toHaveBeenCalledWith(
            CACHE_PERSONA_TABLE_NAME,
            id,
            apiResponse.data.result
        );
    });

    it('should throw an error if the API response is not ok', async () => {
        const id = 1;

        const apiResponse = {
            data: { message: 'error' },
        };

        dynamoRepositoryMock.getCache.mockResolvedValueOnce(null);
        (axios.get as jest.Mock).mockResolvedValueOnce(apiResponse);

        await expect(personaRepository.get(id)).rejects.toThrow('Failed to fetch person data');

        expect(dynamoRepositoryMock.getCache).toHaveBeenCalledWith(CACHE_PERSONA_TABLE_NAME, id);
        expect(axios.get).toHaveBeenCalledWith(`https://www.swapi.tech/api/people/${id}`);
        expect(dynamoRepositoryMock.saveToCache).not.toHaveBeenCalled();
    });

    it('should throw an error if fetching from cache or API fails', async () => {
        const id = 1;

        dynamoRepositoryMock.getCache.mockRejectedValueOnce(new Error('Cache Error'));

        await expect(personaRepository.get(id)).rejects.toThrow('Failed to fetch person data');

        expect(dynamoRepositoryMock.getCache).toHaveBeenCalledWith(CACHE_PERSONA_TABLE_NAME, id);
        expect(axios.get).not.toHaveBeenCalled();
        expect(dynamoRepositoryMock.saveToCache).not.toHaveBeenCalled();
    });
});
