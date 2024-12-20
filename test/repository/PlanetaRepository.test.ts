import axios from 'axios';
import { CACHE_PLANETA_TABLE_NAME } from '../../src/common/constants';
import { DynamoAbstract } from '../../src/interfaces/Dynamo.interface';
import { PlanetaRepository } from '../../src/repository/Planeta.repository';


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PlanetaRepository', () => {
    let dynamoRepositoryMock: jest.Mocked<DynamoAbstract>;
    let planetaRepository: PlanetaRepository;

    beforeEach(() => {
        // Crear un mock para DynamoAbstract
        dynamoRepositoryMock = {
            getCache: jest.fn(),
            saveToCache: jest.fn(),
        } as unknown as jest.Mocked<DynamoAbstract>;

        planetaRepository = new PlanetaRepository(dynamoRepositoryMock);
    });

    it('should return cached data if it exists and is not expired', async () => {
        const mockId = 1;
        const cachedData = {
            data: { name: 'Tatooine' },
            lastUpdated: Date.now(),
        };

        dynamoRepositoryMock.getCache.mockResolvedValueOnce(cachedData);

        const result = await planetaRepository.get(mockId);

        expect(result).toEqual(cachedData.data);
        expect(dynamoRepositoryMock.getCache).toHaveBeenCalledWith(CACHE_PLANETA_TABLE_NAME, mockId);
        expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should fetch data from API if cache is expired', async () => {
        const mockId = 2;
        const expiredCache = {
            data: { name: 'Dagobah' },
            lastUpdated: Date.now() - 31 * 60 * 1000, // Expired timestamp
        };
        const apiResponse = {
            message: 'ok',
            result: { name: 'Dagobah', terrain: 'swamp' },
        };

        dynamoRepositoryMock.getCache.mockResolvedValueOnce(expiredCache);
        mockedAxios.get.mockResolvedValueOnce({ data: apiResponse });

        const result = await planetaRepository.get(mockId);

        expect(result).toEqual(apiResponse.result);
        expect(dynamoRepositoryMock.getCache).toHaveBeenCalledWith(CACHE_PLANETA_TABLE_NAME, mockId);
        expect(mockedAxios.get).toHaveBeenCalledWith(`https://www.swapi.tech/api/planets/${mockId}`);
        expect(dynamoRepositoryMock.saveToCache).toHaveBeenCalledWith(CACHE_PLANETA_TABLE_NAME, mockId, apiResponse.result);
    });

    it('should throw an error if API response is not "ok"', async () => {
        const mockId = 3;
        const apiErrorResponse = { message: 'error' };

        dynamoRepositoryMock.getCache.mockResolvedValueOnce(null); // No cache
        mockedAxios.get.mockResolvedValueOnce({ data: apiErrorResponse });

        await expect(planetaRepository.get(mockId)).rejects.toThrow('Failed to fetch planet data');

        expect(mockedAxios.get).toHaveBeenCalledWith(`https://www.swapi.tech/api/planets/${mockId}`);
    });

    it('should throw an error if fetching data fails', async () => {
        const mockId = 4;
        const mockError = new Error('Network error');

        dynamoRepositoryMock.getCache.mockResolvedValueOnce(null); // No cache
        mockedAxios.get.mockRejectedValueOnce(mockError);

        await expect(planetaRepository.get(mockId)).rejects.toThrow('Failed to fetch planet data');

        expect(mockedAxios.get).toHaveBeenCalledWith(`https://www.swapi.tech/api/planets/${mockId}`);
    });
});
