import residentsData from '@/services/mockData/residents.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ResidentService {
  constructor() {
    this.residents = [...residentsData];
  }

  async getAll() {
    await delay(300);
    return [...this.residents];
  }

  async getById(id) {
    await delay(200);
    const resident = this.residents.find(r => r.Id === parseInt(id));
    if (!resident) {
      throw new Error(`Resident with ID ${id} not found`);
    }
    return { ...resident };
  }

  async create(residentData) {
    await delay(400);
    const newResident = {
      ...residentData,
      Id: Math.max(...this.residents.map(r => r.Id), 0) + 1,
      checkInDate: residentData.checkInDate || new Date().toISOString(),
      checkOutDate: null,
      paymentStatus: 'pending'
    };
    this.residents.push(newResident);
    return { ...newResident };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.residents.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Resident with ID ${id} not found`);
    }
    this.residents[index] = { ...this.residents[index], ...updateData };
    return { ...this.residents[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.residents.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Resident with ID ${id} not found`);
    }
    this.residents.splice(index, 1);
    return true;
  }
}

export default new ResidentService();