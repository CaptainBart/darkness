import { DarknessService } from './darkness.service';

describe('DarknessService', () => {
  let service: DarknessService;
  let lat = 52.02258929470043;
  let lng = 5.634036837524087;
  
  beforeEach(() => {
      service = new DarknessService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should create correct sections on 2020.07.23', () => {
      const darkness = service.getDarknessForDay(new Date(2020, 6, 23), lat, lng);
      console.dir(darkness);
  });
});
