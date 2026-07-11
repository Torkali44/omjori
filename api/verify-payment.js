/** روابط التيليجرام — تُرسل فقط بعد التحقق من Stripe */
const COURSE_DATA = {
  canva: {
    emoji: '🎨',
    title: 'دورة Canva الاحترافية',
    subtitle: 'انضمي لقروبي المبتدئات والمحترفات',
    groups: [
      { name: 'قروب Canva للمبتدئات', desc: 'محتوى مناسب للبداية من الصفر', url: 'https://t.me/+fX_5Mhf3BYljZjE8' },
      { name: 'قروب Canva للمحترفات', desc: 'محتوى متقدم وتطبيقات احترافية', url: 'https://t.me/+9VOMCMKeIgk2OGJk' }
    ]
  },
  chatgpt: {
    emoji: '🤖',
    title: 'دورة الذكاء الاصطناعي و ChatGPT',
    subtitle: 'انضمي لمجموعة الدورة على تيليجرام',
    groups: [
      { name: 'قروب دورة الذكاء الاصطناعي', desc: 'جميع دروس ChatGPT والذكاء الاصطناعي', url: 'https://t.me/+LtkNcQCduNljYWNk' }
    ]
  },
  pdf: {
    emoji: '💰',
    title: 'دورة بيع الملفات الرقمية',
    subtitle: 'انضمي لمجموعة الدورة على تيليجرام',
    groups: [
      { name: 'قروب بيع الملفات الرقمية', desc: 'دورة بيع ملفات رقمية مع موقع خاص بك', url: 'https://t.me/+Gi-oWkMqg0NlODBk' }
    ]
  },
  ads: {
    emoji: '📢',
    title: 'دورة الإعلانات الممولة',
    subtitle: 'انضمي لمجموعة الدورة على تيليجرام',
    groups: [
      { name: 'قروب كيف تنشئين إعلاناً ممولاً', desc: 'دورة إنشاء إعلان ممول خاص بتجارتك', url: 'https://t.me/+c_eUpf0OWcVjMGQ0' }
    ]
  },
  video: {
    emoji: '🎬',
    title: 'دورة تحريك الصورة إلى فيديو',
    subtitle: 'انضمي لمجموعة الدورة على تيليجرام',
    groups: [
      { name: 'قروب تحريك الصور إلى فيديو', desc: 'دورة كيف تحركين الصورة إلى فيديو متحرك', url: 'https://t.me/+tgc440_HRpNmMTk0' }
    ]
  },
  bundle: {
    emoji: '💎',
    title: 'الباقة الكاملة — جميع الدورات',
    subtitle: 'انضمي لجميع مجموعات الدورات',
    isBundle: true,
    sections: [
      { courseTitle: '🎨 دورة Canva', groups: [
        { name: 'Canva للمبتدئات', url: 'https://t.me/+fX_5Mhf3BYljZjE8' },
        { name: 'Canva للمحترفات', url: 'https://t.me/+9VOMCMKeIgk2OGJk' }
      ]},
      { courseTitle: '🤖 دورة الذكاء الاصطناعي', groups: [
        { name: 'قروب الذكاء الاصطناعي', url: 'https://t.me/+LtkNcQCduNljYWNk' }
      ]},
      { courseTitle: '💰 دورة الملفات الرقمية', groups: [
        { name: 'قروب الملفات الرقمية', url: 'https://t.me/+Gi-oWkMqg0NlODBk' }
      ]},
      { courseTitle: '📢 دورة الإعلانات الممولة', groups: [
        { name: 'قروب الإعلانات الممولة', url: 'https://t.me/+c_eUpf0OWcVjMGQ0' }
      ]},
      { courseTitle: '🎬 دورة تحريك الصور', groups: [
        { name: 'قروب تحريك الصور', url: 'https://t.me/+tgc440_HRpNmMTk0' }
      ]}
    ]
  }
};

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const sessionId = req.query.session_id;
  const course = (req.query.course || '').toLowerCase().trim();

  if (!sessionId || typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
    return res.status(400).json({ ok: false, error: 'missing_session' });
  }

  if (!COURSE_DATA[course]) {
    return res.status(400).json({ ok: false, error: 'unknown_course' });
  }

  const data = COURSE_DATA[course];
  return res.status(200).json({ ok: true, course, ...data });
};
