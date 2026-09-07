import { membersApi } from '../src/features/members/api/members.api';
import { membershipsApi } from '../src/features/memberships/api/memberships.api';
import { plansApi } from '../src/features/plans/api/plans.api';
import { trainersApi } from '../src/features/trainers/api/trainers.api';
import api from '../src/services/api';

jest.mock('../src/services/api', () => ({
  get: jest.fn().mockResolvedValue({ data: { success: true, data: {} } }),
  post: jest.fn().mockResolvedValue({ data: { success: true, data: {} } }),
  put: jest.fn().mockResolvedValue({ data: { success: true, data: {} } }),
  delete: jest.fn().mockResolvedValue({ data: { success: true, data: null } }),
}));

describe('API Functions', () => {
  describe('Members API', () => {
    it('fetches members', async () => {
      await membersApi.getMembers();
      expect(api.get).toHaveBeenCalledWith('/members', { params: undefined });
    });
    it('fetches single member', async () => {
      await membersApi.getMemberById('1');
      expect(api.get).toHaveBeenCalledWith('/members/1');
    });
  });

  describe('Memberships API', () => {
    it('fetches memberships', async () => {
      await membershipsApi.getMemberships();
      expect(api.get).toHaveBeenCalledWith('/memberships', { params: undefined });
    });
    it('creates membership', async () => {
      const payload = { memberId: '1', planId: '1', startDate: '2026-01-01' };
      await membershipsApi.createMembership(payload);
      expect(api.post).toHaveBeenCalledWith('/memberships', payload);
    });
    it('renews membership', async () => {
      await membershipsApi.renewMembership('1', { planId: '1', startDate: '2026-01-01', endDate: '2026-12-31' });
      expect(api.post).toHaveBeenCalled();
    });
  });

  describe('Plans API', () => {
    it('fetches plans', async () => {
      await plansApi.getPlans();
      expect(api.get).toHaveBeenCalledWith('/plans', { params: undefined });
    });
    it('fetches single plan', async () => {
      await plansApi.getPlanById?.('1');
      expect(api.get).toHaveBeenCalledWith('/plans/1');
    });
  });

  describe('Trainers API', () => {
    it('fetches trainers', async () => {
      await trainersApi.getTrainers();
      expect(api.get).toHaveBeenCalledWith('/trainers', { params: undefined });
    });
    it('fetches single trainer', async () => {
      await trainersApi.getTrainerById?.('1');
      expect(api.get).toHaveBeenCalledWith('/trainers/1');
    });
  });
});
