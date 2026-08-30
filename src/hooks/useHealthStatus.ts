import { useQuery } from '@tanstack/react-query';
import { healthService } from '../services/health.service';
import type { HealthStatusResponse } from '../types';

export function useHealthStatus() {
  return useQuery<HealthStatusResponse, Error>({
    queryKey: ['healthStatus'],
    queryFn: () => healthService.checkHealth(),
    refetchInterval: 5000,
    retry: 2,
  });
}
