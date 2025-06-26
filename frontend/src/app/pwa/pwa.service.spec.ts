import { TestBed } from '@angular/core/testing';
import { PwaService } from './services/pwa';
import { SwUpdate } from '@angular/service-worker';

// Mock SwUpdate
class MockSwUpdate {
  isEnabled = true;
  versionUpdates = {
    pipe: () => ({
      subscribe: () => {},
    }),
  };
  checkForUpdate = jasmine
    .createSpy('checkForUpdate')
    .and.returnValue(Promise.resolve());
  activateUpdate = jasmine
    .createSpy('activateUpdate')
    .and.returnValue(Promise.resolve());
}

describe('PwaService', () => {
  let service: PwaService;
  let mockSwUpdate: MockSwUpdate;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PwaService, { provide: SwUpdate, useClass: MockSwUpdate }],
    });
    service = TestBed.inject(PwaService);
    mockSwUpdate = TestBed.inject(SwUpdate) as unknown as MockSwUpdate;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with online status', () => {
    expect(service.isOnline).toBe(true);
  });

  it('should check for updates on initialization', () => {
    expect(mockSwUpdate.checkForUpdate).toHaveBeenCalled();
  });

  it('should activate updates', () => {
    service.activateUpdate();
    expect(mockSwUpdate.activateUpdate).toHaveBeenCalled();
  });
});
