import { useState, useEffect } from 'react';
import styles from './ProfessorApprovalForm.module.css';

// Mapping وضعیت/نوع قرارداد دانشجویان
const STUDENT_STATUS_MAP = {
  'رقیه مظفری': 'پسادکتری',
  'المیرا قاسمی داشکسن': 'دانشجو (پروپوزال مصوب)',
  'الميرا قاسمی': 'دانشجو (پروپوزال مصوب)', // نام قدیمی
  'محمد فتاحی': 'پسادکتری',
  'زهره صفرچراتی': 'پژوهشی',
  'زهره صفر چراتی': 'پژوهشی', // نام قدیمی
  'خشایار اسمعیل‌زاده': 'پژوهشی',
  'خشایار اسمعیل زاده': 'پژوهشی', // نام قدیمی
  'سارا مطیع بیرجندی': 'پژوهشی',
  'سارا مطیع': 'پژوهشی', // نام قدیمی
  'جواد خدادوست حور': 'پژوهشی',
  'جواد خدا دوست حور بیرجندی': 'پژوهشی', // نام قدیمی
  'مصطفی ایزدی': 'پژوهشی',
  'احسان رضایت': 'حق‌التحقیق',
  'احسان رضایت طالخونچه': 'حق‌التحقیق', // نام قدیمی
  'جلال‌الدین نوروزی طالخونچه': 'پژوهشی',
  'جلال الدین نوروزی': 'پژوهشی', // نام قدیمی
  'مهسا احمدی': 'پژوهشی',
  'مریم کریم بندرآبادی': 'پژوهشی',
  'مریم کریم بندر آبادی': 'پژوهشی', // نام قدیمی
  'فائزه شفیعی': 'دانشجو (پروپوزال مصوب)',
  'محیا مقیمی': 'دانشجو (پروپوزال مصوب)',
  'صبا شاهسوارانی': 'دانشجو (پروپوزال مصوب)',
  'محمدامین فرج‌زاده': 'پژوهشی',
  'محمد امین فرج زاده': 'پژوهشی', // نام قدیمی
  'نیکان امیرخانی': 'پژوهشی',
  'سپهر قبادی': 'دانشجو (دوره آموزشی)',
  'محمدمهدی ابوالقاسمی دهاقانی': 'دانشجو (دوره آموزشی)',
  'محمد مهدی ابوالقاسمی دهاقانی': 'دانشجو (دوره آموزشی)', // نام قدیمی
  'غزاله روشنی': 'دانشجو (دوره آموزشی)',
  'غزاله روشنی ابوالفتحی': 'دانشجو (دوره آموزشی)', // نام قدیمی
  'یاسمین ابوالفتحی': 'دانشجو (دوره آموزشی)',
  'ياسمين ابوالفتحی': 'دانشجو (دوره آموزشی)', // نام قدیمی
  'ندا افضلیان': 'پسادکتری',
  'سپیده فرمانی': 'پسادکتری',
  'محمدابراهیم کاتبی': 'پژوهشی',
  'محمد ابراهیم کاتبی': 'پژوهشی', // نام قدیمی
  'نسترن چکنی': 'دانشجو (پروپوزال مصوب)',
  'سعید داستانی': 'دانشجو (آمادگی امتحان جامع)',
  'مصطفی نیکنامی': 'دانشجو (آمادگی امتحان جامع)',
  'محمدعلی شهاب': 'انتخاب استاد راهنما',
  'محمد علی شهاب': 'انتخاب استاد راهنما', // نام قدیمی
  'پرهام زرگر بالای جمع': 'همکار طرح تحقیقاتی نخبگان - پرسنلی',
  'علی فتحی جوزدانی': 'پژوهشی',
  'زهراسادات وزیری': 'پژوهشی',
  'زهرا سادت وزیری': 'پژوهشی', // نام قدیمی
  'اشکان فرخی': 'پسادکتری',
  'محمد علیرمضانی': 'پسادکتری',
  'امیررضا اسدی': 'پژوهشی',
  'امیر رضا اسدی': 'پژوهشی', // نام قدیمی
  'فاطمه دانشور نودهی': 'دانشجوی دکتری',
  'فاطمه نودهی': 'دانشجوی دکتری', // نام قدیمی
  'محمد دانشور': 'دانشجوی دکتری', // نام قدیمی
  'پونه شبدینی': 'دانشجو (دوره آموزشی)',
  'الهام شمسی': 'پسادکتری',
  'فاطمه الهی': 'پسادکتری',
  'مهربد فرجی': 'پژوهشی',
  'سوده مجیدپور': 'پژوهشی',
  'سوده مجید پور': 'پژوهشی', // نام قدیمی
  'فاطمه مجدآبادی': 'دانشجوی دکتری',
  'فاطمه مجد آبادی': 'دانشجوی دکتری', // نام قدیمی
  'فاطمه فلاح': 'دانشجو (آمادگی دفاع از پروپوزال)',
  'امین خاتمی': 'دانشجوی دکتری',
  'میلاد محمدرضایی': 'دانشجو (پروپوزال مصوب)',
  'کریم رجایی': 'پسادکتری',
  'سیدمصطفی سجادی': 'همکار طرح تحقیقاتی نخبگان',
  'سید مصطفی سجادی': 'همکار طرح تحقیقاتی نخبگان', // نام قدیمی
  'محمدرضا صالحی نجف‌آبادی': 'پژوهشی',
  'محمدرضا صالحی نجف آبادی': 'پژوهشی', // نام قدیمی
  'الیاس ابراهیم‌زاده': 'پژوهشی',
  'الیاس ابراهیم زاده': 'پژوهشی', // نام قدیمی
  'رادمهر بهرامی': 'دانشجو (پروپوزال مصوب)',
  'حسن توکلی': 'پسادکتری',
  'محمد احمدخانلو': 'دانشجو (پروپوزال مصوب)',
  'محمد احمد خانلو': 'دانشجو (پروپوزال مصوب)', // نام قدیمی
};

