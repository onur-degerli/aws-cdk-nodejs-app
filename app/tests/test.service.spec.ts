import { TestService } from '../services/test.service';

describe('TestService', () => {
  it('should return true from doLogic', () => {
    const service = new TestService();
    expect(service.doLogic()).toBe(true);
  });

  it('should return true from doAnotherLogic', () => {
    const service = new TestService();
    expect(service.doAnotherLogic()).toBe(true);
  });
});
