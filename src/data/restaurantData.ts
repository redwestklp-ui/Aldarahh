import { 
  MenuItem, 
  Table, 
  Coupon,
  MenuCategory,
  ModifierGroup,
  DeliveryZone,
  StaffMember,
  RolePermissions,
  Customer,
  DiscountOffer,
  RestaurantSettings,
  AdminNotification
} from '../types/index.ts';
import storefrontImg from '../assets/images/shuaa_storefront_1790832706671.jpg';
import logoImg from '../assets/images/shuaa_logo_1790832718692.jpg';

export const RESTAURANT_INFO = {
  name: 'فوال وشعبيات شعاع الدره',
  tagline: 'أشهى المأكولات الشعبية، الفطور الصباحي، الشاورما، وطبخ سمك التنور الأصيل',
  phone: '+966562619597',
  displayPhone: '056 261 9597',
  whatsappNumber: '966562619597',
  whatsappUrl: 'https://wa.me/966562619597',
  phoneCallUrl: 'tel:+966562619597',
  
  // Real Storefront Photo of the Restaurant in Saudi Arabia
  restaurantPhoto: storefrontImg,
  restaurantLogo: logoImg,
  restaurantCover: storefrontImg,
  
  googleMapsUrl: 'https://www.google.com/maps/place/%D9%81%D9%88%D8%A7%D9%84+%D9%88%D8%B4%D8%B9%D8%A8%D9%8A%D8%A7%D8%AA+%D8%B4%D8%B9%D8%A7%D8%B9+%D8%A7%D9%84%D8%AF%D8%B1%D9%87%E2%80%AD/@23.9028804,42.9129885,17z',
  googleMapsDirectionsUrl: 'https://www.google.com/maps/search/?api=1&query=فوال+وشعبيات+شعاع+الدره+عفيف+السعودية',
  googleMapsReviewUrl: 'https://www.google.com/maps/place/%D9%81%D9%88%D8%A7%D9%84+%D9%88%D8%B4%D8%B9%D8%A8%D9%8A%D8%A7%D8%AA+%D8%B4%D8%B9%D8%A7%D8%B9+%D8%A7%D9%84%D8%AF%D8%B1%D9%87%E2%80%AD/@23.9028804,42.9129885,17z',
  
  address: 'طريق الملك عبدالعزيز، حي الملك فيصل، عفيف 17571، المملكة العربية السعودية',
  shortAddress: 'عفيف - طريق الملك عبدالعزيز',
  plusCode: 'WW37+55 Afif, Saudi Arabia',
  
  rating: 3.9,
  reviewsCount: 158,
  isOpen24Hours: true,
  hours: 'مفتوح 24 ساعة يومياً (طوال أيام الأسبوع)',
  
  // Delivery Rules
  minDeliveryAmount: 30, // SAR
  deliveryFee: 10, // SAR
  freeDeliveryThreshold: 85, // SAR
  deliveryCity: 'عفيف',
  deliveryDistricts: [
    'حي الملك فيصل',
    'حي الخالدية',
    'حي العزيزية',
    'حي النهضة',
    'حي الروضة',
    'حي الورود',
    'حي السليمانية',
    'حي الفيصلية',
  ],
};

