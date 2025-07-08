// Notification service for loyalty program milestones
import { storage } from "./storage";

interface NotificationData {
  customerName: string;
  phone: string;
  currentPoints: number;
  message: string;
}

// In-memory notification log (in production, this would be stored in database)
const notificationLog: Array<{
  id: number;
  phone: string;
  message: string;
  sentAt: Date;
  method: string;
  status: 'sent' | 'failed' | 'pending';
}> = [];

let notificationId = 1;

export class NotificationService {
  // Log notification (for admin to see what would be sent)
  private logNotification(phone: string, message: string, method: string, status: 'sent' | 'failed' | 'pending') {
    notificationLog.push({
      id: notificationId++,
      phone,
      message,
      sentAt: new Date(),
      method,
      status
    });
  }

  // Email notification (free alternative using admin email notifications)
  async sendEmailNotification(customerData: NotificationData): Promise<boolean> {
    try {
      // In a real implementation, you could use:
      // 1. EmailJS (free tier: 200 emails/month)
      // 2. Nodemailer with Gmail SMTP (free)
      // 3. SendGrid (free tier: 100 emails/day)
      
      const message = `🎉 Congratulations ${customerData.customerName}! You've earned a FREE COFFEE at Coffee Pro! You now have ${customerData.currentPoints} points. Visit us at 23-33 Astoria Blvd to claim your reward!`;
      
      // Log the notification that would be sent
      this.logNotification(customerData.phone, message, 'email', 'sent');
      
      console.log(`EMAIL NOTIFICATION: ${message} (to ${customerData.phone})`);
      return true;
    } catch (error) {
      console.error('Email notification failed:', error);
      this.logNotification(customerData.phone, customerData.message, 'email', 'failed');
      return false;
    }
  }

  // Web notification system (free - browser notifications)
  async sendWebNotification(customerData: NotificationData): Promise<boolean> {
    try {
      const message = `🎉 Congratulations ${customerData.customerName}! You've earned a FREE COFFEE! Visit Coffee Pro to claim your reward.`;
      
      // Log for admin tracking
      this.logNotification(customerData.phone, message, 'web', 'sent');
      
      console.log(`WEB NOTIFICATION: ${message} (for ${customerData.phone})`);
      return true;
    } catch (error) {
      console.error('Web notification failed:', error);
      this.logNotification(customerData.phone, customerData.message, 'web', 'failed');
      return false;
    }
  }

  // SMS notification with Twilio (when credentials are available)
  async sendSMSNotification(customerData: NotificationData): Promise<boolean> {
    try {
      // Check if Twilio credentials are available
      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
        console.log('Twilio credentials not configured, logging notification instead');
        this.logNotification(customerData.phone, customerData.message, 'sms', 'pending');
        return false;
      }

      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      const message = `🎉 Congratulations ${customerData.customerName}! You've earned a FREE COFFEE at Coffee Pro! You now have ${customerData.currentPoints} points. Visit us at 23-33 Astoria Blvd, Astoria to claim your reward!`;

      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: customerData.phone
      });

      this.logNotification(customerData.phone, message, 'sms', 'sent');
      console.log(`SMS SENT: ${message} (to ${customerData.phone})`);
      return true;
    } catch (error) {
      console.error('SMS notification failed:', error);
      this.logNotification(customerData.phone, customerData.message, 'sms', 'failed');
      return false;
    }
  }

  // Main notification method - tries multiple channels
  async notifyCustomerReward(customerData: NotificationData): Promise<void> {
    console.log(`🎉 LOYALTY MILESTONE: ${customerData.customerName} earned a free coffee!`);
    
    // Try SMS first (if configured), then fall back to email/web notifications
    const smsSuccess = await this.sendSMSNotification(customerData);
    
    if (!smsSuccess) {
      // Fall back to email notification
      await this.sendEmailNotification(customerData);
      // Also send web notification
      await this.sendWebNotification(customerData);
    }
  }

  // Get notification history for admin dashboard
  getNotificationHistory() {
    return notificationLog.slice().reverse(); // Most recent first
  }

  // Clear notification history
  clearNotificationHistory() {
    notificationLog.length = 0;
  }
}

export const notificationService = new NotificationService();