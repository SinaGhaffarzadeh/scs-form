import { useState, useRef } from 'react';
import styles from './ContactForm.module.css';

const ContactForm = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = {
      from_name: form.current.from_name.value,
      user_email: form.current.user_email.value,
      phone: form.current.phone.value || '',
      message: form.current.message.value,
    };

    try {
      // ارسال به Netlify Function
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ فرم با موفقیت ارسال شد! ایمیل تاییدیه برای شما ارسال شد.');
        form.current.reset();
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
        <h1 className={styles.title}>فرم تماس با ما</h1>
        <p className={styles.description}>
          لطفاً اطلاعات خود را وارد کنید. ما در اسرع وقت با شما تماس خواهیم گرفت.
        </p>
        
        <form ref={form} onSubmit={sendEmail} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="from_name">
              <span className={styles.icon}>👤</span>
              نام و نام خانوادگی *
            </label>
            <input
              type="text"
              id="from_name"
              name="from_name"
              required
              placeholder="نام خود را وارد کنید"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="user_email">
              <span className={styles.icon}>📧</span>
              ایمیل *
            </label>
            <input
              type="email"
              id="user_email"
              name="user_email"
              required
              placeholder="example@email.com"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="phone">
              <span className={styles.icon}>📱</span>
              شماره تماس
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="09123456789"
              className={styles.input}
              pattern="[0-9]{11}"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="message">
              <span className={styles.icon}>💬</span>
              پیام *
            </label>
            <textarea
              id="message"
              name="message"
              rows="6"
              required
              placeholder="پیام یا توضیحات خود را بنویسید..."
              className={styles.textarea}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
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

export default ContactForm;

