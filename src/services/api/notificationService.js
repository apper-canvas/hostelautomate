import paymentService from '@/services/api/paymentService';
import residentService from '@/services/api/residentService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class NotificationService {
  constructor() {
    this.sentReminders = new Set(); // Track sent reminders to avoid duplicates
  }

  async getUpcomingPayments() {
    await delay(200);
    
    try {
      const [payments, residents] = await Promise.all([
        paymentService.getAll(),
        residentService.getAll()
      ]);

      const now = new Date();
      const upcomingThreshold = new Date();
      upcomingThreshold.setDate(now.getDate() + 7); // Next 7 days

      const upcomingPayments = payments
        .filter(payment => {
          if (payment.status !== 'pending') return false;
          
          const dueDate = new Date(payment.dueDate);
          return dueDate >= now && dueDate <= upcomingThreshold;
        })
        .map(payment => {
          const resident = residents.find(r => r.Id === parseInt(payment.residentId));
          const dueDate = new Date(payment.dueDate);
          const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
          
          return {
            ...payment,
            resident: resident || { name: 'Unknown Resident' },
            daysUntilDue,
            isUrgent: daysUntilDue <= 1
          };
        })
        .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

      return upcomingPayments;
    } catch (error) {
      throw new Error('Failed to fetch upcoming payments');
    }
  }

  async getPaymentsDueIn24Hours() {
    await delay(150);
    
    try {
      const payments = await paymentService.getAll();
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);

      return payments.filter(payment => {
        if (payment.status !== 'pending') return false;
        
        const dueDate = new Date(payment.dueDate);
        return dueDate >= now && dueDate <= tomorrow;
      });
    } catch (error) {
      throw new Error('Failed to fetch payments due in 24 hours');
    }
  }

  async sendReminders() {
    await delay(300);
    
    try {
      const paymentsDue = await this.getPaymentsDueIn24Hours();
      const residents = await residentService.getAll();
      
      const reminders = [];

      for (const payment of paymentsDue) {
        const reminderKey = `${payment.Id}-${payment.dueDate}`;
        
        // Skip if reminder already sent for this payment
        if (this.sentReminders.has(reminderKey)) {
          continue;
        }

        const resident = residents.find(r => r.Id === parseInt(payment.residentId));
        if (!resident) continue;

        // Simulate sending email
        const emailSent = await this.sendEmail(resident, payment);
        
        if (emailSent) {
          this.sentReminders.add(reminderKey);
          reminders.push({
            type: 'email',
            residentId: payment.residentId,
            residentName: resident.name,
            paymentId: payment.Id,
            amount: payment.amount,
            dueDate: payment.dueDate,
            sentAt: new Date().toISOString()
          });
        }
      }

      return {
        success: true,
        remindersSent: reminders.length,
        reminders
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        remindersSent: 0
      };
    }
  }

  async sendEmail(resident, payment) {
    await delay(100);
    
    // Simulate email sending (90% success rate)
    const success = Math.random() > 0.1;
    
    if (success) {
      console.log(`📧 Email sent to ${resident.name} (${resident.email || 'email@example.com'}):`);
      console.log(`   Subject: Payment Reminder - Due Tomorrow`);
      console.log(`   Amount: $${payment.amount}`);
      console.log(`   Due Date: ${payment.dueDate}`);
      console.log(`   Period: ${payment.period}`);
    } else {
      console.error(`❌ Failed to send email to ${resident.name}`);
    }
    
    return success;
  }

  async markNotificationAsRead(notificationId) {
    await delay(100);
    // In a real app, this would update the notification status in the database
    return true;
  }

  async getNotificationCount() {
    try {
      const upcomingPayments = await this.getUpcomingPayments();
      return upcomingPayments.filter(payment => payment.daysUntilDue <= 3).length;
    } catch (error) {
      return 0;
    }
  }

  // Auto-run reminder system (would be called by a scheduled job in production)
  startReminderSystem() {
    const checkAndSendReminders = async () => {
      try {
        const result = await this.sendReminders();
        if (result.remindersSent > 0) {
          console.log(`🔔 Sent ${result.remindersSent} payment reminders`);
        }
      } catch (error) {
        console.error('Reminder system error:', error);
      }
    };

    // Check every hour (in production, this would be a server-side cron job)
    const intervalId = setInterval(checkAndSendReminders, 60 * 60 * 1000);
    
    // Run immediately
    checkAndSendReminders();
    
    return intervalId;
  }
}

export default new NotificationService();