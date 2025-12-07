import { servicesData } from '@/lib/services-data';

describe('services-data', () => {
  it('should have exactly 4 services', () => {
    expect(servicesData).toHaveLength(4);
  });

  it('should have all required fields', () => {
    servicesData.forEach(service => {
      expect(service).toHaveProperty('id');
      expect(service).toHaveProperty('title');
      expect(service).toHaveProperty('description');
      expect(service).toHaveProperty('icon');

      // Verify types
      expect(typeof service.id).toBe('string');
      expect(typeof service.title).toBe('string');
      expect(typeof service.description).toBe('string');
      expect(typeof service.icon).toBe('string');
    });
  });

  it('should NOT have pricing field (policy requirement)', () => {
    servicesData.forEach(service => {
      expect(service).not.toHaveProperty('pricing');
    });
  });

  it('should have unique IDs', () => {
    const ids = servicesData.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(servicesData.length);
  });

  it('should have expected service IDs', () => {
    const expectedIds = ['advertising', 'video', 'design', 'strategy'];
    const actualIds = servicesData.map(s => s.id);

    expectedIds.forEach(expectedId => {
      expect(actualIds).toContain(expectedId);
    });
  });

  it('should have non-empty titles and descriptions', () => {
    servicesData.forEach(service => {
      expect(service.title.length).toBeGreaterThan(0);
      expect(service.description.length).toBeGreaterThan(0);
    });
  });

  it('should have valid icon paths', () => {
    servicesData.forEach(service => {
      // Icons should start with /images/icons/ or /icons/
      expect(service.icon).toMatch(/^\/(images\/)?icons?\//);
    });
  });
});
