export const App_url = {
  image: {
    logo: "/assets/images/logo.png",
    home: "/assets/images/home.svg",
    expertise: "/assets/images/expertise.svg",
    building: "/assets/images/building.png",
    footer: "/assets/images/footer.svg",
    chat_logo: "/assets/images/chat.png",
    sign_up_image: "/assets/images/signup-image.jpg",
    email: "/assets/images/email.svg",
    
    // dev images
    profile :'/assets/images/dev/profile.png', 
    cds_marbella : '/assets/images/dev/cds-marbella-1.png',
    cds_malaga : '/assets/images/dev/cds-malanga.png',
    cds_fuengirola : '/assets/images/dev/cds-fuengirola.png',
    cds_Benalmádena : '/assets/images/dev/cds-Benalmádena.png',
    cds_Mijas : '/assets/images/dev/cds-Mijas.png',
    cds_Estepona : '/assets/images/dev/cds-Estepona.png',
    cds_Benahavís : '/assets/images/dev/cds-Benahavís.png',
    cds_Coín : '/assets/images/dev/cds-Coín.png',
    cds_Casares : '/assets/images/dev/cds-Casares.png',

    marbella: "/assets/images/dev/marbella.png",
    malaga: "/assets/images/dev/malaga.png",
    costa_del_sol: "/assets/images/dev/costa-del-sol.png",
    image_1: "/assets/images/dev/image-1.png",
    image_2: "/assets/images/dev/image-2.jpg",
    image_3: "/assets/images/dev/image-3.png",
    image_4: "/assets/images/dev/image-4.jpg",
    image_5: "/assets/images/dev/image-5.png",
    image_6: "/assets/images/dev/image-6.png",

    blog_image_1: "/assets/images/dev/blog-image-1.png",
    blog_image_2: "/assets/images/dev/blog-image-2.png",
    blog_image_3: "/assets/images/dev/blog-image-3.png",

    your_search: "/assets/images/dev/your-search-1.png",
  },
  link: {
    INITIAL_URL: "/",
    SIGN_IN: "/signin",
    SIGN_UP: "/signup",
    RESET_PASSWORD: "/reset-password",
    FORGET_PASSWORD: "/forget-password",
    OTP_VERIFICATION: "/otp-verification",
    PACKAGE : '/packages',
    ZECCO_FAVORITES : "/zecco-favorites",
    COSTA_DEL_SOL : '/costa-del-sol',
    PROPERTY_DETAILS : '/property'
  },
  endpoint_url: {
    USER_LOGIN: "/user-login",
    USER_SIGN_IN: "/sign_in",
    FORGET_PASSWORD: "/forget-password",
    RESET_PASSWORD: "/reset-password",
    FORGET_PASSWORD_VERIFY_OTP: "/forget-password",
    VERIFY_OTP: "/verify-otp",
    RESEND_OTP: "/resend-otp",
  },
  chat_bot_url: "http://localhost:5678/webhook/zecco",
  chat_bot_url_main: "https://n8n.appristine.co.in/webhook/zecco",
};

export const initialState = {
  items: [],
  totalCount: 0,
  optionList: [],
};

export const initialUserData = {
  status: "",
  user: {
    id: "",
    email: "",
    active: false,
    password: "",
    is_admin: false,
    role_permissions: "",
    api_permissions: "",
    name: "",
    emp_id: "",
    user_type: "",
    role: "",
  },
  access_token: "",
};