export const MENU_CATEGORIES = [
  { id: 'all', name: 'جميع الأصناف' },
  { id: 'tannour_fish', name: '🐟 سمك تنور طازج' },
  { id: 'shaabiat', name: '🍳 فطور وشعبيات' },
  { id: 'shawarma_grills', name: '🌯 شاورما ومشويات' },
  { id: 'sides', name: '🍟 مقبلات وبطاطس' },
  { id: 'beverages', name: '☕ شاي ومشروبات' },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // 1. Tannour Fish Cooking
  {
    id: 'tannour-fish',
    name: 'سمك تنور طازج بالخلطة الحارة',
    category: 'tannour_fish',
    description: 'سمك كامل متبل ببهارات التنور الحجازية والتهامية ومطهو داخل فرن الطين الملتهب، يمنحك قشرة مقرمشة ولحماً طرياً غنياً بنكهة الشواء.',
    basePrice: 48,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isSpecialHighlight: true,
    tag: 'تخصص الفرع • الأكثر طلباً',
    options: [
      { id: 'size-m', name: 'حجم وسط (شخصين)', priceModifier: 0 },
      { id: 'size-l', name: 'حجم كبير (3-4 أشخاص)', priceModifier: 20 },
    ],
    addons: [
      { id: 'tamees-bread', name: 'خبز تميس إضافي ساخن', price: 2 },
      { id: 'spicy-tahini', name: 'طحينة حارة خاصة', price: 3 },
      { id: 'daqqoos', name: 'دقوس فلفل حار', price: 2 },
    ],
    removableIngredients: ['بدون فلفل حار', 'بدون كزبرة'],
  },
  // 2. Shawarma
  {
    id: 'shawarma-plate',
    name: 'شاورما دجاج على السيخ',
    category: 'shawarma_grills',
    description: 'شرائح شاورما محمصة على السيخ بتتبيلتنا الخاصة، تُقدم مع الثومية الغنية، البطاطس المقلية، والمخلل المقرمش في خبز الصاج الطازج.',
    basePrice: 12,
    image: 'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isSpecialHighlight: true,
    tag: 'الأكثر طلباً',
    options: [
      { id: 'sh-small', name: 'ساندويش صاج عادي', priceModifier: 0 },
      { id: 'sh-saroukh', name: 'ساندويش صاروخ كبير', priceModifier: 6 },
      { id: 'sh-plate', name: 'صحن عربي مع بطاطس وثومية', priceModifier: 13 },
    ],
    addons: [
      { id: 'extra-garlic', name: 'ثومية إضافية غنية', price: 2 },
      { id: 'extra-cheese', name: 'جبنة ذائبة', price: 3 },
      { id: 'sh-fries', name: 'بطاطس إضافية', price: 4 },
    ],
    removableIngredients: ['بدون مخلل', 'بدون ثومية', 'بدون بطاطس داخل الساندويش'],
  },
  // 3. Chicken Kebab
  {
    id: 'chicken-kebab',
    name: 'كباب دجاج مشوي على الفحم',
    category: 'shawarma_grills',
    description: 'أسياخ كباب دجاج مفروم طازج ومتبل بالأعشاب والبهارات الشرقية، مشوي على الفحم الساخن ويُقدم مع الخبز الطازج والمقبلات.',
    basePrice: 24,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isSpecialHighlight: true,
    tag: 'مشويات طازجة',
    options: [
      { id: 'kebab-plate', name: 'صحن 4 أسياخ مع خبز ومقبلات', priceModifier: 0 },
      { id: 'kebab-plate-6', name: 'صحن عائلي 6 أسياخ', priceModifier: 12 },
    ],
    addons: [
      { id: 'grilled-onions', name: 'بصل وطماطم مشوية', price: 2 },
      { id: 'tahini-dip', name: 'صحن طحينة فاخرة', price: 3 },
    ],
    removableIngredients: ['بدون بصل مشوي', 'بدون بقدونس'],
  },
  // 4. Traditional Foul
  {
    id: 'foul-mudammas',
    name: 'فول مدمس بالجرة بالزيت والكمون',
    category: 'shaabiat',
    description: 'فول مطبوخ على نار هادئة في الجرة التقليدية، مهروس ومتبل بالطحينة الفاخرة وزيت الزيتون والكمون والليمون مع خبز الفرن الساخن.',
    basePrice: 9,
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tag: 'فطور الصباح الأصيل',
    options: [
      { id: 'foul-olive-oil', name: 'بزيت الزيتون البكر', priceModifier: 0 },
      { id: 'foul-ghee', name: 'بالسمن البلدي الطبيعي', priceModifier: 2 },
    ],
    addons: [
      { id: 'extra-tamees', name: 'خبز تميس بسكوت ساخن', price: 2 },
      { id: 'liquid-cheese', name: 'إضافة جبن سائل على الوجه', price: 3 },
      { id: 'extra-tahini', name: 'طحينة إضافية', price: 2 },
    ],
    removableIngredients: ['بدون بصل وطماطم', 'بدون شطة'],
  },
  // 5. Shakshuka
  {
    id: 'shakshuka-traditional',
    name: 'شكشوكة عدنية بالجبن السائل',
    category: 'shaabiat',
    description: 'بيض طازج مطهو مع كشنة البصل والطماطم والفلفل الأخضر، مغطى بطبقة سخية من الجبن الذائب الشهي.',
    basePrice: 14,
    image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tag: 'فطور شعبي محبوب',
    options: [
      { id: 'shak-standard', name: 'طبق شكشوكة فردي', priceModifier: 0 },
      { id: 'shak-large', name: 'طبق شكشوكة كبير مزدوج', priceModifier: 7 },
    ],
    addons: [
      { id: 'extra-cheese-shak', name: 'دبل جبن سائل', price: 4 },
      { id: 'tamees-bread-2', name: 'خبز تميس ساخن', price: 2 },
    ],
    removableIngredients: ['بدون فلفل حار', 'بدون بصل'],
  },
  // 6. Fresh Kebdah
  {
    id: 'fresh-kebdah',
    name: 'كبدة بلدي طازجة بالصاج',
    category: 'shaabiat',
    description: 'كبدة غنم بلدي طازجة مقطعة ومحمرة على الصاج الملتهب مع شرائح البصل والفلفل الأخضر والطماطم والتوابل الشعبية.',
    basePrice: 22,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tag: 'صاج ساخن',
    options: [
      { id: 'kebdah-plate', name: 'صحن صاج ساخن مع خبز', priceModifier: 0 },
      { id: 'kebdah-cheese', name: 'صحن كبدة بالجبن السائل', priceModifier: 4 },
    ],
    addons: [
      { id: 'extra-lemon', name: 'ليمون وفلفل إضافي', price: 1 },
      { id: 'fresh-bread', name: 'خبز صاج إضافي', price: 2 },
    ],
    removableIngredients: ['بدون فلفل حار', 'بدون طماطم'],
  },
  // 7. French Fries
  {
    id: 'french-fries',
    name: 'بطاطس مقلية ذهبية مقرمشة',
    category: 'sides',
    description: 'أصابع بطاطس مقلية ذهبية مقرمشة من الخارج وطرية من الداخل، متبلة ببهاراتنا الخاصة وتُقدم ساخنة.',
    basePrice: 6,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tag: 'مقبلات ساخنة',
    options: [
      { id: 'fries-regular', name: 'حجم عادي', priceModifier: 0 },
      { id: 'fries-large', name: 'حجم كبير عائلي', priceModifier: 4 },
    ],
    addons: [
      { id: 'cheddar-sauce', name: 'صوص جبن شيدر ذائب', price: 3 },
      { id: 'garlic-dip', name: 'ثومية إضافية', price: 2 },
    ],
  },
  // 8. Coleslaw
  {
    id: 'coleslaw-salad',
    name: 'سلطة كول سلو طازجة',
    category: 'sides',
    description: 'ملفوف وجزر طازج مبشور مع دريسنج كريمي ناعم ومتوازن، إضافة منعشة ومثالية مع الشاورما والمشويات.',
    basePrice: 5,
    image: 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tag: 'سلطة طازجة',
  },
  // 9. Mint Tea
  {
    id: 'mint-tea',
    name: 'شاي أحمر بالنعناع الطازج',
    category: 'beverages',
    description: 'شاي أحمر مخدر وموزون على أصوله يروق الرأس، مطبوخ مع أوراق النعناع الطازجة العطرة بالسكر الموزون.',
    basePrice: 3,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tag: 'شاي مخدر ومضبوط',
    options: [
      { id: 'tea-cup', name: 'كوب فردي كبير', priceModifier: 0 },
      { id: 'tea-pot', name: 'براد شاي عائلي (4 أكواب)', priceModifier: 7 },
    ],
  },
  // 10. Adeni Karak Tea
  {
    id: 'adeni-tea',
    name: 'شاي عدني بالحليب والهيل والزعفران',
    category: 'beverages',
    description: 'شاي حليبي غني مطبوخ مع الهيل والقرنفل والحليب المركز ونفحة زعفران تدفئ القلب.',
    basePrice: 5,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tag: 'مشروب دافئ',
  },
];

