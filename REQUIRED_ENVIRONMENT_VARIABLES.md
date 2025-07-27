# Coffee Pro - Required Environment Variables Check

## Essential Variables for Railway Deployment

### ✅ Already Set (Based on Previous Setup)
```
NODE_ENV=production
SESSION_SECRET=a93f9205657eee8e31cfaca6bf94421e22983d52d29e442c645a6146d9de1ed5
ADMIN_PASSWORD=Coffeeproegypt
DATABASE_URL=(auto-provided by Railway PostgreSQL service)
```

### 🔍 Additional Variables Your App May Need

#### **PORT** (Railway Auto-Provides)
- Railway automatically sets this
- Your server listens on `process.env.PORT || 3000`
- ✅ No action needed

#### **For Email Features** (If Used)
```
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
```
- Only needed if contact forms send emails
- Currently forms save to database only

#### **For External APIs** (If Used)
```
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone
```
- Only needed for SMS notifications
- Currently not implemented

#### **For File Uploads** (If Used)
```
MAX_FILE_SIZE=50000000
UPLOAD_PATH=/tmp/uploads
```
- Currently using in-memory storage
- Not needed for current setup

## Variables Check for Your Current Setup

### ✅ Required and Set
1. **NODE_ENV** = production
2. **SESSION_SECRET** = (64-character secure string)
3. **ADMIN_PASSWORD** = Coffeeproegypt
4. **DATABASE_URL** = (auto-linked from PostgreSQL)

### ✅ Optional but Useful
```
# For better error handling
NODE_OPTIONS=--max-old-space-size=4096

# For Railway deployment
PORT=(auto-set by Railway)
```

## Coffee Pro Features That Work Without Extra Variables

✅ **Admin Dashboard** - Uses SESSION_SECRET + ADMIN_PASSWORD  
✅ **Contact Forms** - Saves to PostgreSQL database  
✅ **Newsletter Signups** - Saves to marketing_contacts table  
✅ **QR Loyalty System** - Uses database + geolocation API  
✅ **Franchise Applications** - Saves to franchise_applications table  
✅ **Menu Display** - Static content with database storage  

## Verification Commands

In Railway terminal, check variables are set:
```bash
echo $NODE_ENV
echo $SESSION_SECRET
echo $ADMIN_PASSWORD
echo $DATABASE_URL
```

## Missing Variables Impact

If any core variables are missing:
- **SESSION_SECRET**: Admin login won't work
- **ADMIN_PASSWORD**: Can't access admin dashboard
- **DATABASE_URL**: Database connections fail
- **NODE_ENV**: May not optimize for production

Based on your Coffee Pro application, you should have all required variables already set from the previous setup.