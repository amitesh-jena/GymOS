import { useQuery } from '@tanstack/react-query';
import { getMemberDiets } from '../api/diets.api';

export const useMemberDiets = (page = 1) => {
  return useQuery({
    queryKey: ['member-diets', page],
    queryFn: () => getMemberDiets(page),
  });
};
