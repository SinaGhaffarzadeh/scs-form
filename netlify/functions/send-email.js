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
    
    // بررسی اینکه آیا داده‌های فرم جدید (تایید کار ماهانه) است یا فرم قدیم (تماس)
    const isApprovalForm = data.professorName && data.studentName;
    
    let formData, emailSubject, emailHtml, userEmail, userName, studentName, monthYear, approvalStatus;
    
    if (isApprovalForm) {
      // فرم تایید کار ماهانه پژوهشگران
      const { professorName, professorEmail, projectTitle, studentName: student, month, year, monthYear: monthYearValue, approvalStatus: status } = data;
      studentName = student;
      monthYear = monthYearValue;
      approvalStatus = status;
      
      if (!professorName || !professorEmail || !studentName || !approvalStatus) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'فیلدهای ضروری را پر کنید' })
        };
      }
      
      const approvalStatusText = approvalStatus === 'approved' ? 'تایید' : 'عدم تایید';
      
      formData = {
        'نام استاد': professorName,
        'ایمیل استاد': professorEmail,
        'عنوان پروژه': projectTitle,
        'نام دانشجو': studentName,
        'ماه': month,
        'سال': year,
        'ماه و سال': monthYear,
        'وضعیت تایید': approvalStatusText,
        'تاریخ ثبت': new Date().toLocaleString('fa-IR')
      };
      
      userName = professorName;
      userEmail = professorEmail;
      emailSubject = `📋 فرم تایید کار ماهانه - ${studentName}`;
      emailHtml = `
        <div dir="rtl" style="font-family: Tahoma, Arial; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 10px;">فرم تایید کار ماهانه پژوهشگران</h2>
            <p><strong>👤 نام استاد:</strong> ${professorName}</p>
            <p><strong>📧 ایمیل استاد:</strong> ${professorEmail}</p>
            <p><strong>📋 عنوان پروژه:</strong> ${projectTitle}</p>
            <p><strong>👥 نام دانشجو:</strong> ${studentName}</p>
            <p><strong>📅 ماه و سال:</strong> ${monthYear}</p>
            <p><strong>✅ وضعیت تایید:</strong> <span style="color: ${approvalStatus === 'approved' ? '#28a745' : '#dc3545'}; font-weight: bold;">${approvalStatusText}</span></p>
            <p><strong>🕐 تاریخ ثبت:</strong> ${formData['تاریخ ثبت']}</p>
          </div>
        </div>
      `;
    } else {
      // فرم تماس قدیم
      const { from_name, user_email, phone, message } = data;
      
      if (!from_name || !user_email || !message) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'فیلدهای ضروری را پر کنید' })
        };
      }
      
      formData = {
        'نام': from_name,
        'ایمیل': user_email,
        'تلفن': phone || '-',
        'پیام': message,
        'تاریخ': new Date().toLocaleString('fa-IR')
      };
      
      userName = from_name;
      userEmail = user_email;
      emailSubject = `📋 فرم جدید از ${from_name}`;
      emailHtml = `
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
      `;
    }

    const excelBuffer = createExcelBuffer(formData);

    // ارسال به ایمیل Admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: emailSubject,
      html: emailHtml,
      attachments: [{
        filename: `form_${Date.now()}.xlsx`,
        content: excelBuffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }]
    });

    // ارسال به ایمیل کاربر
    const userEmailHtml = isApprovalForm ? `
      <div dir="rtl" style="font-family: Tahoma, Arial; padding: 20px; background: #f5f5f5;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #4CAF50;">سلام ${userName} عزیز،</h2>
          <p>فرم تایید کار ماهانه شما با موفقیت دریافت شد.</p>
          <hr style="margin: 20px 0;">
          <p><strong>📋 اطلاعات فرم:</strong></p>
          <div style="background: #f0f0f0; padding: 15px; border-radius: 5px;">
            <p><strong>نام دانشجو:</strong> ${studentName}</p>
            <p><strong>ماه و سال:</strong> ${monthYear}</p>
            <p><strong>وضعیت:</strong> ${approvalStatus === 'approved' ? '✅ تایید' : '❌ عدم تایید'}</p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            این ایمیل به صورت خودکار ارسال شده است.
          </p>
        </div>
      </div>
    ` : `
      <div dir="rtl" style="font-family: Tahoma, Arial; padding: 20px; background: #f5f5f5;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #4CAF50;">سلام ${userName} عزیز،</h2>
          <p>فرم شما با موفقیت دریافت شد و در اسرع وقت بررسی خواهد شد.</p>
          <hr style="margin: 20px 0;">
          <p><strong>پیام شما:</strong></p>
          <div style="background: #f0f0f0; padding: 15px; border-radius: 5px;">
            ${data.message}
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            این ایمیل به صورت خودکار ارسال شده است.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: isApprovalForm ? '✅ تایید دریافت فرم تایید کار ماهانه' : '✅ تایید دریافت فرم شما',
      html: userEmailHtml,
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

