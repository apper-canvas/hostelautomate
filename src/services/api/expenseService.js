import mockData from '@/services/mockData/expenses.json';

// In-memory storage for development
let expenses = [...mockData];
let nextId = Math.max(...expenses.map(e => e.Id)) + 1;

const expenseService = {
  // Get all expenses
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...expenses];
  },

  // Get expense by ID
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid expense ID');
    }
    const expense = expenses.find(e => e.Id === parsedId);
    return expense ? { ...expense } : null;
  },

  // Create new expense
  create: async (expenseData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newExpense = {
      ...expenseData,
      Id: nextId++,
      date: new Date(expenseData.date).toISOString().split('T')[0]
    };
    expenses.unshift(newExpense);
    return { ...newExpense };
  },

  // Update existing expense
  update: async (id, expenseData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid expense ID');
    }
    
    const index = expenses.findIndex(e => e.Id === parsedId);
    if (index === -1) {
      throw new Error('Expense not found');
    }

    const updatedExpense = {
      ...expenses[index],
      ...expenseData,
      Id: parsedId,
      date: new Date(expenseData.date).toISOString().split('T')[0]
    };
    
    expenses[index] = updatedExpense;
    return { ...updatedExpense };
  },

  // Delete expense
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid expense ID');
    }
    
    const index = expenses.findIndex(e => e.Id === parsedId);
    if (index === -1) {
      throw new Error('Expense not found');
    }
    
    expenses.splice(index, 1);
    return true;
  },

  // Search expenses
  search: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const lowerQuery = query.toLowerCase();
    const filtered = expenses.filter(expense =>
      expense.description.toLowerCase().includes(lowerQuery) ||
      expense.vendor.toLowerCase().includes(lowerQuery) ||
      expense.category.toLowerCase().includes(lowerQuery)
    );
    return [...filtered];
  },

  // Filter by category
  getByCategory: async (category) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const filtered = expenses.filter(expense => expense.category === category);
    return [...filtered];
  },

  // Get expenses by date range
  getByDateRange: async (startDate, endDate) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });
    
    return [...filtered];
  },

  // Get category summary
  getCategorySummary: async () => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const summary = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    
    return summary;
  },

  // Get monthly summary
  getMonthlySummary: async (year, month) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === year && expenseDate.getMonth() === month - 1;
    });
    
    const total = filtered.reduce((sum, expense) => sum + expense.amount, 0);
    const categoryBreakdown = filtered.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    
    return {
      total,
      count: filtered.length,
      categoryBreakdown,
      expenses: [...filtered]
    };
  }
};

export default expenseService;