// Initial Restaurant Tables (Tables 1 to 12) with verified secret PINs
export const INITIAL_TABLES: Table[] = [
  { id: 'tbl-1', tableNumber: 1, currentPin: '4821', status: 'available', activeOrderCount: 0, qrCodeUrl: '/table/1' },
  { id: 'tbl-2', tableNumber: 2, currentPin: '7392', status: 'available', activeOrderCount: 0, qrCodeUrl: '/table/2' },
  { id: 'tbl-3', tableNumber: 3, currentPin: '1945', status: 'available', activeOrderCount: 0, qrCodeUrl: '/table/3' },
  { id: 'tbl-4', tableNumber: 4, currentPin: '8204', status: 'available', activeOrderCount: 0, qrCodeUrl: '/table/4' },
  { id: 'tbl-5', tableNumber: 5, currentPin: '5163', status: 'available', activeOrderCount: 0, qrCodeUrl: '/table/5' },
  { id: 'tbl-6', tableNumber: 6, currentPin: '3079', status: 'available', activeOrderCount: 0, qrCodeUrl: '/table/6' },
  { id: 'tbl-7', tableNumber: 7, currentPin: '9428', status: 'available', activeOrderCount: 0, qrCodeUrl: '/table/7' },
  { id: 'tbl-8', tableNumber: 8, currentPin: '6152', status: 'available', activeOrderCount: 0, qrCodeUrl: '/table/8' },
  { id: 'tbl-9', tableNumber: 9, currentPin: '2847', status: 'available', activeOrderCount: 0, qrCodeUrl: '/table/9' },
  { id: 'tbl-10', tableNumber: 10, currentPin: '7531', status: 'available', activeOrderCount: 0, qrCodeUrl: '/table/10' },
  { id: 'tbl-11', tableNumber: 11, currentPin: '4196', status: 'available', activeOrderCount: 0, qrCodeUrl: '/table/11' },
  { id: 'tbl-12', tableNumber: 12, currentPin: '8620', status: 'available', activeOrderCount: 0, qrCodeUrl: '/table/12' },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'AFIF10',
    discountPercent: 10,
    minOrderAmount: 35,
    isActive: true,
    description: 'خصم 10% لأهالي عفيف على الطلبات فوق 35 ريال',
  },
  {
    code: 'SHUAA15',
    discountAmount: 15,
    minOrderAmount: 70,
    isActive: true,
    description: 'خصم 15 ريال على الطلبات العائلية فوق 70 ريال',
  },
];