// تابع کمکی برای دریافت وضعیت دانشجو
const getStudentStatus = (studentName) => {
  return STUDENT_STATUS_MAP[studentName] || '';
};

// داده‌های استادان، آزمایشگاه‌ها و دانشجویان
const PROFESSORS_DATA = [
  {
    id: 1,
    name: 'سعید سمنانیان',
    email: '',
    project: 'آزمایشگاه اعتیاد',
    students: ['الميرا قاسمی', 'رقیه مظفری']
  },
  {
    id: 2,
    name: 'محمدرضا رئوفی',
    email: '',
    project: 'آزمایشگاه پرندگان',
    students: ['خشایار اسمعیل زاده', 'زهره صفر چراتی', 'محمد فتاحی']
  },
  {
    id: 3,
    name: 'علی قاضی زاده',
    email: '',
    project: 'آزمایشگاه حافظه - یادگیری',
    students: ['جواد خدا دوست حور بیرجندی', 'سارا مطیع', 'مصطفی ایزدی']
  },
  {
    id: 4,
    name: 'محمدرضا ابوالقاسمی دهاقانی',
    email: '',
    project: 'آزمایشگاه محاسبات مغز',
    students: ['جلال الدین نوروزی', 'احسان رضایت طالخونچه', 'مریم کریم بندر آبادی', 'مهسا احمدی', 'فائزه شفیعی', 'محیا مقیمی', 'صبا شاهسوارانی']
  },
  {
    id: 5,
    name: 'مهدی صنایعی',
    email: '',
    project: 'آزمایشگاه تالاموس',
    students: ['محمد امین فرج زاده', 'نیکان امیرخانی', 'سپهر قبادی', 'محمد مهدی ابوالقاسمی دهاقانی', 'غزاله روشنی ابوالفتحی', 'ياسمين ابوالفتحی']
  },
  {
    id: 6,
    name: 'رضا راجی مهر',
    email: '',
    project: 'کارتوگرافی قشر مغز',
    students: ['ندا افضلیان', 'سپیده فرمانی', 'محمد ابراهیم کاتبی', 'نسترن چکنی', 'سعید داستانی', 'مصطفی نیکنامی', 'محمد علی شهاب', 'پرهام زرگر بالای جمع']
  },
  {
    id: 7,
    name: 'محمد علی صالحی نژاد',
    email: '',
    project: 'آزمایشگاه نورومادولیشن',
    students: ['زهرا سادت وزیری', 'علی فتحی جوزدانی']
  },
  {
    id: 8,
    name: 'محمدرضا دلیری',
    email: '',
    project: 'آزمایشگاه بینایی توجه',
    students: ['اشکان فرخی', 'محمد علیرمضانی', 'محمد دانشور', 'امیر رضا اسدی', 'فاطمه نودهی', 'پونه شبدینی']
  },
  {
    id: 9,
    name: 'رضا ابراهیم پور',
    email: '',
    project: 'آزمایشگاه بینایی محاسباتی-شناختی',
    students: ['الهام شمسی', 'فاطمه الهی', 'مهربد فرجی', 'سوده مجید پور', 'فاطمه مجد آبادی', 'فاطمه فلاح', 'امین خاتمی']
  },
  {
    id: 10,
    name: 'عبدالحسین محمدرضایی وهابی',
    email: '',
    project: 'یادگیری تصمیمات فردی و اجتماعی',
    students: ['میلاد محمدرضایی']
  },
  {
    id: 11,
    name: 'حمید سلطانیان زاده',
    email: '',
    project: 'تصویربرداری عصبی',
    students: ['کریم رجایی', 'سید مصطفی سجادی', 'محمدرضا صالحی نجف آبادی', 'الیاس ابراهیم زاده', 'رادمهر بهرامی']
  },
  {
    id: 12,
    name: 'غلامعلی حسین زاده دهکردی',
    email: '',
    project: 'تصویربرداری عصبی',
    students: ['حسن توکلی']
  },
  {
    id: 13,
    name: 'عباس نصیرایی مقدم',
    email: '',
    project: 'تصویربرداری عصبی',
    students: []
  },
  {
    id: 14,
    name: 'عطیه سرابی جماب',
    email: '',
    project: '',
    students: ['محمد احمد خانلو']
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

// تابع دریافت تاریخ کامل شمسی جاری
const getCurrentPersianDate = () => {
  const now = new Date();
  const gy = now.getFullYear();
  const gm = now.getMonth() + 1;
  const gd = now.getDate();
  
  const jalali = gregorianToJalali(gy, gm, gd);
  const monthName = PERSIAN_MONTHS[jalali.month - 1];
  
  return {
    day: jalali.day,
    month: monthName,
    year: jalali.year,
    fullDisplay: `${jalali.day} ${monthName} ${jalali.year}`,
    monthYear: `${monthName} - ${jalali.year}`
  };
};

const ProfessorApprovalForm = () => {
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [professorEmail, setProfessorEmail] = useState('');
  const [studentApprovals, setStudentApprovals] = useState({}); // { studentName: 'approved' | 'rejected' | null }
  const [currentDate, setCurrentDate] = useState(getCurrentPersianDate());
  const [description, setDescription] = useState('');
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
    setStudentApprovals({}); // ریست کردن وضعیت تایید دانشجویان هنگام تغییر استاد
    // تنظیم متن پیش‌فرض برای توضیحات
    if (professor) {
      setDescription(`اینجانب ${professor.name} به عنوان استاد میزبان، عملکرد پژوهشگر پسادکتری تحت نظارت خود را در ماه جاری تایید می‌کنم`);
    } else {
      setDescription('');
    }
  };

  const handleStudentApproval = (studentName, status) => {
    // Prevent rapid double-taps on mobile
    setStudentApprovals(prev => {
      // If already set to this status, don't change
      if (prev[studentName] === status) {
        return prev;
      }
      return {
        ...prev,
        [studentName]: status
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProfessor) {
      setMessage('❌ لطفاً استاد را انتخاب کنید');
      return;
    }

    // بررسی اینکه آیا همه دانشجویان وضعیت تایید دارند
    const allStudentsApproved = selectedProfessor.students.every(
      student => studentApprovals[student] === 'approved' || studentApprovals[student] === 'rejected'
    );

    if (!allStudentsApproved) {
      setMessage('❌ لطفاً وضعیت تایید را برای همه دانشجویان مشخص کنید');
      return;
    }

    setLoading(true);
    setMessage('');

    // ایجاد آرایه‌ای از داده‌های دانشجویان
    const studentsData = selectedProfessor.students.map(studentName => ({
      studentName: studentName,
      studentStatus: getStudentStatus(studentName),
      approvalStatus: studentApprovals[studentName]
    }));

    const formData = {
      professorName: selectedProfessor.name,
      professorEmail: professorEmail,
      projectTitle: selectedProfessor.project,
      students: studentsData,
      month: currentDate.month,
      year: currentDate.year,
      monthYear: currentDate.monthYear,
      description: description,
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
        // ریست کردن فرم بعد از ارسال موفق
        setStudentApprovals({});
        setDescription('');
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
        <div className={styles.headerSection}>
          <div className={styles.dateDisplay}>
            <span className={styles.dateIcon}>📅</span>
            <span className={styles.dateText}>{currentDate.fullDisplay}</span>
          </div>
          <div className={styles.headerText}>
            <h1 className={styles.title}>تایید کار ماهانه پژوهشگران</h1>
            <p className={styles.description}>
              لطفاً اطلاعات مورد نیاز را تکمیل کنید
            </p>
          </div>
        </div>
        
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

          {/* لیست دانشجویان */}
          {selectedProfessor && (
            <div className={styles.field}>
              <label>
                <span className={styles.icon}>👥</span>
                اسامی دانشجویان *
              </label>
              <div className={styles.studentsList}>
                {selectedProfessor.students.map((student, index) => {
                  const studentStatus = getStudentStatus(student);
                  return (
                    <div key={index} className={styles.studentItem}>
                      <div className={styles.studentInfo}>
                        <div className={styles.studentName}>{student}</div>
                        {studentStatus && (
                          <div className={styles.studentStatus}>{studentStatus}</div>
                        )}
                      </div>
                      <div className={styles.studentApprovalButtons}>
                        <button
                          type="button"
                          onClick={() => handleStudentApproval(student, 'approved')}
                          className={`${styles.studentApprovalBtn} ${styles.approveBtn} ${
                            studentApprovals[student] === 'approved' ? styles.active : ''
                          }`}
                        >
                          ✓ تایید
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStudentApproval(student, 'rejected')}
                          className={`${styles.studentApprovalBtn} ${styles.rejectBtn} ${
                            studentApprovals[student] === 'rejected' ? styles.active : ''
                          }`}
                        >
                          ✗ عدم تایید
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* توضیحات */}
          {selectedProfessor && (
            <div className={styles.field}>
              <label htmlFor="description">
                <span className={styles.icon}>📝</span>
                توضیحات
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات خود را وارد کنید..."
                className={styles.textarea}
                rows={4}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={
              loading || 
              !selectedProfessor || 
              !selectedProfessor.students.every(
                student => studentApprovals[student] === 'approved' || studentApprovals[student] === 'rejected'
              )
            } 
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

