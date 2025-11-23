import { useState, useEffect } from 'react';
import styles from './ProfessorApprovalForm.module.css';

// داده‌های نمونه استادان، پروژه‌ها و دانشجویان
const PROFESSORS_DATA = [
  {
    id: 1,
    name: 'دکتر احمد محمدی',
    email: 'ahmad.mohammadi@example.com',
    project: 'پروژه هوش مصنوعی و یادگیری ماشین',
    students: ['علی رضایی', 'فاطمه احمدی', 'محمد کریمی']
  },
  {
    id: 2,
    name: 'دکتر سارا نوری',
    email: 'sara.nouri@example.com',
    project: 'پروژه پردازش زبان طبیعی',
    students: ['حسین زارعی', 'زهرا موسوی']
  },
  {
    id: 3,
    name: 'دکتر رضا حسینی',
    email: 'reza.hosseini@example.com',
    project: 'پروژه بینایی کامپیوتر',
    students: ['مریم رضایی', 'امیر علیزاده', 'نرگس کاظمی', 'حسن محمودی']
  },
  {
    id: 4,
    name: 'دکتر مریم صادقی',
    email: 'maryam.sadeghi@example.com',
    project: 'پروژه شبکه‌های عصبی عمیق',
    students: ['محمد رضایی', 'فاطمه کریمی']
  }
];

// نام ماه‌های شمسی
const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