export const REVIEWS_DATA = [
  {
    id: 'rev-1',
    author: 'أبو فهد العتيبي',
    rating: 5,
    date: 'قبل أسبوعين',
    comment: 'ما شاء الله تبارك الله، فطور شعبي ممتاز وخبز التنور حار وطازج. الشاورما والبطاطس ممتازة والخدمة سريعة في عفيف.',
    verifiedSource: 'تقييم على Google Maps',
  },
  {
    id: 'rev-2',
    author: 'سلطان الروقي',
    rating: 4,
    date: 'قبل شهر',
    comment: 'ميزتهم الكبيرة أنهم مفتوحين 24 ساعة، جربت سمك التنور والشاي بالنعناع وكان الطعم لذيذ والتتبيلة ممتازة ومضبوطة.',
    verifiedSource: 'تقييم على Google Maps',
  },
  {
    id: 'rev-3',
    author: 'محمد القحطاني',
    rating: 4,
    date: 'قبل شهرين',
    comment: 'كباب الدجاج لذيذ والشاورما نظيفة وخفيفة، موقعه ممتاز على طريق الملك عبدالعزيز ويسهل الوصول له ومواقف متوفرة.',
    verifiedSource: 'تقييم على Google Maps',
  },
  {
    id: 'rev-4',
    author: 'عبدالله الحربي',
    rating: 4,
    date: 'قبل 3 أشهر',
    comment: 'مطعم شعبي نظيف وأسعاره طيبة، الفول المدمس والشاي بالنعناع من أروع ما يكون في الصباح الباكر بعد صلاة الفجر.',
    verifiedSource: 'تقييم على Google Maps',
  },
];

