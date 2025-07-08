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

  async assignResidentsBulk(roomIds, residentId) {
    await delay(500);
    
    const validRoomIds = roomIds.map(id => parseInt(id));
    const parsedResidentId = parseInt(residentId);
    
    // Validate all rooms exist and are available
    const roomsToUpdate = [];
    for (const roomId of validRoomIds) {
      const room = this.rooms.find(r => r.Id === roomId);
      if (!room) {
        throw new Error(`Room with ID ${roomId} not found`);
      }
      if (room.status !== 'available') {
        throw new Error(`Room ${room.roomNumber} is not available for assignment`);
      }
      if (room.currentOccupancy >= room.capacity) {
        throw new Error(`Room ${room.roomNumber} is at full capacity`);
      }
      roomsToUpdate.push(room);
    }

    // Update all rooms
    for (const room of roomsToUpdate) {
      const index = this.rooms.findIndex(r => r.Id === room.Id);
      this.rooms[index] = {
        ...room,
        currentOccupancy: room.currentOccupancy + 1,
        status: room.currentOccupancy + 1 >= room.capacity ? 'occupied' : 'available',
        beds: room.beds?.map(bed => 
          !bed.isOccupied && !bed.residentId 
            ? { ...bed, isOccupied: true, residentId: parsedResidentId }
            : bed
        ) || []
      };
    }

    return roomsToUpdate.map(room => ({ ...this.rooms.find(r => r.Id === room.Id) }));
  }
}

export default new RoomService();