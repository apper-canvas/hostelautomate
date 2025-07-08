import roomsData from '@/services/mockData/rooms.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class RoomService {
  constructor() {
    this.rooms = [...roomsData];
  }

  async getAll() {
    await delay(300);
    return [...this.rooms];
  }

  async getById(id) {
    await delay(200);
    const room = this.rooms.find(r => r.Id === parseInt(id));
    if (!room) {
      throw new Error(`Room with ID ${id} not found`);
    }
    return { ...room };
  }

  async create(roomData) {
    await delay(400);
    const newRoom = {
      ...roomData,
      Id: Math.max(...this.rooms.map(r => r.Id), 0) + 1,
      currentOccupancy: 0,
      beds: roomData.beds || []
    };
    this.rooms.push(newRoom);
    return { ...newRoom };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.rooms.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Room with ID ${id} not found`);
    }
    this.rooms[index] = { ...this.rooms[index], ...updateData };
    return { ...this.rooms[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.rooms.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Room with ID ${id} not found`);
    }
    this.rooms.splice(index, 1);
    return true;
  }
}

export default new RoomService();