export const SERVICES_LIST = [
  {
    id: 'dine-in',
    icon: 'UtensilsCrossed',
    title: 'جلسات داخل المطعم',
    desc: 'صالات مريحة ونظيفة لتناول وجبات الإفطار والغداء والعشاء مع إمكانية الطلب المباشر من طاولتك.',
    badge: 'طاولات عائلية وعزاب',
  },
  {
    id: 'takeaway',
    icon: 'ShoppingBag',
    title: 'استلام سريع (سفري)',
    desc: 'تجهيز فوري لطلبك مسبقاً لتستلمه ساخناً بالسيارة في دقائق بسيطة دون انتظار.',
    badge: 'تجهيز فوري',
  },
  {
    id: 'delivery',
    icon: 'Car',
    title: 'توصيل داخل عفيف',
    desc: 'نوصل طلباتك ساخنة وطازجة إلى باب بيتك أو مقر عملك في جميع أحياء محافظة عفيف.',
    badge: 'خدمة سريعة',
  },
  {
    id: '24-hours',
    icon: 'Clock',
    title: 'خدمة 24 ساعة',
    desc: 'أبوابنا مفتوحة ليلاً ونهاراً لتناول الفطور المبكر أو الغداء أو العشاء المتأخر في أي وقت.',
    badge: 'مفتوح الآن',
  },
];

export const INITIAL_CATEGORIES: MenuCategory[] = [
  { id: 'all', name: 'جميع الأصناف', description: 'كل الوجبات والأطباق المتوفرة', sortOrder: 1, isActive: true },
  { id: 'tannour_fish', name: '🐟 سمك تنور طازج', description: 'سمك طازج يطهى في أفران الطين الحارة', sortOrder: 2, isActive: true },
  { id: 'shaabiat', name: '🍳 فطور وشعبيات', description: 'أطباق الفول المدمس والشكشوكة والكبدة البلدي', sortOrder: 3, isActive: true },
  { id: 'shawarma_grills', name: '🌯 شاورما ومشويات', description: 'شاورما على السيخ وكباب دجاج مشوي', sortOrder: 4, isActive: true },
  { id: 'sides', name: '🍟 مقبلات وبطاطس', description: 'بطاطس مقرمشة، حمص، كولسلو ومقبلات', sortOrder: 5, isActive: true },
  { id: 'beverages', name: '☕ شاي ومشروبات', description: 'شاي عدني وشاي نعناع ومشروبات غازية باردة', sortOrder: 6, isActive: true },
];

export const INITIAL_MODIFIER_GROUPS: ModifierGroup[] = [
  {
    id: 'mod-size',
    name: 'الحجم وطريقة التقديم',
    minSelections: 1,
    maxSelections: 1,
    isRequired: true,
    options: [
      { id: 'opt-reg', name: 'عادي / شخص واحد', price: 0, isAvailable: true },
      { id: 'opt-large', name: 'حجم كبير / شخصين', price: 5, isAvailable: true },
      { id: 'opt-family', name: 'عائلي / 3-4 أشخاص', price: 15, isAvailable: true },
    ],
  },
  {
    id: 'mod-extras',
    name: 'الإضافات الشهية',
    minSelections: 0,
    maxSelections: 4,
    isRequired: false,
    options: [
      { id: 'opt-tamees', name: 'خبز تميس ساخن إضافي', price: 2, isAvailable: true },
      { id: 'opt-cheese', name: 'جبنة شيدر سائلة', price: 3, isAvailable: true },
      { id: 'opt-tahini', name: 'طحينة حارة خاصة', price: 2, isAvailable: true },
      { id: 'opt-garlic', name: 'ثومية إضافية', price: 2, isAvailable: true },
    ],
  },
  {
    id: 'mod-spice',
    name: 'مستوى الحرارة',
    minSelections: 0,
    maxSelections: 1,
    isRequired: false,
    options: [
      { id: 'opt-mild', name: 'بدون شطة (بارد)', price: 0, isAvailable: true },
      { id: 'opt-medium', name: 'حرارة معتدلة', price: 0, isAvailable: true },
      { id: 'opt-hot', name: 'حار جداً بالخلطة الحارة', price: 0, isAvailable: true },
    ],
  },
];

