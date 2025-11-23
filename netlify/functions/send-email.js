const nodemailer = require('nodemailer');
const XLSX = require('xlsx');

// تنظیمات SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// ساخت فایل Excel
const createExcelBuffer = (data) => {
  const worksheet = XLSX.utils.json_to_sheet([data]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'فرم');
  
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { from_name, user_email, phone, message } = data;

    if (!from_name || !user_email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'فیلدهای ضروری را پر کنید' })
      };
    }

    const formData = {
      'نام': from_name,
      'ایمیل': user_email,
      'تلفن': phone || '-',
      'پیام': message,
      'تاریخ': new Date().toLocaleString('fa-IR')
    };

    const excelBuffer = createExcelBuffer(formData);

    // ارسال به ایمیل Admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `📋 فرم جدید از ${from_name}`,
      html: `
        <div dir="rtl" style="font-family: Tahoma, Arial; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 10px;">فرم جدیدی دریافت شد</h2>
            <p><strong>👤 نام:</strong> ${from_name}</p>
            <p><strong>📧 ایمیل:</strong> ${user_email}</p>
            <p><strong>📱 تلفن:</strong> ${phone || '-'}</p>
            <p><strong>📅 تاریخ:</strong> ${formData['تاریخ']}</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p><strong>💬 پیام:</strong></p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-right: 4px solid #667eea;">
              ${message}
            </div>
          </div>
        </div>
      `,
      attachments: [{
        filename: `form_${Date.now()}.xlsx`,
        content: excelBuffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }]
    });

    // ارسال به ایمیل کاربر
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user_email,
      subject: '✅ تایید دریافت فرم شما',
      html: `
        <div dir="rtl" style="font-family: Tahoma, Arial; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #4CAF50;">سلام ${from_name} عزیز،</h2>
            <p>فرم شما با موفقیت دریافت شد و در اسرع وقت بررسی خواهد شد.</p>
            <hr style="margin: 20px 0;">
            <p><strong>پیام شما:</strong></p>
            <div style="background: #f0f0f0; padding: 15px; border-radius: 5px;">
              ${message}
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              این ایمیل به صورت خودکار ارسال شده است.
            </p>
          </div>
        </div>
      `,
      attachments: [{
        filename: `form_${Date.now()}.xlsx`,
        content: excelBuffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'فرم با موفقیت ارسال شد!'
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'خطا در ارسال فرم',
        details: error.message 
      })
    };
  }
};

