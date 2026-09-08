import { useQuery } from '@tanstack/react-query';
import { getMemberProgress } from '../api/progress.api';

export const useMemberProgress = () => {
  return useQuery({
    queryKey: ['member-progress'],
    queryFn: getMemberProgress,
  });
};
