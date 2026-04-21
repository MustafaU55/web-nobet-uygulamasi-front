// next-sitemap.config.js
module.exports = {
    siteUrl: 'https://nobetx.com/',
    generateRobotsTxt: true, // robots.txt de oluşturur
    exclude: ['/admin','/adduser','/forgot-password-change','/forgot-password-code','/forgot-password-email','/login','/manager','/manager/departman','manager/duty-calendar','/manager/shift','/manager/settings','/manager/duty-calendar','/manager/past-calendar','/payment','/register','/users'], // Hariç tutulacak sayfalar
  };