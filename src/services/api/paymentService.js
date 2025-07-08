import paymentsData from '@/services/mockData/payments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PaymentService {
  constructor() {
    this.payments = [...paymentsData];
  }

  async getAll() {
    await delay(300);
    return [...this.payments];
  }

  async getById(id) {
    await delay(200);
    const payment = this.payments.find(p => p.Id === parseInt(id));
    if (!payment) {
      throw new Error(`Payment with ID ${id} not found`);
    }
    return { ...payment };
  }

  async create(paymentData) {
    await delay(400);
    const newPayment = {
      ...paymentData,
      Id: Math.max(...this.payments.map(p => p.Id), 0) + 1,
      status: 'pending',
      paidDate: null,
      method: null
    };
    this.payments.push(newPayment);
    return { ...newPayment };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.payments.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Payment with ID ${id} not found`);
    }
    this.payments[index] = { ...this.payments[index], ...updateData };
    return { ...this.payments[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.payments.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Payment with ID ${id} not found`);
    }
    this.payments.splice(index, 1);
    return true;
  }
}

export default new PaymentService();