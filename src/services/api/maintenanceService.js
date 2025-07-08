import maintenanceData from '@/services/mockData/maintenance.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MaintenanceService {
  constructor() {
    this.requests = [...maintenanceData];
  }

  async getAll() {
    await delay(300);
    return [...this.requests];
  }

  async getById(id) {
    await delay(200);
    const request = this.requests.find(r => r.Id === parseInt(id));
    if (!request) {
      throw new Error(`Maintenance request with ID ${id} not found`);
    }
    return { ...request };
  }

  async create(requestData) {
    await delay(400);
    const newRequest = {
      ...requestData,
      Id: Math.max(...this.requests.map(r => r.Id), 0) + 1,
      status: 'pending',
      createdAt: new Date().toISOString(),
      resolvedAt: null
    };
    this.requests.push(newRequest);
    return { ...newRequest };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.requests.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Maintenance request with ID ${id} not found`);
    }
    this.requests[index] = { ...this.requests[index], ...updateData };
    return { ...this.requests[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.requests.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Maintenance request with ID ${id} not found`);
    }
    this.requests.splice(index, 1);
    return true;
  }
}

export default new MaintenanceService();