// تابع تبدیل تاریخ میلادی به شمسی
const gregorianToJalali = (gy, gm, gd) => {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy, jm, jd;
  
  if (gy > 1600) {
    jy = 979;
    gy -= 1600;
  } else {
    jy = 0;
    gy -= 621;
  }
  
  const gy2 = (gm > 2) ? (gy + 1) : gy;
  const days = (365 * gy) + (parseInt((gy2 + 3) / 4)) - (parseInt((gy2 + 99) / 100)) + 
               (parseInt((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * parseInt(days / 12053);
  let day = days % 12053;
  jy += 4 * parseInt(day / 1461);
  day %= 1461;
  
  if (day > 365) {
    jy += parseInt((day - 1) / 365);
    day = (day - 1) % 365;
  }
  
  if (day < 186) {
    jm = 1 + parseInt(day / 31);
    jd = 1 + (day % 31);
  } else {
    jm = 7 + parseInt((day - 186) / 30);
    jd = 1 + ((day - 186) % 30);
  }
  
  return { year: jy, month: jm, day: jd };
};

// تابع دریافت ماه و سال شمسی جاری
const getCurrentPersianDate = () => {
  const now = new Date();
  const gy = now.getFullYear();
  const gm = now.getMonth() + 1;
  const gd = now.getDate();
  
  const jalali = gregorianToJalali(gy, gm, gd);
  const monthName = PERSIAN_MONTHS[jalali.month - 1];
  
  return {
    month: monthName,
    year: jalali.year,
    display: `${monthName} - ${jalali.year}`
  };
};

const ProfessorApprovalForm = () => {
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [professorEmail, setProfessorEmail] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [currentDate, setCurrentDate] = useState(getCurrentPersianDate());
  const [approvalStatus, setApprovalStatus] = useState(null); // 'approved' or 'rejected'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // به‌روزرسانی خودکار تاریخ هنگام بارگذاری و تغییر روز
  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(getCurrentPersianDate());
    };
    
    // به‌روزرسانی در ابتدا
    updateDate();
    
    // به‌روزرسانی هر ساعت (برای تغییر روز)
    const interval = setInterval(updateDate, 3600000); // هر ساعت
    
    return () => clearInterval(interval);
  }, []);

  const handleProfessorChange = (e) => {
    const professorId = parseInt(e.target.value);
    const professor = PROFESSORS_DATA.find(p => p.id === professorId);
    setSelectedProfessor(professor || null);
    setProfessorEmail(professor?.email || '');
    setSelectedStudent(''); // ریست کردن دانشجو هنگام تغییر استاد
    setApprovalStatus(null); // ریست کردن وضعیت تایید هنگام تغییر استاد
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProfessor) {
      setMessage('❌ لطفاً استاد را انتخاب کنید');
      return;
    }

    if (!selectedStudent) {
      setMessage('❌ لطفاً دانشجو را انتخاب کنید');
      return;
    }

    if (!approvalStatus) {
      setMessage('❌ لطفاً وضعیت تایید را مشخص کنید');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = {
      professorName: selectedProfessor.name,
      professorEmail: professorEmail,
      projectTitle: selectedProfessor.project,
      studentName: selectedStudent,
      month: currentDate.month,
      year: currentDate.year,
      monthYear: currentDate.display,
      approvalStatus: approvalStatus,
      timestamp: new Date().toISOString()
    };

    try {
      // ارسال به Netlify Function (در صورت نیاز)
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ فرم با موفقیت ارسال شد!');
      } else {
        throw new Error(result.error || 'خطا در ارسال');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ خطا در ارسال فرم. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>تایید کار ماهانه پژوهشگران</h1>
        <p className={styles.description}>
          لطفاً اطلاعات مورد نیاز را تکمیل کنید
        </p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* انتخاب استاد */}
          <div className={styles.field}>
            <label htmlFor="professor">
              <span className={styles.icon}>👤</span>
              اسامی اساتید *
            </label>
            <select
              id="professor"
              value={selectedProfessor?.id || ''}
              onChange={handleProfessorChange}
              required
              className={styles.select}
            >
              <option value="">-- لطفاً نام خود را از لیست انتخاب کنید --</option>
              {PROFESSORS_DATA.map((professor) => (
                <option key={professor.id} value={professor.id}>
                  {professor.name}
                </option>
              ))}
            </select>
          </div>

          {/* نمایش ایمیل استاد */}
          {selectedProfessor && (
            <div className={styles.field}>
              <label htmlFor="professorEmail">
                <span className={styles.icon}>📧</span>
                ایمیل *
              </label>
              <input
                type="email"
                id="professorEmail"
                value={professorEmail}
                onChange={(e) => setProfessorEmail(e.target.value)}
                required
                placeholder="example@email.com"
                className={styles.input}
              />
            </div>
          )}

          {/* نمایش عنوان پروژه */}
          {selectedProfessor && (
            <div className={styles.field}>
              <label>
                <span className={styles.icon}>📋</span>
                عنوان پروژه
              </label>
              <div className={styles.infoBox}>
                {selectedProfessor.project}
              </div>
            </div>
          )}

          {/* انتخاب دانشجو */}
          {selectedProfessor && (
            <div className={styles.field}>
              <label htmlFor="student">
                <span className={styles.icon}>👥</span>
                اسامی دانشجویان *
              </label>
              <select
                id="student"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                required
                className={styles.select}
              >
                <option value="">-- لطفاً دانشجو را انتخاب کنید --</option>
                {selectedProfessor.students.map((student, index) => (
                  <option key={index} value={student}>
                    {student}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ماه جاری و دکمه‌های تایید/عدم تایید */}
          <div className={styles.field}>
            <label>
              <span className={styles.icon}>📅</span>
              ماه جاری
            </label>
            <div className={styles.monthSection}>
              <div className={styles.monthDisplay}>
                {currentDate.display}
              </div>
              <div className={styles.approvalButtons}>
                <button
                  type="button"
                  onClick={() => setApprovalStatus('approved')}
                  className={`${styles.approvalBtn} ${styles.approveBtn} ${
                    approvalStatus === 'approved' ? styles.active : ''
                  }`}
                >
                  ✓ تایید
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalStatus('rejected')}
                  className={`${styles.approvalBtn} ${styles.rejectBtn} ${
                    approvalStatus === 'rejected' ? styles.active : ''
                  }`}
                >
                  ✗ عدم تایید
                </button>
              </div>
            </div>
          </div>

          {/* متن تاییدیه */}
          {selectedProfessor && (
            <div className={styles.field}>
              <div className={styles.confirmationText}>
                اینجانب <strong>{selectedProfessor.name}</strong> به عنوان استاد میزبان، 
                عملکرد پژوهشگر پسادکتری تحت نظارت خود را در ماه جاری تایید می‌کنم
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || !selectedProfessor || !selectedStudent || !approvalStatus} 
            className={styles.submitBtn}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                در حال ارسال...
              </>
            ) : (
              <>
                <span className={styles.icon}>✉️</span>
                ارسال فرم
              </>
            )}
          </button>

          {message && (
            <div className={`${styles.message} ${
              message.includes('✅') ? styles.success : styles.error
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfessorApprovalForm;