export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'zone-1', name: 'حي الملك فيصل (قريب من الفرع)', deliveryFee: 0, minOrder: 25, estimatedMinutes: 20, isActive: true },
  { id: 'zone-2', name: 'حي الخالدية', deliveryFee: 5, minOrder: 30, estimatedMinutes: 25, isActive: true },
  { id: 'zone-3', name: 'حي العزيزية', deliveryFee: 5, minOrder: 30, estimatedMinutes: 25, isActive: true },
  { id: 'zone-4', name: 'حي النهضة', deliveryFee: 8, minOrder: 35, estimatedMinutes: 30, isActive: true },
  { id: 'zone-5', name: 'حي الروضة', deliveryFee: 8, minOrder: 35, estimatedMinutes: 30, isActive: true },
  { id: 'zone-6', name: 'حي الورود', deliveryFee: 10, minOrder: 40, estimatedMinutes: 35, isActive: true },
  { id: 'zone-7', name: 'حي السليمانية', deliveryFee: 10, minOrder: 40, estimatedMinutes: 35, isActive: true },
  { id: 'zone-8', name: 'حي الفيصلية', deliveryFee: 10, minOrder: 40, estimatedMinutes: 35, isActive: true },
];

export const INITIAL_STAFF: StaffMember[] = [
  { id: 'staff-1', name: 'أبو فهد (المدير العام)', phone: '0562619597', role: 'manager', status: 'active', lastLogin: 'اليوم 09:30 ص' },
  { id: 'staff-2', name: 'محمد إبراهيم (مشرف الكاشير)', phone: '0561122334', role: 'cashier', status: 'active', lastLogin: 'اليوم 10:15 ص' },
  { id: 'staff-3', name: 'الشيف ناصر (مسؤول التنور)', phone: '0559988776', role: 'kitchen', status: 'active', lastLogin: 'أمس 04:00 م' },
  { id: 'staff-4', name: 'خالد العتيبي (كابتن الصالة)', phone: '0543322110', role: 'waiter', status: 'active', lastLogin: 'اليوم 11:00 ص' },
  { id: 'staff-5', name: 'سلطان الدوسري (سائق التوصيل)', phone: '0507766554', role: 'delivery', status: 'active', lastLogin: 'اليوم 08:00 ص' },
];

export const INITIAL_ROLES_PERMISSIONS: RolePermissions[] = [
  {
    role: 'manager',
    label: 'المدير العام (صلاحيات كاملة)',
    permissions: {
      orders: { view: true, edit: true, cancel: true },
      products: { view: true, edit: true, delete: true },
      categories: { view: true, edit: true, delete: true },
      discounts: { view: true, edit: true },
      tables: { view: true, edit: true, reset: true },
      settings: { view: true, edit: true },
      staff: { view: true, edit: true },
    },
  },
  {
    role: 'cashier',
    label: 'أمين الصندوق (الكاشير)',
    permissions: {
      orders: { view: true, edit: true, cancel: false },
      products: { view: true, edit: false, delete: false },
      categories: { view: true, edit: false, delete: false },
      discounts: { view: true, edit: false },
      tables: { view: true, edit: true, reset: true },
      settings: { view: false, edit: false },
      staff: { view: false, edit: false },
    },
  },
  {
    role: 'kitchen',
    label: 'طاقم المطبخ والتنور',
    permissions: {
      orders: { view: true, edit: true, cancel: false },
      products: { view: true, edit: false, delete: false },
      categories: { view: false, edit: false, delete: false },
      discounts: { view: false, edit: false },
      tables: { view: true, edit: false, reset: false },
      settings: { view: false, edit: false },
      staff: { view: false, edit: false },
    },
  },
  {
    role: 'waiter',
    label: 'كابتن الصالة والطاولات',
    permissions: {
      orders: { view: true, edit: true, cancel: false },
      products: { view: true, edit: false, delete: false },
      categories: { view: false, edit: false, delete: false },
      discounts: { view: false, edit: false },
      tables: { view: true, edit: true, reset: true },
      settings: { view: false, edit: false },
      staff: { view: false, edit: false },
    },
  },
  {
    role: 'delivery',
    label: 'مندوب التوصيل',
    permissions: {
      orders: { view: true, edit: true, cancel: false },
      products: { view: false, edit: false, delete: false },
      categories: { view: false, edit: false, delete: false },
      discounts: { view: false, edit: false },
      tables: { view: false, edit: false, reset: false },
      settings: { view: false, edit: false },
      staff: { view: false, edit: false },
    },
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'cust-1', name: 'أحمد السبيعي', phone: '0551234567', ordersCount: 8, totalSpent: 420, lastOrderDate: '2026-09-30', status: 'active', notes: 'عميل دائم لسمك التنور' },
  { id: 'cust-2', name: 'سعد العتيبي', phone: '0569876543', ordersCount: 5, totalSpent: 260, lastOrderDate: '2026-09-29', status: 'active', notes: 'يفضل التوصيل لحي الملك فيصل' },
  { id: 'cust-3', name: 'فيصل الغامدي', phone: '0543322119', ordersCount: 3, totalSpent: 145, lastOrderDate: '2026-09-28', status: 'active' },
  { id: 'cust-4', name: 'محمد الروقي', phone: '0501122334', ordersCount: 12, totalSpent: 690, lastOrderDate: '2026-09-30', status: 'active', notes: 'طلب صالة أسبوعي' },
];

