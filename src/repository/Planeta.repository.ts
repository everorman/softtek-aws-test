import axios from 'axios';
import { CACHE_PLANETA_TABLE_NAME } from '../common/constants';
import { DynamoAbstract } from '../interfaces/Dynamo.interface';
import { RepositoryAbstract } from '../interfaces/Repository.interface';

export class PlanetaRepository extends RepositoryAbstract {
    private dynamoRepository: DynamoAbstract;
    constructor(dynamoRepository: DynamoAbstract) {
        super();
        this.dynamoRepository = dynamoRepository;
    }
    async get(id: number) {
        try {
            const cachedPlaneta = await this.dynamoRepository.getCache(CACHE_PLANETA_TABLE_NAME, id);
            console.log('cachedPlaneta', cachedPlaneta)
            if (cachedPlaneta && !this.isExpired(cachedPlaneta.lastUpdated)) {
                console.log('Returning cached data');
                return cachedPlaneta.data;
            }
            const response = await axios.get(`https://www.swapi.tech/api/planets/${id}`);
            const planeta = response.data;

            if (planeta.message !== 'ok') {
                throw new Error('Response Planeta Error');
            }
            await this.dynamoRepository.saveToCache(CACHE_PLANETA_TABLE_NAME, id, planeta.result);
            return planeta.result;
        } catch (error: any) {
            console.error('Error fetching planet:', error.message || error);
            throw new Error('Failed to fetch planet data');
        }
    }

    private isExpired(timestamp: number): boolean {
        const THIRTY_MINUTES = 30 * 60 * 1000;
        return Date.now() - timestamp > THIRTY_MINUTES;
    }
}
