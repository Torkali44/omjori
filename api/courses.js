/** Shared course + Telegram group data */
const COURSE_DATA = {
  canva: {
    emoji: '🎨',
    title: 'دورة Canva الاحترافية',
    groups: [
      { name: 'قروب Canva للمبتدئات', url: 'https://t.me/+fX_5Mhf3BYljZjE8' },
      { name: 'قروب Canva للمحترفات', url: 'https://t.me/+9VOMCMKeIgk2OGJk' }
    ]
  },
  chatgpt: {
    emoji: '🤖',
    title: 'دورة الذكاء الاصطناعي و ChatGPT',
    groups: [
      { name: 'قروب دورة الذكاء الاصطناعي', url: 'https://t.me/+LtkNcQCduNljYWNk' }
    ]
  },
  pdf: {
    emoji: '💰',
    title: 'دورة بيع الملفات الرقمية',
    groups: [
      { name: 'قروب بيع الملفات الرقمية', url: 'https://t.me/+Gi-oWkMqg0NlODBk' }
    ]
  },
  ads: {
    emoji: '📢',
    title: 'دورة الإعلانات الممولة',
    groups: [
      { name: 'قروب كيف تنشئين إعلاناً ممولاً', url: 'https://t.me/+c_eUpf0OWcVjMGQ0' }
    ]
  },
  video: {
    emoji: '🎬',
    title: 'دورة تحريك الصورة إلى فيديو',
    groups: [
      { name: 'قروب تحريك الصور إلى فيديو', url: 'https://t.me/+tgc440_HRpNmMTk0' }
    ]
  },
  bundle: {
    emoji: '💎',
    title: 'الباقة الكاملة — جميع الدورات',
    groups: [
      { name: 'Canva للمبتدئات', url: 'https://t.me/+fX_5Mhf3BYljZjE8' },
      { name: 'Canva للمحترفات', url: 'https://t.me/+9VOMCMKeIgk2OGJk' },
      { name: 'الذكاء الاصطناعي', url: 'https://t.me/+LtkNcQCduNljYWNk' },
      { name: 'الملفات الرقمية', url: 'https://t.me/+Gi-oWkMqg0NlODBk' },
      { name: 'الإعلانات الممولة', url: 'https://t.me/+c_eUpf0OWcVjMGQ0' },
      { name: 'تحريك الصور', url: 'https://t.me/+tgc440_HRpNmMTk0' }
    ]
  }
};

const AMOUNT_TO_COURSE = {
  50000: 'canva',
  25000: 'chatgpt',
  29900: 'pdf',
  15000: 'ads',
  22000: 'video'
};

function resolveCourse(session) {
  const fromMeta = (session.metadata && session.metadata.course) || '';
  if (fromMeta && COURSE_DATA[fromMeta.toLowerCase()]) {
    return fromMeta.toLowerCase();
  }
  const amount = session.amount_total;
  if (amount != null && AMOUNT_TO_COURSE[amount]) {
    return AMOUNT_TO_COURSE[amount];
  }
  return null;
}

function buildEmailHtml(courseKey, data) {
  const links = data.groups.map(function (g) {
    return (
      '<tr><td style="padding:12px 0;border-bottom:1px solid #f0e6e8;">' +
      '<div style="font-weight:800;color:#2b2b2b;font-size:16px;margin-bottom:8px;">' + g.name + '</div>' +
      '<a href="' + g.url + '" style="display:inline-block;background:#229ED9;color:#fff;text-decoration:none;' +
      'font-weight:800;padding:12px 18px;border-radius:10px;font-size:15px;">انضمي إلى المجموعة على تيليجرام</a>' +
      '</td></tr>'
    );
  }).join('');

  return (
    '<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"></head>' +
    '<body style="margin:0;padding:0;background:#fff6f8;font-family:Tahoma,Arial,sans-serif;direction:rtl;">' +
    '<div style="max-width:560px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #f0e6e8;">' +
    '<div style="background:linear-gradient(135deg,#D6586A,#B43E50);color:#fff;padding:28px 24px;text-align:center;">' +
    '<div style="font-size:28px;margin-bottom:8px;">🎉</div>' +
    '<h1 style="margin:0;font-size:22px;">تم الدفع بنجاح</h1>' +
    '<p style="margin:8px 0 0;opacity:0.95;">مرحباً بكِ في أكاديمية أم جوري</p>' +
    '</div>' +
    '<div style="padding:24px;">' +
    '<div style="background:#FDF2F4;color:#B43E50;font-weight:800;text-align:center;padding:12px;border-radius:12px;margin-bottom:18px;font-size:16px;">' +
    data.emoji + ' ' + data.title + '</div>' +
    '<p style="color:#8a7c7f;font-size:15px;line-height:1.8;text-align:center;margin:0 0 20px;">' +
    'نشكر ثقتِك. للبدء في الدورة، انضمي إلى مجموعة تيليجرام عبر الأزرار التالية:' +
    '</p>' +
    '<table width="100%" cellpadding="0" cellspacing="0">' + links + '</table>' +
    '<p style="color:#8a7c7f;font-size:14px;line-height:1.8;text-align:center;margin:22px 0 0;">' +
    'لأي استفسار راسلينا على ' +
    '<a href="mailto:omjori.online@gmail.com" style="color:#D6586A;font-weight:700;">omjori.online@gmail.com</a>' +
    '</p></div></div>' +
    '<p style="text-align:center;color:#8a7c7f;font-size:13px;margin:16px;">فريق أم جوري | OMJORI</p>' +
    '</body></html>'
  );
}

module.exports = { COURSE_DATA, resolveCourse, buildEmailHtml };