export const INITIAL_DISCOUNT_OFFERS: DiscountOffer[] = [
  {
    id: 'disc-lunch',
    title: 'عرض الغداء الشعبي (خصم 15%)',
    type: 'percentage',
    value: 15,
    targetType: 'category',
    targetIds: ['shawarma_grills', 'shaabiat'],
    minOrderAmount: 40,
    maxDiscount: 25,
    isActive: true,
    isStackable: false,
  },
  {
    id: 'disc-fish',
    title: 'خصم خاص 10 ر.س على سمك التنور',
    type: 'fixed',
    value: 10,
    targetType: 'product',
    targetIds: ['tannour-fish'],
    minOrderAmount: 48,
    isActive: true,
    isStackable: true,
  },
];

export const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'طلب جديد وارد',
    message: 'تم استلام طلب جديد #1048 من داخل الصالة (طاولة 4)',
    type: 'order',
    timestamp: 'منذ دقيقتين',
    isRead: false,
    linkToTab: 'orders',
  },
  {
    id: 'notif-2',
    title: 'تنبيه توفر صنف',
    message: 'صنف سمك تنور بالخلطة الحارة تم تفعيله للتو بعد انتهاء التجهيز',
    type: 'warning',
    timestamp: 'منذ 25 دقيقة',
    isRead: false,
    linkToTab: 'products',
  },
  {
    id: 'notif-3',
    title: 'إشعار النظام',
    message: 'النظام يعمل بشكل ممتاز، تم ربط جميع الطاولات برمز QR بنجاح',
    type: 'system',
    timestamp: 'منذ ساعتين',
    isRead: true,
  },
];

export const INITIAL_RESTAURANT_SETTINGS: RestaurantSettings = {
  isRestaurantOpen: true,
  emergencyPauseOrders: false,
  emergencyMessage: 'نعتذر منكم، الطلبات متوقفة مؤقتاً لضغط العمل الشديد، وسنعاود الاستقبال قريباً.',
  orderChannels: {
    dineIn: true,
    takeaway: true,
    delivery: true,
  },
  paymentMethods: {
    cash: true,
    cardOnDelivery: true,
    onlineCard: true,
  },
  businessHours: {
    sunday: { open: '00:00', close: '23:59', isOpen: true },
    monday: { open: '00:00', close: '23:59', isOpen: true },
    tuesday: { open: '00:00', close: '23:59', isOpen: true },
    wednesday: { open: '00:00', close: '23:59', isOpen: true },
    thursday: { open: '00:00', close: '23:59', isOpen: true },
    friday: { open: '00:00', close: '23:59', isOpen: true },
    saturday: { open: '00:00', close: '23:59', isOpen: true },
  },
  soundNotifications: true,
  name: RESTAURANT_INFO.name,
  tagline: RESTAURANT_INFO.tagline,
  phone: RESTAURANT_INFO.phone,
  displayPhone: RESTAURANT_INFO.displayPhone,
  whatsappNumber: RESTAURANT_INFO.whatsappNumber,
  address: RESTAURANT_INFO.address,
};


