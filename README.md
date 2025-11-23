# فرم تماس با ارسال ایمیل و فایل Excel

یک فرم تماس زیبا با قابلیت ارسال ایمیل به دو آدرس مختلف (Admin و کاربر) به همراه فایل Excel.

## ویژگی‌ها

- ✅ ارسال ایمیل به ایمیل ثابت شما (Admin)
- ✅ ارسال ایمیل تاییدیه به کاربری که فرم را پر کرده
- ✅ ضمیمه کردن فایل Excel با اطلاعات فرم
- ✅ طراحی زیبا و ریسپانسیو
- ✅ پشتیبانی از زبان فارسی
- ✅ Netlify Functions برای Backend
- ✅ رایگان تا 125,000 فرم در ماه

## نصب و راه‌اندازی محلی

\`\`\`bash
# نصب dependencies
npm install

# اجرا در حالت توسعه
npm run dev

# ساخت برای تولید
npm run build
\`\`\`

## تنظیمات Gmail

برای ارسال ایمیل از طریق Gmail:

1. به [Google Account Security](https://myaccount.google.com/security) بروید
2. **2-Step Verification** را فعال کنید
3. به [App Passwords](https://myaccount.google.com/apppasswords) بروید
4. یک App Password جدید بسازید و آن را کپی کنید

## Deploy در Netlify

### مرحله 1: Push به GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit: Contact form with email"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
\`\`\`

### مرحله 2: اتصال به Netlify

1. به [Netlify.com](https://netlify.com) بروید و ثبت‌نام کنید
2. کلیک کنید **Add new site** → **Import an existing project**
3. GitHub را انتخاب کنید و repository خود را connect کنید
4. تنظیمات Build:
   - **Build command**: \`npm run build\`
   - **Publish directory**: \`dist\`
5. کلیک **Deploy site**

### مرحله 3: تنظیم Environment Variables

بعد از deploy، به **Site settings** → **Environment variables** بروید و این متغیرها را اضافه کنید:

\`\`\`
EMAIL_USER = your-email@gmail.com
EMAIL_PASSWORD = your-app-password-from-google
ADMIN_EMAIL = your-email@gmail.com
\`\`\`

### مرحله 4: Redeploy

بعد از اضافه کردن متغیرها، یکبار دیگر deploy کنید:
- **Deploys** → **Trigger deploy** → **Deploy site**

## تست کردن

1. فرم را باز کنید
2. اطلاعات را وارد کنید
3. چک کنید:
   - ✅ ایمیل به Admin رسیده؟
   - ✅ ایمیل به کاربر رسیده؟
   - ✅ فایل Excel به هر دو ایمیل attach شده؟

## ساختار پروژه

\`\`\`
D:\\Sina\\Form\\
├── src/
│   ├── components/
│   │   └── ContactForm/
│   │       ├── ContactForm.jsx
│   │       └── ContactForm.module.css
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── netlify/
│   └── functions/
│       └── send-email.js
├── netlify.toml
├── package.json
└── vite.config.js
\`\`\`

## تکنولوژی‌ها

- **Frontend**: React + Vite
- **Backend**: Netlify Functions (Serverless)
- **Email**: Nodemailer + Gmail SMTP
- **Excel**: SheetJS (xlsx)
- **Hosting**: Netlify (رایگان)

## محدودیت‌های رایگان Netlify

- 125,000 Function requests/ماه
- 100 ساعت Function runtime/ماه
- 100 GB Bandwidth/ماه

برای 200 فرم در ماه: **0.16% استفاده** (کاملاً کافی!)

## پشتیبانی

اگر مشکلی داشتید:

1. چک کنید Environment Variables در Netlify درست تنظیم شده‌اند
2. لاگ‌های Netlify Functions را بررسی کنید
3. مطمئن شوید App Password Gmail صحیح است
4. چک کنید 2-Step Verification Gmail فعال است

## لایسنس

MIT

---

ساخته شده با ❤️ برای ارسال فرم‌های زیبا!
