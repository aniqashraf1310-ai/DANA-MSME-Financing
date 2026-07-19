import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  TrendingUp, 
  PlusCircle, 
  Bell, 
  CreditCard, 
  Search, 
  SlidersHorizontal, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Coins, 
  ShieldAlert, 
  ListFilter,
  ArrowRight,
  Upload,
  User,
  Settings,
  Mail,
  DollarSign,
  AlertCircle,
  Database,
  ArrowUpRight,
  Building,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  UserPlus,
  Activity,
  Cpu,
  RefreshCw,
  Sliders
} from 'lucide-react';

// Default loan products published by financial institutions
const INITIAL_LOAN_PRODUCTS = [
  {
    id: 'prod-1',
    institution: 'SME Bank Malaysia',
    name: 'DANA Business Expansion Scheme',
    minAmount: 10000,
    maxAmount: 100000,
    interestRate: 3.5,
    tenureMonths: 24,
    minRevenue: 15000,
    minAgeYears: 2,
    requirements: 'SSM Certificate, 6 months bank statement, IC copy',
    description: 'Special scheme designed for local micro-enterprises looking to expand operations or upgrade equipment.'
  },
  {
    id: 'prod-2',
    institution: 'Maybank Islamic',
    name: 'SME Clean Financing-i',
    minAmount: 50000,
    maxAmount: 250000,
    interestRate: 4.2,
    tenureMonths: 36,
    minRevenue: 30000,
    minAgeYears: 3,
    requirements: 'SSM, 2 years Audited Accounts, Corporate Guarantee',
    description: 'Shariah-compliant collateral-free financing designed to assist small-to-medium business working capital requirements.'
  },
  {
    id: 'prod-3',
    institution: 'Bank Rakyat',
    name: 'Biz-SME Micro Financing',
    minAmount: 5000,
    maxAmount: 50000,
    interestRate: 2.9,
    tenureMonths: 12,
    minRevenue: 5000,
    minAgeYears: 1,
    requirements: 'SSM Certificate, 3 months bank statement',
    description: 'Fast approval scheme aimed at micro-startups and retail vendors seeking immediate operational liquidity.'
  },
  {
    id: 'prod-4',
    institution: 'MARA',
    name: 'SPIKE Enterprise Financing',
    minAmount: 10000,
    maxAmount: 150000,
    interestRate: 2.0,
    tenureMonths: 48,
    minRevenue: 10000,
    minAgeYears: 2,
    requirements: 'SSM, Bumiputera Status verification, Project Paperwork',
    description: 'Low-interest funding program exclusively supporting Bumiputera entrepreneurs and technical contractors.'
  }
];

// Seed Applications for testing right away
const INITIAL_APPLICATIONS = [
  {
    id: 'APP-809',
    applicantName: 'Danish Hakim',
    companyName: 'AeroTech Solutions Sdn Bhd',
    industry: 'Technology',
    revenue: 45000,
    ageYears: 4,
    requestedAmount: 120000,
    purpose: 'Procurement of advanced Cloud server infrastructure.',
    status: 'Bidding Open', // Draft, Submitted, Bidding Open, Offers Received, Approved, Repaying, Completed, Rejected
    documents: [
      { name: 'SSM_Registration.pdf', size: '1.2 MB', status: 'Verified' },
      { name: 'BankStatement_6Months.pdf', size: '4.8 MB', status: 'Verified' }
    ],
    timestamp: '2026-07-10 10:30 AM',
  },
  {
    id: 'APP-304',
    applicantName: 'Aniq Ashraf',
    companyName: 'Petronas Vendor Group',
    industry: 'Engineering & Energy',
    revenue: 85000,
    ageYears: 5,
    requestedAmount: 200000,
    purpose: 'Machinery acquisition for petrochemical logistics contract.',
    status: 'Repaying',
    documents: [
      { name: 'SSM_Registration.pdf', size: '1.5 MB', status: 'Verified' },
      { name: 'Audited_Accounts_2025.pdf', size: '6.2 MB', status: 'Verified' }
    ],
    timestamp: '2026-06-15 02:15 PM',
    activeLoan: {
      institution: 'Maybank Islamic',
      amount: 200000,
      interestRate: 4.0,
      tenure: 36,
      monthlyRepayment: 5880,
      paidMonths: 1,
      totalPaid: 5880,
      remainingBalance: 194120
    }
  }
];

const INITIAL_OFFERS = [
  {
    id: 'OFF-101',
    applicationId: 'APP-809',
    institution: 'SME Bank Malaysia',
    amount: 100000,
    interestRate: 3.4,
    tenure: 24,
    specialConditions: 'Requires monthly automated direct debit integration.',
    status: 'Pending' // Pending, Accepted, Rejected
  },
  {
    id: 'OFF-102',
    applicationId: 'APP-809',
    institution: 'Maybank Islamic',
    amount: 120000,
    interestRate: 4.0,
    tenure: 36,
    specialConditions: 'Subject to quarterly audit reviews.',
    status: 'Pending'
  }
];

// Seed Users for local login database
const INITIAL_USER_ACCOUNTS = [
  {
    username: 'danish',
    password: 'password123',
    role: 'Applicant',
    profile: {
      username: 'Danish Hakim',
      company: 'AeroTech Solutions Sdn Bhd',
      email: 'danish@aerotech.my',
      industry: 'Technology',
      revenue: 45000,
      ageYears: 4,
      phone: '+6012-3456789'
    }
  },
  {
    username: 'aniq',
    password: 'password123',
    role: 'Loan Officer',
    profile: {
      username: 'Aniq Ashraf (Maybank)',
      institution: 'Maybank Islamic',
      email: 'aniq.ashraf@maybank.com.my',
      department: 'Corporate SME Credit Risk Division'
    }
  },
  {
    username: 'admin',
    password: 'password123',
    role: 'Administrator',
    profile: {
      username: 'System Administrator (ESD Portal)',
      email: 'helmi.rais@utp.edu.my',
      level: 'Super Admin'
    }
  }
];

export default function App() {
  // Platform global data
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [loanProducts, setLoanProducts] = useState(INITIAL_LOAN_PRODUCTS);
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [systemLogs, setSystemLogs] = useState([
    { id: 1, userId: 'SYS', role: 'System', action: 'DANA Platform initialized securely', timestamp: '2026-07-15 08:00 AM', ip: '127.0.0.1' },
    { id: 2, userId: 'Admin', role: 'Administrator', action: 'Fetched active financial products on DANA', timestamp: '2026-07-15 08:30 AM', ip: '192.168.1.1' },
    { id: 3, userId: 'Danish', role: 'Applicant', action: 'Updated business eligibility profile on DANA', timestamp: '2026-07-15 09:12 AM', ip: '202.185.34.8' }
  ]);
  const [sentEmails, setSentEmails] = useState([
    { id: 1, recipient: 'danish@aerotech.my', subject: 'Application Status Updated on DANA: Bidding Open', body: 'Dear Danish, your application APP-809 is approved for bidding on DANA. Banks are now reviewing.', timestamp: '2026-07-10 10:35 AM' }
  ]);

  // Auth & Roles
  const [userAccounts, setUserAccounts] = useState(INITIAL_USER_ACCOUNTS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [currentRole, setCurrentRole] = useState('Applicant'); // 'Applicant', 'Loan Officer', 'Administrator'
  const [currentUser, setCurrentUser] = useState(null);

  // Auth form states
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  // Register form states
  const [registerForm, setRegisterForm] = useState({
    username: '', password: '', confirmPassword: '', fullName: '', companyName: '', email: '', phone: '', industry: 'Technology', revenue: '', ageYears: ''
  });

  // Dedicated visual validation error store
  const [formErrors, setFormErrors] = useState({
    register: {},
    apply: {},
    product: {},
    bid: {},
    payment: {}
  });

  // UI Navigation states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [notificationCount, setNotificationCount] = useState(2);
  const [showNotifications, setShowNotifications] = useState(false);

  // Market Filters
  const [marketTenureFilter, setMarketTenureFilter] = useState('All'); // 'All', 'Short', 'Medium', 'Long'
  const [marketRateFilter, setMarketRateFilter] = useState('All'); // 'All', 'Low', 'High'

  // Admin Log Filters
  const [logRoleFilter, setLogRoleFilter] = useState('All'); // 'All', 'System', 'Applicant', 'Officer', 'Admin'
  const [logSearchQuery, setLogSearchQuery] = useState('');

  // Modal systems
  const [activeApplicationForBidding, setActiveApplicationForBidding] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('fpx'); // 'fpx' or 'card'
  const [selectedFpxBank, setSelectedFpxBank] = useState('maybank2u');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
  
  // Custom states for new entries
  const [newProductForm, setNewProductForm] = useState({
    name: '', minAmount: '', maxAmount: '', interestRate: '', tenureMonths: '', minRevenue: '', minAgeYears: '', requirements: '', description: ''
  });
  const [newBidForm, setNewBidForm] = useState({
    amount: '', interestRate: '', tenure: '', conditions: ''
  });
  const [newApplicationForm, setNewApplicationForm] = useState({
    requestedAmount: 50000, purpose: '', ssmVerified: false, bankStmtUploaded: false
  });

  // API Call simulation and log trackers
  const [apiLogs, setApiLogs] = useState([
    { id: 1, type: 'SMTP_DISPATCH', method: 'POST', endpoint: '/v1/send-email', status: 200, latency: '124ms', payload: '{"to":"danish@aerotech.my","template":"welcome_mail"}' },
    { id: 2, type: 'SSM_VERIFY', method: 'GET', endpoint: '/v2/ssm/918491-A', status: 200, latency: '342ms', payload: '{"status":"ACTIVE","entity_type":"SDN_BHD"}' }
  ]);

  // Real-time AI Credit Evaluator State
  const [isEvaluatingAi, setIsEvaluatingAi] = useState(false);
  const [aiEvaluationReport, setAiEvaluationReport] = useState(null);

  // Platform dynamic revenue accumulator from payment fees
  const [accumulatedPlatformFees, setAccumulatedPlatformFees] = useState(117.60);

  // Intercept and sanitize inputs to allow only clean numbers/floats
  const handleNumericInput = (val, formKey, fieldKey, isFloat = false) => {
    // Strip non-numeric items (allow single dot for floats)
    let cleanVal = isFloat 
      ? val.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
      : val.replace(/[^0-9]/g, '');

    // Reset targeted validation errors dynamically when user corrects typing
    setFormErrors(prev => ({
      ...prev,
      [formKey]: { ...prev[formKey], [fieldKey]: '' }
    }));

    if (formKey === 'register') {
      setRegisterForm(prev => ({ ...prev, [fieldKey]: cleanVal }));
    } else if (formKey === 'apply') {
      setNewApplicationForm(prev => ({ ...prev, [fieldKey]: cleanVal }));
    } else if (formKey === 'product') {
      setNewProductForm(prev => ({ ...prev, [fieldKey]: cleanVal }));
    } else if (formKey === 'bid') {
      setNewBidForm(prev => ({ ...prev, [fieldKey]: cleanVal }));
    }
  };

  // Safe phone keyboard sanitizer (+, digits, spaces, hyphens)
  const handlePhoneInput = (val) => {
    const cleanVal = val.replace(/[^0-9+\s-]/g, '');
    setFormErrors(prev => ({ ...prev, register: { ...prev.register, phone: '' } }));
    setRegisterForm(prev => ({ ...prev, phone: cleanVal }));
  };

  // Smart Stripe card input helpers
  const handleCardNumberInput = (val) => {
    let raw = val.replace(/[^0-9]/g, '');
    if (raw.length > 16) raw = raw.slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setFormErrors(prev => ({ ...prev, payment: { ...prev.payment, number: '' } }));
    setCardDetails(prev => ({ ...prev, number: formatted }));
  };

  const handleCardExpiryInput = (val) => {
    let raw = val.replace(/[^0-9]/g, '');
    if (raw.length > 4) raw = raw.slice(0, 4);
    let formatted = raw;
    if (raw.length >= 3) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setFormErrors(prev => ({ ...prev, payment: { ...prev.payment, expiry: '' } }));
    setCardDetails(prev => ({ ...prev, expiry: formatted }));
  };

  const handleCardCvcInput = (val) => {
    const raw = val.replace(/[^0-9]/g, '');
    if (raw.length <= 4) {
      setFormErrors(prev => ({ ...prev, payment: { ...prev.payment, cvc: '' } }));
      setCardDetails(prev => ({ ...prev, cvc: raw }));
    }
  };

  const addApiLog = (type, method, endpoint, status, latency, payload) => {
    const newApiLog = {
      id: Date.now(),
      type,
      method,
      endpoint,
      status,
      latency,
      payload
    };
    setApiLogs(prev => [newApiLog, ...prev]);
  };

  const addLog = (action, roleOverride = null, userOverride = null) => {
    const activeUsername = userOverride || (currentUser ? currentUser.username.split(' ')[0] : 'Visitor');
    const activeRole = roleOverride || currentRole;
    const newLog = {
      id: Date.now(),
      userId: activeUsername,
      role: activeRole,
      action: action,
      timestamp: new Date().toLocaleString(),
      ip: `192.168.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`
    };
    setSystemLogs(prev => [newLog, ...prev]);
  };

  const sendEmailNotification = (recipient, subject, body) => {
    const newEmail = {
      id: Date.now(),
      recipient,
      subject,
      body,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSentEmails(prev => [newEmail, ...prev]);

    // Dispatch external API Simulation logs
    addApiLog(
      'SMTP_DISPATCH',
      'POST',
      '/v1/send-email',
      200,
      '143ms',
      JSON.stringify({ recipient, subject, charLength: body.length, priority: 'HIGH' })
    );
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    
    const account = userAccounts.find(
      u => u.username.toLowerCase() === loginForm.username.toLowerCase() && u.password === loginForm.password
    );

    if (account) {
      setCurrentRole(account.role);
      setCurrentUser(account.profile);
      setIsAuthenticated(true);
      
      if (account.role === 'Applicant') {
        setActiveTab('dashboard');
      } else if (account.role === 'Loan Officer') {
        setActiveTab('review');
      } else if (account.role === 'Administrator') {
        setActiveTab('adminDashboard');
      }

      addLog('Logged in successfully', account.role, account.profile.username);
      setLoginForm({ username: '', password: '' });
    } else {
      setAuthError('Incorrect credentials. Please utilize the quick selection profiles below!');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');
    
    // Clear old errors
    const errors = {};

    if (registerForm.username.length < 3) {
      errors.username = 'Username must contain at least 3 characters.';
    }
    if (registerForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    if (userAccounts.some(u => u.username.toLowerCase() === registerForm.username.toLowerCase())) {
      errors.username = 'This username is already occupied.';
    }
    
    // Validating email address structure
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerForm.email)) {
      errors.email = 'Please provide a valid email format.';
    }

    // Checking digits/requirements on revenue and age
    const revenueNum = Number(registerForm.revenue);
    if (isNaN(revenueNum) || revenueNum <= 0) {
      errors.revenue = 'Monthly revenue must be a valid positive number.';
    }
    
    const ageNum = Number(registerForm.ageYears);
    if (isNaN(ageNum) || ageNum <= 0) {
      errors.ageYears = 'Business operational age must be a valid positive year integer.';
    }

    if (registerForm.phone.replace(/[^0-9]/g, '').length < 8) {
      errors.phone = 'Phone number must contain at least 8 digits.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(prev => ({ ...prev, register: errors }));
      setAuthError('Please fix the errors highlighted in red below.');
      return;
    }

    const newAccount = {
      username: registerForm.username.toLowerCase(),
      password: registerForm.password,
      role: 'Applicant',
      profile: {
        username: registerForm.fullName,
        company: registerForm.companyName,
        email: registerForm.email,
        industry: registerForm.industry,
        revenue: revenueNum,
        ageYears: ageNum,
        phone: registerForm.phone
      }
    };

    setUserAccounts(prev => [...prev, newAccount]);
    setAuthSuccessMsg('Registration successful! Access your account using the log in panel.');
    setAuthMode('login');
    
    addLog(`Registered new Applicant profile: ${registerForm.fullName} (${registerForm.companyName})`, 'Applicant', registerForm.username);
    
    sendEmailNotification(
      registerForm.email,
      'Welcome to DANA Digital MSME Financing Platform',
      `Dear ${registerForm.fullName}, your registration was verified. Use our advanced dashboard to check matching bank products and start capital requests.`
    );

    setRegisterForm({
      username: '', password: '', confirmPassword: '', fullName: '', companyName: '', email: '', phone: '', industry: 'Technology', revenue: '', ageYears: ''
    });
    setFormErrors(prev => ({ ...prev, register: {} }));
  };

  const handleLogout = () => {
    addLog('Logged out of active dashboard session');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginForm({ username: '', password: '' });
    setAuthError('');
    setAuthSuccessMsg('');
  };

  const handleQuickLogin = (username, password) => {
    setLoginForm({ username, password });
    setAuthError('');
    const account = userAccounts.find(u => u.username === username && u.password === password);
    if (account) {
      setCurrentRole(account.role);
      setCurrentUser(account.profile);
      setIsAuthenticated(true);
      if (account.role === 'Applicant') {
        setActiveTab('dashboard');
      } else if (account.role === 'Loan Officer') {
        setActiveTab('review');
      } else if (account.role === 'Administrator') {
        setActiveTab('adminDashboard');
      }
      addLog('Logged in successfully via quick sandbox access', account.role, account.profile.username);
    }
  };

  // Tiered transaction fee calculator
  const calculatePlatformFee = (amount) => {
    if (amount <= 1000) return { percent: 1, fee: amount * 0.01 };
    if (amount <= 5000) return { percent: 2, fee: amount * 0.02 };
    return { percent: 3, fee: amount * 0.03 };
  };

  const runAiRiskAssessment = (appId) => {
    const targetApp = applications.find(a => a.id === appId);
    if (!targetApp) return;

    setIsEvaluatingAi(true);
    setAiEvaluationReport(null);

    // Dynamic external API payload logs
    addApiLog(
      'GEMINI_AI_REASONING',
      'POST',
      '/v3/gemini/generate:grounded-credit-risk',
      200,
      'Initiating model execution...',
      JSON.stringify({
        model: 'gemini-3-flash-preview',
        search_grounding: true,
        context: {
          industry: targetApp.industry,
          revenue_myr: targetApp.revenue,
          registered_age_yrs: targetApp.ageYears,
          requested_capital: targetApp.requestedAmount
        }
      })
    );

    setTimeout(() => {
      // Formulate a dynamic analytical response resembling high-quality LLM grounding output
      const score = Math.min(100, Math.max(10, Math.round(95 - (targetApp.requestedAmount / targetApp.revenue) * 5)));
      const riskGrade = score >= 80 ? 'Minimal Risk (Tier 1)' : score >= 55 ? 'Moderate Operational Risk (Tier 2)' : 'High Capital Risk (Tier 3)';
      const evaluation = {
        score,
        riskGrade,
        industryInsights: `Sourcing latest Malaysian macro trends for the ${targetApp.industry} sector. SME registry records trace adequate operations duration (${targetApp.ageYears} years). Current monthly gross liquidity of RM ${targetApp.revenue.toLocaleString()} comfortably services the requested RM ${targetApp.requestedAmount.toLocaleString()} loan under prevailing central bank schedules.`,
        suggestedTerms: `Recommended interest rate range: 3.2% - 4.2% p.a. over a maximum safe amortized tenure of ${targetApp.ageYears > 3 ? '36' : '12'} months.`,
        groundingSources: [
          { title: "Bank Negara Malaysia Annual Financial Outlook 2026", url: "https://www.bnm.gov.my" },
          { title: "SME Corp Malaysia MSME Performance Directory", url: "https://smecorp.gov.my" }
        ]
      };

      setAiEvaluationReport(evaluation);
      setIsEvaluatingAi(false);

      addApiLog(
        'GEMINI_AI_REASONING',
        'POST',
        '/v3/gemini/generate:grounded-credit-risk',
        200,
        '1380ms',
        JSON.stringify({ status: 'completed', score, recommendedRate: '3.5%' })
      );

      addLog(`Triggered Gemini AI Credit Risk Assessment for application: ${appId}`);
    }, 1800);
  };

  const getSmartMatchingScore = (product, applicantProfile) => {
    if (!applicantProfile) return { percentage: 0, reasons: [], grade: 'No Active Session' };
    
    let score = 100;
    let reasons = [];

    const reqAmount = Number(newApplicationForm.requestedAmount) || 0;

    if (applicantProfile.revenue < product.minRevenue) {
      score -= 40;
      reasons.push(`Revenue (RM ${applicantProfile.revenue}/mo) is below minimum required RM ${product.minRevenue}/mo.`);
    } else {
      reasons.push(`Exceeds revenue requirements (+RM ${applicantProfile.revenue - product.minRevenue}/mo).`);
    }

    if (applicantProfile.ageYears < product.minAgeYears) {
      score -= 30;
      reasons.push(`Business established only ${applicantProfile.ageYears} years. Product requires min ${product.minAgeYears} years.`);
    } else {
      reasons.push(`Meets operational age requirement (${applicantProfile.ageYears} years in business).`);
    }

    if (reqAmount < product.minAmount || reqAmount > product.maxAmount) {
      score -= 20;
      reasons.push(`Requested amount RM ${reqAmount} lies outside allowed span [RM ${product.minAmount} - RM ${product.maxAmount}].`);
    }

    return {
      percentage: Math.max(0, score),
      reasons,
      grade: score >= 80 ? 'Highly Suitable' : score >= 50 ? 'Moderate Fit' : 'High Risk Profile'
    };
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    
    const errors = {};
    const amountVal = Number(newApplicationForm.requestedAmount);

    if (isNaN(amountVal) || amountVal <= 0) {
      errors.requestedAmount = 'Requested funding capital must be a positive number.';
    } else if (amountVal < 1000) {
      errors.requestedAmount = 'Minimum allowable funding request is RM 1,000.';
    }

    if (!newApplicationForm.purpose || newApplicationForm.purpose.trim().length < 15) {
      errors.purpose = 'Please provide a detailed purpose statement (minimum 15 characters).';
    }

    if (!newApplicationForm.ssmVerified || !newApplicationForm.bankStmtUploaded) {
      errors.documents = 'Please confirm both documentation checklist items are attached to submit.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(prev => ({ ...prev, apply: errors }));
      return;
    }

    const appCode = `APP-${Math.floor(100 + Math.random() * 900)}`;
    const newAppObj = {
      id: appCode,
      applicantName: currentUser.username,
      companyName: currentUser.company,
      industry: currentUser.industry,
      revenue: currentUser.revenue,
      ageYears: currentUser.ageYears,
      requestedAmount: amountVal,
      purpose: newApplicationForm.purpose,
      status: 'Bidding Open',
      documents: [
        { name: 'SSM_Registration.pdf', size: '1.2 MB', status: 'Verified' },
        { name: 'BankStatement_6Months.pdf', size: '4.8 MB', status: 'Verified' }
      ],
      timestamp: new Date().toLocaleString()
    };

    setApplications(prev => [newAppObj, ...prev]);
    addLog(`Submitted dynamic financing application request for RM ${amountVal} (${appCode}) via DANA`);
    
    sendEmailNotification(
      currentUser.email,
      'Financing Request Dispatched on DANA',
      `Dear ${currentUser.username}, your application ${appCode} for RM ${amountVal} was sent. Check updates under the bank bidding console.`
    );

    setNewApplicationForm({ requestedAmount: 50000, purpose: '', ssmVerified: false, bankStmtUploaded: false });
    setFormErrors(prev => ({ ...prev, apply: {} }));
    setActiveTab('applications');
  };

  const handlePublishProduct = (e) => {
    e.preventDefault();

    const errors = {};
    const minAmt = Number(newProductForm.minAmount);
    const maxAmt = Number(newProductForm.maxAmount);
    const rate = Number(newProductForm.interestRate);
    const tenure = Number(newProductForm.tenureMonths);
    const minRev = Number(newProductForm.minRevenue);
    const minAge = Number(newProductForm.minAgeYears);

    if (isNaN(minAmt) || minAmt <= 0) errors.minAmount = 'Must be a positive value.';
    if (isNaN(maxAmt) || maxAmt <= 0) {
      errors.maxAmount = 'Must be a positive value.';
    } else if (maxAmt <= minAmt) {
      errors.maxAmount = 'Maximum limit must be strictly greater than minimum amount.';
    }

    if (isNaN(rate) || rate <= 0 || rate > 30) {
      errors.interestRate = 'Rate must be a logical positive percentage (e.g., 0.1 to 30%).';
    }

    if (isNaN(tenure) || tenure <= 0 || tenure > 120) {
      errors.tenureMonths = 'Tenure must be between 1 and 120 months.';
    }

    if (isNaN(minRev) || minRev < 0) errors.minRevenue = 'Must be zero or positive.';
    if (isNaN(minAge) || minAge < 0) errors.minAgeYears = 'Must be zero or positive.';

    if (!newProductForm.name || newProductForm.name.trim().length < 5) {
      errors.name = 'Product Title must contain at least 5 characters.';
    }

    if (!newProductForm.requirements || newProductForm.requirements.trim().length < 5) {
      errors.requirements = 'Requirements list must not be empty.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(prev => ({ ...prev, product: errors }));
      return;
    }

    const newProd = {
      id: `prod-${Date.now()}`,
      institution: currentUser.institution || 'Maybank Islamic',
      name: newProductForm.name,
      minAmount: minAmt,
      maxAmount: maxAmt,
      interestRate: rate,
      tenureMonths: tenure,
      minRevenue: minRev,
      minAgeYears: minAge,
      requirements: newProductForm.requirements,
      description: newProductForm.description
    };

    setLoanProducts(prev => [...prev, newProd]);
    addLog(`Published new financial product: "${newProductForm.name}" on DANA`);
    setNewProductForm({ name: '', minAmount: '', maxAmount: '', interestRate: '', tenureMonths: '', minRevenue: '', minAgeYears: '', requirements: '', description: '' });
    setFormErrors(prev => ({ ...prev, product: {} }));
    setActiveTab('products');
  };

  const handlePlaceBid = (e) => {
    e.preventDefault();
    if (!activeApplicationForBidding) return;

    const errors = {};
    const bidAmt = Number(newBidForm.amount);
    const bidRate = Number(newBidForm.interestRate);
    const bidTenure = Number(newBidForm.tenure);

    if (isNaN(bidAmt) || bidAmt <= 0) {
      errors.amount = 'Offered amount must be a valid positive number.';
    } else if (bidAmt > activeApplicationForBidding.requestedAmount * 1.5) {
      errors.amount = `Offered amount is too high (maximum RM ${(activeApplicationForBidding.requestedAmount * 1.5).toLocaleString()} allowed).`;
    }

    if (isNaN(bidRate) || bidRate <= 0 || bidRate > 30) {
      errors.interestRate = 'Rate must be between 0.1% and 30%.';
    }

    if (isNaN(bidTenure) || bidTenure <= 0 || bidTenure > 120) {
      errors.tenure = 'Tenure must be between 1 and 120 months.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(prev => ({ ...prev, bid: errors }));
      return;
    }

    const newOffer = {
      id: `OFF-${Math.floor(100 + Math.random() * 900)}`,
      applicationId: activeApplicationForBidding.id,
      institution: currentUser.institution || 'Maybank Islamic',
      amount: bidAmt,
      interestRate: bidRate,
      tenure: bidTenure,
      specialConditions: newBidForm.conditions || 'None stated.',
      status: 'Pending'
    };

    setOffers(prev => [...prev, newOffer]);
    
    setApplications(prev => prev.map(app => {
      if (app.id === activeApplicationForBidding.id) {
        return { ...app, status: 'Offers Received' };
      }
      return app;
    }));

    addLog(`Loan Officer placed dynamic DANA financing offer bid for app: ${activeApplicationForBidding.id}`);
    
    const applicantEmail = activeApplicationForBidding.applicantName === 'Danish Hakim' ? 'danish@aerotech.my' : 'client@sme.com.my';
    sendEmailNotification(
      applicantEmail,
      `New DANA Financing Offer from ${currentUser.institution}`,
      `Tailored DANA financing offer submitted for your business for RM ${bidAmt} @ ${bidRate}% interest rate.`
    );

    setActiveApplicationForBidding(null);
    setNewBidForm({ amount: '', interestRate: '', tenure: '', conditions: '' });
    setFormErrors(prev => ({ ...prev, bid: {} }));
    setActiveTab('review');
  };

  const handleSelectOffer = (offerId, appId) => {
    const selectedOffer = offers.find(o => o.id === offerId);
    if (!selectedOffer) return;

    setOffers(prev => prev.map(o => {
      if (o.id === offerId) return { ...o, status: 'Accepted' };
      if (o.applicationId === appId) return { ...o, status: 'Rejected' };
      return o;
    }));

    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'Repaying',
          activeLoan: {
            institution: selectedOffer.institution,
            amount: selectedOffer.amount,
            interestRate: selectedOffer.interestRate,
            tenure: selectedOffer.tenure,
            monthlyRepayment: Math.round((selectedOffer.amount + (selectedOffer.amount * (selectedOffer.interestRate / 100))) / selectedOffer.tenure),
            paidMonths: 0,
            totalPaid: 0,
            remainingBalance: selectedOffer.amount
          }
        };
      }
      return app;
    }));

    addLog(`Applicant authorized DANA contract offer ${offerId} from ${selectedOffer.institution}`);
    sendEmailNotification(
      'operations@maybank.com.my',
      'DANA Financing Offer Accepted by Applicant',
      `MSME Danish Hakim accepted your offer bid of RM ${selectedOffer.amount}.`
    );
  };

  const handlePayBalanceInit = (loan, appIndex) => {
    const feeObj = calculatePlatformFee(loan.monthlyRepayment);
    setPaymentData({
      loan,
      appIndex,
      feePercent: feeObj.percent,
      feeAmount: feeObj.fee,
      totalToPay: loan.monthlyRepayment + feeObj.fee
    });
    setPaymentSuccess(false);
    setCardDetails({ number: '', expiry: '', cvc: '' });
    setFormErrors(prev => ({ ...prev, payment: {} }));
    setShowPaymentModal(true);
  };

  const handleProcessPayment = () => {
    const errors = {};

    if (paymentMethod === 'card') {
      const cleanNum = cardDetails.number.replace(/\s/g, '');
      if (cleanNum.length !== 16) {
        errors.number = 'Please enter a valid 16-digit card number.';
      }

      const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
      if (!expiryRegex.test(cardDetails.expiry)) {
        errors.expiry = 'Use standard MM/YY format.';
      }

      if (cardDetails.cvc.length < 3 || cardDetails.cvc.length > 4) {
        errors.cvc = 'CVC must be 3 or 4 digits.';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(prev => ({ ...prev, payment: errors }));
        return;
      }
    }

    setIsProcessingPayment(true);
    
    // Construct interactive API request intent
    const networkEndpoint = paymentMethod === 'fpx' ? '/v2/charge/fpx_initiate' : '/v3/stripe/payment_intent';
    const payloadBody = paymentMethod === 'fpx' 
      ? { amount: paymentData.totalToPay, bank: selectedFpxBank, appIndex: paymentData.appIndex }
      : { amount: paymentData.totalToPay, cardCvc: cardDetails.cvc, appIndex: paymentData.appIndex };

    addApiLog(
      'PAYMENT_INTENT',
      'POST',
      networkEndpoint,
      200,
      'Initiating connection...',
      JSON.stringify(payloadBody)
    );

    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      
      setApplications(prev => prev.map((app, index) => {
        if (index === paymentData.appIndex && app.activeLoan) {
          const updatedPaidMonths = app.activeLoan.paidMonths + 1;
          const updatedTotalPaid = app.activeLoan.totalPaid + app.activeLoan.monthlyRepayment;
          const updatedRemaining = Math.max(0, app.activeLoan.remainingBalance - app.activeLoan.monthlyRepayment);
          return {
            ...app,
            status: updatedRemaining === 0 ? 'Completed' : 'Repaying',
            activeLoan: {
              ...app.activeLoan,
              paidMonths: updatedPaidMonths,
              totalPaid: updatedTotalPaid,
              remainingBalance: updatedRemaining
            }
          };
        }
        return app;
      }));

      setAccumulatedPlatformFees(prev => prev + paymentData.feeAmount);

      // Log highly detailed response payload metadata
      addApiLog(
        'PAYMENT_INTENT',
        'POST',
        networkEndpoint,
        200,
        '342ms',
        JSON.stringify({
          status: "succeeded",
          charge_token: `ch_${Math.random().toString(36).substr(2, 9)}`,
          cleared_amount: paymentData.totalToPay,
          fpx_bank: paymentMethod === 'fpx' ? selectedFpxBank : null,
          timestamp: new Date().toISOString()
        })
      );

      addLog(`Processed DANA repayment installment of RM ${paymentData.loan.monthlyRepayment} with platform service fee RM ${paymentData.feeAmount.toFixed(2)}`);
      sendEmailNotification(
        currentUser.email,
        'DANA Repayment Transaction Receipt Successful',
        `Monthly installment of RM ${paymentData.loan.monthlyRepayment} cleared successfully. DANA Platform fee: RM ${paymentData.feeAmount.toFixed(2)}.`
      );
    }, 1800);
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  const filteredProducts = useMemo(() => {
    return loanProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.institution.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTenure = marketTenureFilter === 'All' || 
        (marketTenureFilter === 'Short' && p.tenureMonths <= 12) ||
        (marketTenureFilter === 'Medium' && p.tenureMonths > 12 && p.tenureMonths <= 36) ||
        (marketTenureFilter === 'Long' && p.tenureMonths > 36);

      const matchesRate = marketRateFilter === 'All' ||
        (marketRateFilter === 'Low' && p.interestRate <= 3.0) ||
        (marketRateFilter === 'High' && p.interestRate > 3.0);

      return matchesSearch && matchesTenure && matchesRate;
    });
  }, [loanProducts, searchQuery, marketTenureFilter, marketRateFilter]);

  const filteredSystemLogs = useMemo(() => {
    return systemLogs.filter(log => {
      const matchesRole = logRoleFilter === 'All' || log.role.toLowerCase() === logRoleFilter.toLowerCase();
      const matchesSearch = log.action.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                            log.userId.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                            log.ip.toLowerCase().includes(logSearchQuery.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [systemLogs, logRoleFilter, logSearchQuery]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-900">
      
      {/* ======================================= */}
      {/* AUTHENTICATION SCREEN: LOGIN / REGISTER */}
      {/* ======================================= */}
      {!isAuthenticated ? (
        <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
          
          {/* Left branding panel */}
          <div className="lg:w-1/2 bg-slate-950 flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_50%)]" />
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2.5 rounded-xl text-slate-950 shadow-lg shadow-amber-500/20">
                <Coins className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
                  DANA
                </span>
                <p className="text-[10px] uppercase font-bold tracking-wider text-amber-500">MSME Digital Financing System</p>
              </div>
            </div>

            <div className="my-auto py-12 relative z-10 space-y-6 max-w-lg">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Empowering Malaysian MSMEs with Tailored <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Financial Liquidity</span>
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                DANA coordinates digital credit assessments, matches SME profiles with commercial banking schedules, and automates competitive bidding workflows. 
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <span className="text-amber-400 font-extrabold block text-lg">Smart Match</span>
                  <p className="text-xs text-slate-500 mt-1">Instant scoring matching criteria with SSM database rules.</p>
                </div>
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <span className="text-amber-400 font-extrabold block text-lg">Platform Fees</span>
                  <p className="text-xs text-slate-500 mt-1">Tiered processing service rates matching repayment sizes.</p>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 relative z-10 border-t border-slate-900 pt-6">
              <p>TEB3323: Enterprise System Development Project Presentation Sandbox.</p>
            </div>
          </div>

          {/* Right auth panel */}
          <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-900 relative">
            <div className="max-w-md w-full bg-slate-950 p-8 rounded-3xl border border-slate-800/80 shadow-2xl relative">
              
              {/* Error & Success Messages */}
              {authError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}
              {authSuccessMsg && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{authSuccessMsg}</span>
                </div>
              )}

              {/* LOGIN MODE */}
              {authMode === 'login' ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">System Access Authorization</h2>
                    <p className="text-xs text-slate-400 mt-1">Access secure banking, credit profiles, and audit registers.</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">Username</label>
                      <input 
                        type="text" required
                        value={loginForm.username}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 placeholder-slate-600"
                        placeholder="Enter username"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} required
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 placeholder-slate-600"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3 text-slate-500 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
                    >
                      Authenticate Session
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-400">
                      New Applicant?{' '}
                      <button 
                        onClick={() => { setAuthMode('register'); setAuthError(''); setFormErrors(prev => ({ ...prev, register: {} })); }}
                        className="text-amber-400 hover:underline font-bold"
                      >
                        Register Profile Here
                      </button>
                    </p>
                  </div>

                  {/* QUICK DEMO CREDENTIAL SELECTOR */}
                  <div className="pt-6 border-t border-slate-900 space-y-3">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Quick-Select Sandbox Accounts</span>
                    <div className="grid grid-cols-1 gap-2">
                      <button 
                        onClick={() => handleQuickLogin('danish', 'password123')}
                        className="w-full flex items-center justify-between p-3 bg-slate-900/40 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 rounded-xl text-left transition-all"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">Danish Hakim (Approved)</p>
                          <span className="text-[10px] text-slate-500">Applicant (AeroTech Sdn Bhd)</span>
                        </div>
                        <span className="text-[10px] text-amber-400 font-bold font-mono">danish / password123</span>
                      </button>

                      <button 
                        onClick={() => handleQuickLogin('aniq', 'password123')}
                        className="w-full flex items-center justify-between p-3 bg-slate-900/40 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 rounded-xl text-left transition-all"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">Aniq Ashraf (Approved)</p>
                          <span className="text-[10px] text-slate-500">Loan Officer (Maybank Islamic)</span>
                        </div>
                        <span className="text-[10px] text-amber-400 font-bold font-mono">aniq / password123</span>
                      </button>

                      <button 
                        onClick={() => handleQuickLogin('admin', 'password123')}
                        className="w-full flex items-center justify-between p-3 bg-slate-900/40 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 rounded-xl text-left transition-all"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">Platform Admin (Approved)</p>
                          <span className="text-[10px] text-slate-500">System Monitoring & Logs</span>
                        </div>
                        <span className="text-[10px] text-amber-400 font-bold font-mono">admin / password123</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* REGISTRATION MODE */
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-white">Register MSME Applicant Profile</h2>
                    <p className="text-xs text-slate-400 mt-1">Create your secure gateway account and register enterprise details.</p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                    
                    {/* Account Basics */}
                    <div className="border-b border-slate-900 pb-3 space-y-3">
                      <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider block">1. Authentication Setup</span>
                      
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Username</label>
                        <input 
                          type="text" required
                          value={registerForm.username}
                          onChange={(e) => {
                            const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                            setFormErrors(prev => ({ ...prev, register: { ...prev.register, username: '' } }));
                            setRegisterForm(prev => ({ ...prev, username: val }));
                          }}
                          className={`w-full px-3 py-2 bg-slate-900 border ${formErrors.register.username ? 'border-red-500' : 'border-slate-800'} rounded-xl text-xs text-white focus:outline-none`}
                          placeholder="e.g. helmirais"
                        />
                        {formErrors.register.username && <p className="text-[10px] text-red-400 mt-1">{formErrors.register.username}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Password</label>
                          <input 
                            type="password" required
                            value={registerForm.password}
                            onChange={(e) => {
                              setFormErrors(prev => ({ ...prev, register: { ...prev.register, password: '' } }));
                              setRegisterForm(prev => ({ ...prev, password: e.target.value }));
                            }}
                            className={`w-full px-3 py-2 bg-slate-900 border ${formErrors.register.password ? 'border-red-500' : 'border-slate-800'} rounded-xl text-xs text-white focus:outline-none`}
                            placeholder="Min 6 chars"
                          />
                          {formErrors.register.password && <p className="text-[10px] text-red-400 mt-1">{formErrors.register.password}</p>}
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Confirm Password</label>
                          <input 
                            type="password" required
                            value={registerForm.confirmPassword}
                            onChange={(e) => {
                              setFormErrors(prev => ({ ...prev, register: { ...prev.register, confirmPassword: '' } }));
                              setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }));
                            }}
                            className={`w-full px-3 py-2 bg-slate-900 border ${formErrors.register.confirmPassword ? 'border-red-500' : 'border-slate-800'} rounded-xl text-xs text-white focus:outline-none`}
                            placeholder="Re-enter password"
                          />
                          {formErrors.register.confirmPassword && <p className="text-[10px] text-red-400 mt-1">{formErrors.register.confirmPassword}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Personal & Company Profile */}
                    <div className="space-y-3">
                      <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider block">2. Enterprise Details</span>
                      
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Contact Full Name</label>
                        <input 
                          type="text" required
                          value={registerForm.fullName}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                          placeholder="e.g. Dr Helmi Rais"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Corporate Entity</label>
                          <input 
                            type="text" required
                            value={registerForm.companyName}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, companyName: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                            placeholder="e.g. UTP Tech Sdn Bhd"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Industry Sector</label>
                          <select 
                            value={registerForm.industry}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, industry: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                          >
                            <option value="Technology">Technology</option>
                            <option value="Engineering & Energy">Engineering & Energy</option>
                            <option value="Retail & Commerce">Retail & Commerce</option>
                            <option value="Agribusiness">Agribusiness</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Phone</label>
                          <input 
                            type="text" required
                            value={registerForm.phone}
                            onChange={(e) => handlePhoneInput(e.target.value)}
                            className={`w-full px-3 py-2 bg-slate-900 border ${formErrors.register.phone ? 'border-red-500' : 'border-slate-800'} rounded-xl text-xs text-white`}
                            placeholder="+6012-XXXXXXX"
                          />
                          {formErrors.register.phone && <p className="text-[10px] text-red-400 mt-1">{formErrors.register.phone}</p>}
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Email</label>
                          <input 
                            type="email" required
                            value={registerForm.email}
                            onChange={(e) => {
                              setFormErrors(prev => ({ ...prev, register: { ...prev.register, email: '' } }));
                              setRegisterForm(prev => ({ ...prev, email: e.target.value }));
                            }}
                            className={`w-full px-3 py-2 bg-slate-900 border ${formErrors.register.email ? 'border-red-500' : 'border-slate-800'} rounded-xl text-xs text-white`}
                            placeholder="helmi@utp.edu.my"
                          />
                          {formErrors.register.email && <p className="text-[10px] text-red-400 mt-1">{formErrors.register.email}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1 font-mono text-amber-400">Avg. Monthly Revenue (RM)</label>
                          <input 
                            type="text" required
                            value={registerForm.revenue}
                            onChange={(e) => handleNumericInput(e.target.value, 'register', 'revenue')}
                            className={`w-full px-3 py-2 bg-slate-950 font-bold border ${formErrors.register.revenue ? 'border-red-500' : 'border-slate-800'} rounded-xl text-xs text-amber-400`}
                            placeholder="e.g. 55000"
                          />
                          {formErrors.register.revenue && <p className="text-[10px] text-red-400 mt-1">{formErrors.register.revenue}</p>}
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1 font-mono text-amber-400">Business Age (Years)</label>
                          <input 
                            type="text" required
                            value={registerForm.ageYears}
                            onChange={(e) => handleNumericInput(e.target.value, 'register', 'ageYears')}
                            className={`w-full px-3 py-2 bg-slate-950 font-bold border ${formErrors.register.ageYears ? 'border-red-500' : 'border-slate-800'} rounded-xl text-xs text-amber-400`}
                            placeholder="e.g. 3"
                          />
                          {formErrors.register.ageYears && <p className="text-[10px] text-red-400 mt-1">{formErrors.register.ageYears}</p>}
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
                    >
                      Complete Registration
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-400">
                      Already have an account?{' '}
                      <button 
                        onClick={() => { setAuthMode('login'); setAuthError(''); setFormErrors(prev => ({ ...prev, register: {} })); }}
                        className="text-amber-400 hover:underline font-bold"
                      >
                        Login Here
                      </button>
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      ) : (
        /* ======================================= */
        /* AUTHENTICATED SYSTEM PORTAL             */
        /* ======================================= */
        <>
          {/* DEVELOPER TESTING SANDBOX HEADER CONTROLLER */}
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-4 py-2 flex flex-wrap gap-3 justify-between items-center text-sm font-semibold shadow-md z-50">
            <div className="flex items-center gap-2">
              <span className="bg-slate-900 text-amber-400 text-xs px-2 py-0.5 rounded-full font-mono uppercase tracking-wider font-extrabold">Active Session Sandbox</span>
              <span>Logged in as: <strong>{currentUser.username}</strong> ({currentRole})</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-900 italic font-bold">Use actual Logout to swap profiles professionally!</span>
              <button 
                onClick={handleLogout}
                className="bg-slate-950 text-amber-400 hover:bg-slate-900 text-xs px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* PRIMARY HEADER */}
          <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
              
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2.5 rounded-xl text-slate-950 shadow-lg shadow-amber-500/20">
                  <Coins className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
                      DANA
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">MSME Marketplace</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Digital Financing & Loan Management Platform</p>
                </div>
              </div>

              {/* DYNAMIC NAVIGATION LINKS BASED ON CURRENT USER ROLE */}
              <nav className="hidden md:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {currentRole === 'Applicant' && (
                  <>
                    <button 
                      onClick={() => setActiveTab('dashboard')} 
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-slate-800 text-amber-400 border border-slate-700' : 'text-slate-400 hover:text-white'}`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </button>
                    <button 
                      onClick={() => setActiveTab('marketplace')} 
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'marketplace' ? 'bg-slate-800 text-amber-400 border border-slate-700' : 'text-slate-400 hover:text-white'}`}
                    >
                      <Building2 className="w-4 h-4" />
                      Marketplace
                    </button>
                    <button 
                      onClick={() => setActiveTab('apply')} 
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'apply' ? 'bg-slate-800 text-amber-400 border border-slate-700' : 'text-slate-400 hover:text-white'}`}
                    >
                      <PlusCircle className="w-4 h-4" />
                      Apply Loan
                    </button>
                    <button 
                      onClick={() => setActiveTab('applications')} 
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'applications' ? 'bg-slate-800 text-amber-400 border border-slate-700' : 'text-slate-400 hover:text-white'}`}
                    >
                      <FileText className="w-4 h-4" />
                      My Applications
                    </button>
                  </>
                )}

                {currentRole === 'Loan Officer' && (
                  <>
                    <button 
                      onClick={() => setActiveTab('review')} 
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'review' ? 'bg-slate-800 text-amber-400 border border-slate-700' : 'text-slate-400 hover:text-white'}`}
                    >
                      <FileText className="w-4 h-4" />
                      Review Queue
                    </button>
                    <button 
                      onClick={() => setActiveTab('products')} 
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'products' ? 'bg-slate-800 text-amber-400 border border-slate-700' : 'text-slate-400 hover:text-white'}`}
                    >
                      <Building2 className="w-4 h-4" />
                      Publish Products
                    </button>
                  </>
                )}

                {currentRole === 'Administrator' && (
                  <>
                    <button 
                      onClick={() => setActiveTab('adminDashboard')} 
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'adminDashboard' ? 'bg-slate-800 text-amber-400 border border-slate-700' : 'text-slate-400 hover:text-white'}`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      Analytics Hub
                    </button>
                    <button 
                      onClick={() => setActiveTab('logs')} 
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'logs' ? 'bg-slate-800 text-amber-400 border border-slate-700' : 'text-slate-400 hover:text-white'}`}
                    >
                      <Database className="w-4 h-4" />
                      System Logs
                    </button>
                  </>
                )}
              </nav>

              {/* USER INFO & NOTIFICATION ALERTS */}
              <div className="flex items-center gap-4">
                
                {/* System Notifications Pop-Out Toggler */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all text-slate-300 relative"
                  >
                    <Bell className="w-5 h-5" />
                    {notificationCount > 0 && (
                      <span className="absolute top-1 right-1 w-5 h-5 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                        {notificationCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
                      <div className="px-4 py-3 bg-slate-900 flex justify-between items-center">
                        <span className="font-bold text-sm text-amber-400">DANA Email Dispatches</span>
                        <button 
                          onClick={() => setNotificationCount(0)}
                          className="text-xs text-slate-400 hover:text-white font-semibold"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                        {sentEmails.map(email => (
                          <div key={email.id} className="p-4 hover:bg-slate-900/40 transition-colors">
                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                              <Mail className="w-3.5 h-3.5 text-amber-500" />
                              <span>To: {email.recipient}</span>
                              <span className="ml-auto font-mono">{email.timestamp}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-200 mb-0.5">{email.subject}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-2">{email.body}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Current Session Profile Info */}
                <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-bold flex items-center justify-center uppercase shadow-md font-mono">
                    {currentUser.username.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-bold text-slate-200 leading-none">{currentUser.username}</p>
                    <span className="text-xs text-amber-400 font-semibold mt-0.5 block">{currentRole}</span>
                  </div>
                </div>

              </div>
            </div>
          </header>

          {/* CORE WRAPPER CONTENT AREA */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* ======================================= */}
            {/* APPLICANT INTERFACE VIEW                */}
            {/* ======================================= */}
            {currentRole === 'Applicant' && (
              <div className="space-y-8">
                
                {/* Welcome Card & Key Highlights */}
                <div className="bg-gradient-to-br from-slate-950 via-slate-950 to-amber-950/20 rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient from-amber-500/10 to-transparent pointer-events-none" />
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                        DANA: MSME Digital Financing <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">System</span>
                      </h1>
                      <p className="text-slate-400 mt-2 max-w-xl text-sm leading-relaxed">
                        Welcome back, <strong>{currentUser.username}</strong>. Explore matching schemes, request digital loans, clear installment payments, and view dynamic banking bids on your company.
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('apply')}
                      className="bg-amber-500 hover:bg-amber-600 active:transform active:scale-[0.98] text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 self-start md:self-auto"
                    >
                      <PlusCircle className="w-5 h-5" />
                      Apply New Financing
                    </button>
                  </div>
                </div>

                {/* SME Company Profile & Criteria Widget */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column: Business Profile */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 shadow-md">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2.5">
                        <Building2 className="text-amber-500 w-5 h-5" />
                        <h2 className="font-bold text-base text-white">Business Profile Registry</h2>
                      </div>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Verified SSM</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-500 font-semibold block uppercase">Company Entity</label>
                        <p className="text-sm font-bold text-slate-200 mt-0.5">{currentUser.company || "Not Provided"}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-500 font-semibold block uppercase">Industry Sector</label>
                          <p className="text-sm font-bold text-slate-200 mt-0.5">{currentUser.industry}</p>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 font-semibold block uppercase">Business Age</label>
                          <p className="text-sm font-bold text-slate-200 mt-0.5">{currentUser.ageYears} Years Operational</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-semibold block uppercase">Avg Monthly Revenue</label>
                        <p className="text-sm font-extrabold text-amber-400 mt-0.5">RM {currentUser.revenue?.toLocaleString() || '0'}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-850">
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        *Need to update details? Adjust parameters below to simulate immediate growth metrics.
                      </p>
                      <button 
                        onClick={() => {
                          setCurrentUser(prev => ({ ...prev, revenue: (prev.revenue || 0) + 15000 }));
                          addLog("Upgraded average monthly revenue (+RM15k) via simulation dashboard");
                        }}
                        className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-semibold text-xs py-2 rounded-lg transition-all"
                      >
                        Simulate Revenue Upgrade (+RM 15,000)
                      </button>
                    </div>
                  </div>

                  {/* Middle & Right Column: Active Financing Loans List */}
                  <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-850 shadow-md">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2.5">
                        <Coins className="text-amber-500 w-5 h-5" />
                        <h2 className="font-bold text-base text-white">Centralized Loan & Repayment Manager</h2>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">Automatic system tracking active</span>
                    </div>

                    {applications.filter(a => a.status === 'Repaying' && a.applicantName === currentUser.username).length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <AlertCircle className="w-12 h-12 text-slate-600 mb-3" />
                        <p className="font-bold text-slate-400">No active loans requiring repayments.</p>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm">
                          To trigger a dynamic repayment, select a pending application below and accept an active bank offer bid.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {applications.map((app, index) => {
                          if (app.status !== 'Repaying' || !app.activeLoan || app.applicantName !== currentUser.username) return null;
                          const loan = app.activeLoan;
                          return (
                            <div key={app.id} className="bg-slate-900 rounded-xl p-5 border border-slate-800 relative overflow-hidden">
                              <div className="absolute right-0 top-0 bg-emerald-500/10 text-emerald-400 border-l border-b border-slate-800 text-xs px-3 py-1 font-extrabold uppercase rounded-bl">
                                Phase: Repaying
                              </div>
                              
                              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                <div>
                                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{loan.institution}</span>
                                  <h3 className="text-lg font-bold text-white mt-0.5">RM {loan.amount.toLocaleString()} Financing Pool</h3>
                                  <p className="text-xs text-slate-400 mt-1">Application Reference: <strong className="font-mono text-slate-200">{app.id}</strong></p>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs text-slate-400 uppercase block font-semibold">Monthly Installment</span>
                                  <span className="text-xl font-black text-amber-400">RM {loan.monthlyRepayment.toLocaleString()}</span>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs font-semibold">
                                  <span className="text-slate-400">Installments: {loan.paidMonths} Paid / {loan.tenure} Months</span>
                                  <span className="text-slate-200">RM {loan.remainingBalance.toLocaleString()} Outstanding</span>
                                </div>
                                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex">
                                  <div 
                                    className="bg-amber-500 rounded-full transition-all duration-500" 
                                    style={{ width: `${(loan.paidMonths / loan.tenure) * 100}%` }}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-800/80">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  <span>Next payment due on standard billing cycle</span>
                                </div>
                                <button 
                                  onClick={() => handlePayBalanceInit(loan, index)}
                                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-1.5"
                                >
                                  <CreditCard className="w-3.5 h-3.5" />
                                  Simulate Installment Payment
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>

                </div>

                {/* Offer Bidding System: Pending Custom Offers for Active Applications */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 shadow-md">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2.5">
                      <TrendingUp className="text-amber-500 w-5 h-5" />
                      <h2 className="font-bold text-base text-white">Dynamic Bank Bidding Console</h2>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Bidding mechanism enables competitive pricing</span>
                  </div>

                  {applications.filter(a => (a.status === 'Bidding Open' || a.status === 'Offers Received') && a.applicantName === currentUser.username).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
                      <AlertCircle className="w-12 h-12 text-slate-700 mb-2" />
                      <p className="font-bold text-slate-400">No active applications currently in Bidding Phase.</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm">
                        Submit a new financing application to allow banking institutions to bid custom offers for your enterprise profile!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {applications.filter(a => (a.status === 'Bidding Open' || a.status === 'Offers Received') && a.applicantName === currentUser.username).map(app => {
                        const appOffers = offers.filter(o => o.applicationId === app.id);
                        return (
                          <div key={app.id} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
                            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
                              <div>
                                <span className="bg-slate-950 text-amber-400 text-[11px] px-2 py-0.5 rounded-full font-bold font-mono uppercase">{app.id}</span>
                                <h4 className="text-sm font-bold text-white mt-1.5">{app.purpose}</h4>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-slate-500 font-semibold block uppercase">Target Financing Request</span>
                                <span className="text-base font-extrabold text-slate-200">RM {app.requestedAmount.toLocaleString()}</span>
                              </div>
                            </div>

                            {appOffers.length === 0 ? (
                              <div className="text-center py-6 text-slate-500 text-xs">
                                <Clock className="w-5 h-5 mx-auto text-slate-600 mb-1.5 animate-spin" />
                                <span>Awaiting custom competitive bids from Malaysian banking units. Review again shortly!</span>
                              </div>
                            ) : (
                              <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tailored Financing Offers Received ({appOffers.length})</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {appOffers.map(offer => (
                                    <div key={offer.id} className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
                                      <div>
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <span className="text-xs text-amber-400 font-bold block">{offer.institution}</span>
                                            <span className="text-xl font-black text-white block mt-1">RM {offer.amount.toLocaleString()}</span>
                                          </div>
                                          <div className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded text-xs font-bold font-mono">
                                            {offer.interestRate}% Interest
                                          </div>
                                        </div>
                                        
                                        <div className="my-3 space-y-1 text-xs">
                                          <p className="text-slate-400"><strong className="text-slate-300">Tenure:</strong> {offer.tenure} Months</p>
                                          <p className="text-slate-400 leading-relaxed"><strong className="text-slate-300">Conditions:</strong> {offer.specialConditions}</p>
                                        </div>
                                      </div>

                                      <button
                                        onClick={() => handleSelectOffer(offer.id, app.id)}
                                        className="w-full mt-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1"
                                      >
                                        Accept Offer & Authorize Disbursement
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* APPLICANT TABS: FINANCING MARKETPLACE COMPARISON */}
            {activeTab === 'marketplace' && (
              <div className="space-y-6">
                
                {/* Searching and Filter Parameters block */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                  <div className="flex-1 w-full">
                    <h2 className="text-xl font-bold text-white">DANA Financing Marketplace</h2>
                    <p className="text-xs text-slate-400 mt-1">Explore, search, and evaluate published MSME financing structures side-by-side.</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search institution or product..."
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Tenure Multi-Filter */}
                    <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <select 
                        value={marketTenureFilter} 
                        onChange={(e) => setMarketTenureFilter(e.target.value)}
                        className="bg-transparent text-xs text-slate-200 focus:outline-none"
                      >
                        <option value="All">All Tenures</option>
                        <option value="Short">Short (≤12 Mo)</option>
                        <option value="Medium">Medium (13-36 Mo)</option>
                        <option value="Long">Long (&gt;36 Mo)</option>
                      </select>
                    </div>

                    {/* Rate Multi-Filter */}
                    <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                      <Sliders className="w-3.5 h-3.5 text-slate-400" />
                      <select 
                        value={marketRateFilter} 
                        onChange={(e) => setMarketRateFilter(e.target.value)}
                        className="bg-transparent text-xs text-slate-200 focus:outline-none"
                      >
                        <option value="All">All Rates</option>
                        <option value="Low">Low Rates (≤3%)</option>
                        <option value="High">Standard Rates (&gt;3%)</option>
                      </select>
                    </div>

                  </div>
                </div>

                {/* Compare Schemes Matrix Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProducts.map(product => {
                    const assessment = getSmartMatchingScore(product, currentUser);
                    return (
                      <div key={product.id} className="bg-slate-950 rounded-2xl border border-slate-850 p-6 flex flex-col justify-between hover:border-slate-800 transition-all shadow-md">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{product.institution}</span>
                              <h3 className="font-bold text-lg text-white mt-1.5">{product.name}</h3>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-slate-500 font-semibold block uppercase">Profit Rate</span>
                              <span className="text-lg font-black text-amber-400">{product.interestRate}% p.a.</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">{product.description}</p>

                          {/* Eligibility matching badge */}
                          <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-slate-800">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-slate-300">Smart Match Rating</span>
                              <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${assessment.percentage >= 80 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                {assessment.percentage}% Match ({assessment.grade})
                              </span>
                            </div>
                            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                              <div className={`h-full transition-all ${assessment.percentage >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${assessment.percentage}%` }} />
                            </div>
                            <div className="mt-2 space-y-0.5">
                              {assessment.reasons.slice(0, 2).map((reason, idx) => (
                                  <p key={idx} className="text-[10px] text-slate-500 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-amber-500 inline-block" />
                                    {reason}
                                  </p>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                            <div>
                              <span className="text-slate-500 block uppercase font-semibold">Financing Range</span>
                              <span className="font-bold text-slate-300">RM {product.minAmount.toLocaleString()} - RM {product.maxAmount.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block uppercase font-semibold">Repayment Tenure</span>
                              <span className="font-bold text-slate-300">Up to {product.tenureMonths} Months</span>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-slate-900">
                            <span className="text-[10px] text-slate-500 block uppercase font-semibold mb-1">Mandatory documentation</span>
                            <p className="text-xs text-slate-400">{product.requirements}</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            setNewApplicationForm(prev => ({ ...prev, requestedAmount: product.minAmount }));
                            setActiveTab('apply');
                          }}
                          className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                        >
                          Initiate Financing Wizard
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <div className="col-span-2 text-center py-12 bg-slate-950 rounded-2xl border border-slate-850">
                      <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="font-bold text-slate-400">No matching products found.</p>
                      <p className="text-xs text-slate-500 mt-1">Adjust your search keyword or selection filters above to browse more loan products.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* APPLICANT TABS: APPLICATION WIZARD (FORM SUBMISSION) */}
            {activeTab === 'apply' && (
              <div className="max-w-2xl mx-auto bg-slate-950 rounded-2xl border border-slate-850 p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-850">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Financing Request Form</h3>
                    <p className="text-xs text-slate-400">Digital workflow coordinates submissions directly to top institutions via DANA.</p>
                  </div>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-6">
                  
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2 font-mono text-amber-400">Requested Financing Capital (RM)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-amber-500 text-sm font-extrabold font-mono">RM</span>
                      <input 
                        type="text"
                        required
                        value={newApplicationForm.requestedAmount}
                        onChange={(e) => handleNumericInput(e.target.value, 'apply', 'requestedAmount')}
                        className={`w-full pl-12 pr-4 py-2.5 bg-slate-900 border ${formErrors.apply.requestedAmount ? 'border-red-500' : 'border-slate-800'} rounded-xl text-sm font-black text-amber-400 font-mono focus:outline-none`}
                        placeholder="50000"
                      />
                    </div>
                    {formErrors.apply.requestedAmount && <p className="text-xs text-red-400 mt-1.5">{formErrors.apply.requestedAmount}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Detailed Business Purpose of Funds</label>
                    <textarea 
                      required
                      value={newApplicationForm.purpose}
                      onChange={(e) => {
                        setFormErrors(prev => ({ ...prev, apply: { ...prev.apply, purpose: '' } }));
                        setNewApplicationForm(prev => ({ ...prev, purpose: e.target.value }));
                      }}
                      rows="3"
                      className={`w-full px-4 py-2.5 bg-slate-900 border ${formErrors.apply.purpose ? 'border-red-500' : 'border-slate-800'} rounded-xl text-xs text-slate-200 focus:outline-none placeholder-slate-600`}
                      placeholder="E.g., Purchasing raw inventory materials for upcoming government pipeline supply contract..."
                    />
                    {formErrors.apply.purpose && <p className="text-xs text-red-400 mt-1">{formErrors.apply.purpose}</p>}
                  </div>

                  {/* Document Management Mock Upload Section */}
                  <div className="space-y-3">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Enterprise Documentation Management</label>
                    
                    <div className={`border ${formErrors.apply.documents ? 'border-red-500' : 'border-dashed border-slate-800'} rounded-xl p-5 text-center bg-slate-900/40 space-y-3`}>
                      <Upload className="w-8 h-8 text-slate-600 mx-auto" />
                      <div>
                        <p className="text-xs font-bold text-slate-300">Drag & Drop Business Statements</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">SSM registration & last 3 months audited bank statements (PDF)</p>
                      </div>
                      
                      <div className="flex justify-center gap-4 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 hover:bg-slate-900 transition-all">
                          <input 
                            type="checkbox" 
                            checked={newApplicationForm.ssmVerified} 
                            onChange={(e) => {
                              setFormErrors(prev => ({ ...prev, apply: { ...prev.apply, documents: '' } }));
                              setNewApplicationForm(prev => ({ ...prev, ssmVerified: e.target.checked }));
                            }}
                            className="rounded border-slate-850 text-amber-500 focus:ring-0"
                          />
                          SSM_CompanyProfile.pdf ({newApplicationForm.ssmVerified ? "Attached" : "Attach Draft"})
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 hover:bg-slate-900 transition-all">
                          <input 
                            type="checkbox" 
                            checked={newApplicationForm.bankStmtUploaded} 
                            onChange={(e) => {
                              setFormErrors(prev => ({ ...prev, apply: { ...prev.apply, documents: '' } }));
                              setNewApplicationForm(prev => ({ ...prev, bankStmtUploaded: e.target.checked }));
                            }}
                            className="rounded border-slate-850 text-amber-500 focus:ring-0"
                          />
                          BankStatement_6Months.pdf ({newApplicationForm.bankStmtUploaded ? "Attached" : "Attach Draft"})
                        </label>
                      </div>
                      {formErrors.apply.documents && <p className="text-xs text-red-400 mt-2">{formErrors.apply.documents}</p>}
                    </div>
                  </div>

                  {/* Dynamic checklist warning */}
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800/80 flex gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-300">Verification Statement</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                        By submitting, you authorize the DANA system log orchestrator to parse SSM records and compute smart eligibility matches.
                      </p>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    Submit Application Request
                  </button>
                </form>
              </div>
            )}

            {/* APPLICANT TABS: MY SUBMITTED APPLICATIONS LIST */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">My Submitted Requests</h2>
                    <p className="text-xs text-slate-400">Track dynamic review stages and institutional response status inside DANA.</p>
                  </div>
                  
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search requests..."
                      className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredApplications.filter(app => app.applicantName === currentUser.username).length === 0 ? (
                    <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-850">
                      <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="font-bold text-slate-400">No requests match your current search.</p>
                      <button 
                        onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                        className="mt-3 text-xs bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold px-4 py-2 rounded-lg"
                      >
                        Reset Filter
                      </button>
                    </div>
                  ) : (
                    filteredApplications.filter(app => app.applicantName === currentUser.username).map(app => (
                      <div key={app.id} className="bg-slate-950 rounded-2xl border border-slate-850 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono bg-slate-900 text-amber-400 text-xs px-2.5 py-1 rounded border border-slate-800 font-extrabold">{app.id}</span>
                            <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded ${app.status === 'Repaying' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                              {app.status}
                            </span>
                          </div>
                          <h3 className="font-bold text-base text-white mt-3">{app.purpose}</h3>
                          <p className="text-xs text-slate-400 mt-1">Submitted on: <strong className="font-mono text-slate-300">{app.timestamp}</strong></p>
                          
                          <div className="flex gap-4 mt-3">
                            {app.documents.map((doc, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                                <FileText className="w-3 h-3 text-amber-500" />
                                {doc.name} ({doc.size})
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-left md:text-right">
                          <span className="text-xs text-slate-500 font-semibold block uppercase">Requested Value</span>
                          <span className="text-xl font-black text-amber-400">RM {app.requestedAmount.toLocaleString()}</span>
                          
                          <div className="mt-3">
                            {app.status === 'Bidding Open' && (
                              <span className="text-xs text-slate-400 block italic font-semibold">Awaiting first bid...</span>
                            )}
                            {app.status === 'Offers Received' && (
                              <button 
                                onClick={() => setActiveTab('dashboard')}
                                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-1.5 rounded-lg transition-all"
                              >
                                Review Offers Now
                              </button>
                            )}
                            {app.status === 'Repaying' && (
                              <span className="text-xs text-emerald-400 font-bold block">Active Installment Cycle</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </main>

          {/* ======================================= */}
          {/* LOAN OFFICER INTERFACE VIEW             */}
          {/* ======================================= */}
          {currentRole === 'Loan Officer' && (
            <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
              {/* Header / Brand context */}
              <div className="bg-gradient-to-br from-slate-950 via-slate-950 to-amber-950/20 rounded-3xl p-6 sm:p-8 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs text-amber-400 uppercase tracking-wider font-extrabold block mb-1">Financial Partner Console</span>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight">{currentUser.institution} Officer Dashboard</h1>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">
                    Review verified applicant dossiers, run smart suitability matrices, and enter competitive bids on the DANA network to win portfolios.
                  </p>
                </div>
                <Building className="w-12 h-12 text-slate-700 hidden sm:block" />
              </div>

              {/* LOAN OFFICER TABS: ACTIVE APPLICATIONS QUEUE */}
              {activeTab === 'review' && (
                <div className="space-y-6">
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">Verified Market Requests Queue</h2>
                      <p className="text-xs text-slate-400">Browse verified incoming financing requests across Malaysia.</p>
                    </div>
                    
                    {/* Filter selector */}
                    <div className="flex gap-2">
                      {['All', 'Bidding Open', 'Offers Received', 'Repaying'].map(status => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${statusFilter === status ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-850 hover:text-white'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Real-time Search Box */}
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search company, industry or request code..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  {/* AI Evaluation Report HUD (Pinned right above lists if triggered) */}
                  {aiEvaluationReport && (
                    <div className="bg-slate-950 border border-amber-500/30 p-5 rounded-2xl relative overflow-hidden shadow-xl animate-fade-in">
                      <div className="absolute right-0 top-0 bg-amber-500/15 border-l border-b border-amber-500/20 text-[10px] text-amber-400 font-mono px-3 py-1.5 font-bold uppercase tracking-widest flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                        Grounded Decision Assistant
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-5 h-5 text-amber-500" />
                        <h4 className="font-bold text-white text-sm">Grounded Credit Risk Report Summary</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                        <div className="md:col-span-1 bg-slate-900 p-4 rounded-xl border border-slate-850 text-center flex flex-col justify-center">
                          <span className="text-[10px] text-slate-400 uppercase font-black block">Credit Confidence Score</span>
                          <span className="text-3xl font-black text-emerald-400 mt-1 font-mono">{aiEvaluationReport.score} / 100</span>
                          <span className="text-xs text-slate-300 font-bold mt-1.5">{aiEvaluationReport.riskGrade}</span>
                        </div>

                        <div className="md:col-span-3 space-y-3">
                          <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-slate-400 uppercase text-[10px] block mb-0.5">Analytic Reasoning Insight</strong>{aiEvaluationReport.industryInsights}</p>
                          <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-slate-400 uppercase text-[10px] block mb-0.5">Automated Term Guidance</strong>{aiEvaluationReport.suggestedTerms}</p>
                          
                          <div className="pt-2">
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Citations & Grounding Reference Material</span>
                            <div className="flex gap-4">
                              {aiEvaluationReport.groundingSources.map((src, i) => (
                                <a key={i} href={src.url} target="_blank" rel="noreferrer" className="text-[10px] text-amber-400 hover:underline flex items-center gap-1">
                                  <ArrowUpRight className="w-3 h-3" />
                                  {src.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-900 flex justify-end">
                        <button 
                          onClick={() => setAiEvaluationReport(null)}
                          className="text-[11px] text-slate-400 hover:text-white font-bold"
                        >
                          Dismiss Report Panel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Queue List Cards */}
                  <div className="space-y-6">
                    {filteredApplications.map(app => (
                      <div key={app.id} className="bg-slate-950 rounded-2xl border border-slate-850 p-6 flex flex-col lg:flex-row justify-between gap-6">
                        
                        {/* Left: Applicant details */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono bg-slate-900 text-amber-400 text-xs px-2 py-0.5 rounded font-extrabold border border-slate-800">{app.id}</span>
                            <span className="text-xs text-slate-400 font-semibold">• {app.industry} Sector</span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${app.status === 'Repaying' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                              {app.status}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-bold text-lg text-white">{app.companyName}</h3>
                            <p className="text-xs text-slate-400 mt-1">Requested Fund Purpose: <strong className="text-slate-300 font-medium">{app.purpose}</strong></p>
                          </div>

                          {/* Internal financials check */}
                          <div className="grid grid-cols-2 gap-4 max-w-md bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
                            <div>
                              <span className="text-slate-500 block uppercase">Monthly Revenue</span>
                              <span className="font-bold text-slate-300">RM {app.revenue?.toLocaleString() || '0'}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block uppercase">Est. Profile Age</span>
                              <span className="font-bold text-slate-300">{app.ageYears} Years in Market</span>
                            </div>
                          </div>

                          {/* Document Verification checks */}
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider mb-1.5">Submitted KYC Documents</span>
                            <div className="flex flex-wrap gap-3">
                              {app.documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-xs">
                                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                                  <span className="text-slate-300 font-medium">{doc.name}</span>
                                  <span className="text-[9px] uppercase font-bold text-emerald-400 px-1 py-0.2 bg-emerald-500/10 rounded">Verified</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right: Smart criteria analysis & actions */}
                        <div className="w-full lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-850 pt-6 lg:pt-0 lg:pl-6">
                          <div>
                            <div className="flex justify-between items-center text-xs mb-3">
                              <span className="text-slate-400 font-semibold">Requested Amount:</span>
                              <span className="font-black text-lg text-amber-400">RM {app.requestedAmount.toLocaleString()}</span>
                            </div>

                            {/* Intelligent AI Reasoning trigger */}
                            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Gemini Risk Assessor</span>
                                <span className="text-[10px] font-black text-amber-400 uppercase bg-amber-500/10 px-1.5 py-0.5 rounded">Enabled</span>
                              </div>
                              <p className="text-[10px] text-slate-400 leading-relaxed">
                                Query grounded neural risk engine to parse candidate profile against local central bank parameters.
                              </p>
                              <button
                                type="button"
                                disabled={isEvaluatingAi}
                                onClick={() => runAiRiskAssessment(app.id)}
                                className="w-full bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-800 hover:text-white font-bold py-1.5 rounded-lg text-[10px] transition-all flex items-center justify-center gap-1.5"
                              >
                                {isEvaluatingAi ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    Parsing Live Data...
                                  </>
                                ) : (
                                  <>
                                    <Cpu className="w-3.5 h-3.5" />
                                    Generate Grounded Risk Report
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-900">
                            {app.status === 'Bidding Open' || app.status === 'Offers Received' ? (
                              <button
                                onClick={() => {
                                  setActiveApplicationForBidding(app);
                                  setNewBidForm({
                                    amount: app.requestedAmount,
                                    interestRate: 3.8,
                                    tenure: 24,
                                    conditions: ''
                                  });
                                }}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                              >
                                <PlusCircle className="w-4 h-4" />
                                Submit Targeted Financing Offer
                              </button>
                            ) : (
                              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850 text-center text-xs text-slate-400 font-semibold">
                                Offers Locked (Status: {app.status})
                              </div>
                            )}
                          </div>

                        </div>

                      </div>
                    ))}
                    {filteredApplications.length === 0 && (
                      <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-850">
                        <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="font-bold text-slate-400">No requests match your current search constraints.</p>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* LOAN OFFICER TABS: PUBLISH PRODUCTS CONFIG */}
              {activeTab === 'products' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Form column */}
                  <div className="lg:col-span-1 bg-slate-950 p-6 rounded-2xl border border-slate-850 h-fit space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-slate-850">
                      <PlusCircle className="text-amber-500 w-5 h-5" />
                      <h3 className="font-bold text-white text-base">Publish Loan Schema</h3>
                    </div>

                    <form onSubmit={handlePublishProduct} className="space-y-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Product Title</label>
                        <input 
                          type="text" required
                          value={newProductForm.name}
                          onChange={(e) => {
                            setFormErrors(prev => ({ ...prev, product: { ...prev.product, name: '' } }));
                            setNewProductForm(prev => ({ ...prev, name: e.target.value }));
                          }}
                          className={`w-full px-3 py-2 bg-slate-900 border ${formErrors.product.name ? 'border-red-500' : 'border-slate-800'} rounded-lg text-xs text-white focus:outline-none`}
                          placeholder="E.g., Micro-Retail Expansion Fund"
                        />
                        {formErrors.product.name && <p className="text-[10px] text-red-400 mt-1">{formErrors.product.name}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 font-mono text-amber-400">Min Capital (RM)</label>
                          <input 
                            type="text" required
                            value={newProductForm.minAmount}
                            onChange={(e) => handleNumericInput(e.target.value, 'product', 'minAmount')}
                            className={`w-full px-3 py-2 bg-slate-950 border ${formErrors.product.minAmount ? 'border-red-500' : 'border-slate-800'} rounded-lg text-xs text-amber-400 font-mono`}
                            placeholder="5000"
                          />
                          {formErrors.product.minAmount && <p className="text-[10px] text-red-400 mt-1">{formErrors.product.minAmount}</p>}
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 font-mono text-amber-400">Max Capital (RM)</label>
                          <input 
                            type="text" required
                            value={newProductForm.maxAmount}
                            onChange={(e) => handleNumericInput(e.target.value, 'product', 'maxAmount')}
                            className={`w-full px-3 py-2 bg-slate-950 border ${formErrors.product.maxAmount ? 'border-red-500' : 'border-slate-800'} rounded-lg text-xs text-amber-400 font-mono`}
                            placeholder="100000"
                          />
                          {formErrors.product.maxAmount && <p className="text-[10px] text-red-400 mt-1">{formErrors.product.maxAmount}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 font-mono text-amber-400">Profit/Rate (% p.a.)</label>
                          <input 
                            type="text" required
                            value={newProductForm.interestRate}
                            onChange={(e) => handleNumericInput(e.target.value, 'product', 'interestRate', true)}
                            className={`w-full px-3 py-2 bg-slate-950 border ${formErrors.product.interestRate ? 'border-red-500' : 'border-slate-800'} rounded-lg text-xs text-amber-400 font-mono`}
                            placeholder="3.5"
                          />
                          {formErrors.product.interestRate && <p className="text-[10px] text-red-400 mt-1">{formErrors.product.interestRate}</p>}
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 font-mono text-amber-400">Max Tenure (Mo)</label>
                          <input 
                            type="text" required
                            value={newProductForm.tenureMonths}
                            onChange={(e) => handleNumericInput(e.target.value, 'product', 'tenureMonths')}
                            className={`w-full px-3 py-2 bg-slate-950 border ${formErrors.product.tenureMonths ? 'border-red-500' : 'border-slate-800'} rounded-lg text-xs text-amber-400 font-mono`}
                            placeholder="24"
                          />
                          {formErrors.product.tenureMonths && <p className="text-[10px] text-red-400 mt-1">{formErrors.product.tenureMonths}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 font-mono text-amber-400">Min Revenue/Mo</label>
                          <input 
                            type="text" required
                            value={newProductForm.minRevenue}
                            onChange={(e) => handleNumericInput(e.target.value, 'product', 'minRevenue')}
                            className={`w-full px-3 py-2 bg-slate-950 border ${formErrors.product.minRevenue ? 'border-red-500' : 'border-slate-800'} rounded-lg text-xs text-amber-400 font-mono`}
                            placeholder="10000"
                          />
                          {formErrors.product.minRevenue && <p className="text-[10px] text-red-400 mt-1">{formErrors.product.minRevenue}</p>}
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 font-mono text-amber-400">Min Business Age</label>
                          <input 
                            type="text" required
                            value={newProductForm.minAgeYears}
                            onChange={(e) => handleNumericInput(e.target.value, 'product', 'minAgeYears')}
                            className={`w-full px-3 py-2 bg-slate-950 border ${formErrors.product.minAgeYears ? 'border-red-500' : 'border-slate-800'} rounded-lg text-xs text-amber-400 font-mono`}
                            placeholder="2"
                          />
                          {formErrors.product.minAgeYears && <p className="text-[10px] text-red-400 mt-1">{formErrors.product.minAgeYears}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Mandatory Documents required</label>
                        <input 
                          type="text" required
                          value={newProductForm.requirements}
                          onChange={(e) => {
                            setFormErrors(prev => ({ ...prev, product: { ...prev.product, requirements: '' } }));
                            setNewProductForm(prev => ({ ...prev, requirements: e.target.value }));
                          }}
                          className={`w-full px-3 py-2 bg-slate-900 border ${formErrors.product.requirements ? 'border-red-500' : 'border-slate-800'} rounded-lg text-xs text-white focus:outline-none`}
                          placeholder="SSM Certificate, 3 months statements"
                        />
                        {formErrors.product.requirements && <p className="text-[10px] text-red-400 mt-1">{formErrors.product.requirements}</p>}
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Product Description</label>
                        <textarea 
                          required
                          value={newProductForm.description}
                          onChange={(e) => setNewProductForm(prev => ({ ...prev, description: e.target.value }))}
                          rows="2"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
                          placeholder="Short overview describing the focus target..."
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-xl text-xs uppercase"
                      >
                        Publish to Marketplace
                      </button>
                    </form>
                  </div>

                  {/* Published products preview list */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-lg text-white">Our Bank's Published Products</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {loanProducts.filter(p => p.institution === (currentUser.institution || 'Maybank Islamic')).map(product => (
                        <div key={product.id} className="bg-slate-950 rounded-xl p-5 border border-slate-850 space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-sm text-white">{product.name}</h4>
                            <span className="text-xs font-black text-amber-400">{product.interestRate}% p.a.</span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">{product.description}</p>
                          
                          <div className="pt-3 border-t border-slate-900 grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono">
                            <p>Min Revenue: <strong className="text-slate-300">RM {product.minRevenue.toLocaleString()}</strong></p>
                            <p>Min Age: <strong className="text-slate-300">{product.minAgeYears} Years</strong></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ======================================= */}
          {/* PLATFORM ADMINISTRATOR VIEWS            */}
          {/* ======================================= */}
          {currentRole === 'Administrator' && (
            <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
              {/* Stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-slate-400 uppercase font-semibold">Accumulated Repayments Volume</span>
                      <p className="text-2xl font-black text-white mt-1">RM 1,455,880</p>
                    </div>
                    <div className="bg-amber-500/10 p-2.5 rounded-lg text-amber-400">
                      <Coins className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-4 text-xs text-emerald-400 font-bold">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+12% relative to June 2026</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-slate-400 uppercase font-semibold">Dynamic Platform Fee Income</span>
                      <p className="text-2xl font-black text-amber-400 mt-1">RM {accumulatedPlatformFees.toFixed(2)}</p>
                    </div>
                    <div className="bg-emerald-500/10 p-2.5 rounded-lg text-emerald-400">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-[10px] text-slate-400 leading-none">
                    <span>Tiered Repayments processing fee (1%, 2%, 3%) calculated live on DANA</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-slate-400 uppercase font-semibold">Active Registered MSMEs</span>
                      <p className="text-2xl font-black text-white mt-1">45 Businesses</p>
                    </div>
                    <div className="bg-amber-500/10 p-2.5 rounded-lg text-amber-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-4 text-xs text-emerald-400 font-bold">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+5 new startups this week</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-slate-400 uppercase font-semibold">Average Market Approval Rate</span>
                      <p className="text-2xl font-black text-white mt-1">87.5%</p>
                    </div>
                    <div className="bg-emerald-500/10 p-2.5 rounded-lg text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-4 text-xs text-slate-400 font-medium">
                    <span>Competitive bidding scales success</span>
                  </div>
                </div>

              </div>

              {/* Analytical Charts Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left: Repayment flow trajectory */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 shadow-md space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base text-white">Monthly Platform Processing Fee (RM)</h3>
                    <span className="text-xs text-slate-400 font-medium">Continuous trajectory</span>
                  </div>
                  
                  <div className="h-48 flex items-end justify-between gap-2.5 pt-6 font-mono text-[10px] text-slate-500">
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="bg-slate-900 border border-slate-800 w-full rounded-t-lg transition-all" style={{ height: '35%' }}>
                        <span className="text-[9px] font-bold text-slate-300 block text-center mt-1">RM350</span>
                      </div>
                      <span>Jan</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="bg-slate-900 border border-slate-800 w-full rounded-t-lg transition-all" style={{ height: '50%' }}>
                        <span className="text-[9px] font-bold text-slate-300 block text-center mt-1">RM500</span>
                      </div>
                      <span>Feb</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="bg-slate-900 border border-slate-800 w-full rounded-t-lg transition-all" style={{ height: '70%' }}>
                        <span className="text-[9px] font-bold text-slate-300 block text-center mt-1">RM700</span>
                      </div>
                      <span>Mar</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="bg-gradient-to-t from-amber-600 to-amber-500 w-full rounded-t-lg transition-all" style={{ height: '90%' }}>
                        <span className="text-[9px] font-black text-slate-950 block text-center mt-1">RM950</span>
                      </div>
                      <span>Apr</span>
                    </div>
                  </div>
                </div>

                {/* Right: Institutional Share split */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 shadow-md space-y-4">
                  <h3 className="font-bold text-base text-white">Active Share of Bank Portfolios</h3>
                  
                  <div className="space-y-4 pt-4">
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-300">Maybank Islamic</span>
                        <span className="text-amber-400">45%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '45%' }} />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-300">SME Bank Malaysia</span>
                        <span className="text-amber-400">30%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '30%' }} />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-300">MARA SPIKE Scheme</span>
                        <span className="text-amber-400">15%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '15%' }} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* API Connection simulated payload stream */}
              <div className="bg-slate-950 rounded-2xl border border-slate-850 p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                  <Cpu className="text-amber-500 w-5 h-5 animate-pulse" />
                  <h3 className="font-bold text-white text-base">Active Third-Party API Dispatch Trace</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-[11px] text-slate-300">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">API Logs ({apiLogs.length} active)</span>
                    <div className="space-y-2 max-h-56 overflow-y-auto bg-slate-900 border border-slate-850 rounded-xl p-3 divide-y divide-slate-850">
                      {apiLogs.map(api => (
                        <div key={api.id} className="pt-2 flex justify-between gap-4">
                          <div>
                            <span className="text-amber-400 font-bold">[{api.type}]</span>
                            <p className="text-slate-400 mt-0.5">{api.method} {api.endpoint}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-emerald-400 font-bold">{api.status}</span>
                            <p className="text-slate-500 mt-0.5">{api.latency}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Outgoing Webhook Inspection (SMTP Payload Detail)</span>
                    <div className="bg-slate-900 border border-slate-850 rounded-xl p-3 text-slate-400 overflow-x-auto whitespace-pre-wrap">
                      {`SMTP-TLS Connection Status: OK\nHost: smtp.dana.my:587\nHandshake SSLv3/TLSv1.3 resolved.\nPayload trace:\n`}
                      <span className="text-emerald-400">{apiLogs[0] ? JSON.stringify(JSON.parse(apiLogs[0].payload), null, 2) : '{}'}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* PLATFORM ADMINISTRATOR TABS: SYSTEM AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                <div className="flex-1 w-full">
                  <h2 className="text-xl font-bold text-white">DANA Activity Logging System</h2>
                  <p className="text-xs text-slate-400 mt-1 font-sans">Live operational logs audit tracing transactions, authentication events, and status modifications inside DANA.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  
                  {/* Search logs bar */}
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input 
                      type="text" 
                      value={logSearchQuery}
                      onChange={(e) => setLogSearchQuery(e.target.value)}
                      placeholder="Search log trace keyword..."
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  {/* Role selection dropdown */}
                  <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                    <ListFilter className="w-3.5 h-3.5 text-slate-400" />
                    <select 
                      value={logRoleFilter} 
                      onChange={(e) => setLogRoleFilter(e.target.value)}
                      className="bg-transparent text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="All">All User Classes</option>
                      <option value="System">System System</option>
                      <option value="Applicant">Applicant Class</option>
                      <option value="Loan Officer">Officer Class</option>
                      <option value="Administrator">Admin Class</option>
                    </select>
                  </div>

                </div>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Timestamp</th>
                        <th className="px-6 py-4">User Ref</th>
                        <th className="px-6 py-4">Role System Access</th>
                        <th className="px-6 py-4">Action Parameters</th>
                        <th className="px-6 py-4">Simulated Origin IP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/55">
                      {filteredSystemLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-900/40 transition-all font-mono text-[11px]">
                          <td className="px-6 py-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                          <td className="px-6 py-4 font-bold text-amber-400">{log.userId}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${log.role === 'Applicant' ? 'bg-amber-500/10 text-amber-400' : log.role === 'Loan Officer' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-300'}`}>
                              {log.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-200">{log.action}</td>
                          <td className="px-6 py-4 text-slate-500">{log.ip}</td>
                        </tr>
                      ))}
                      {filteredSystemLogs.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center py-8 text-slate-500 italic">No logs matched your custom search filter criteria.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* GLOBAL OVERLAYS & SIMULATION MODALS    */}
          {/* ======================================= */}
          
          {/* 1. BANK OFFER BIDDING SIMULATOR MODAL (FOR LOAN OFFICERS) */}
          {activeApplicationForBidding && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
                <button 
                  onClick={() => {
                    setActiveApplicationForBidding(null);
                    setFormErrors(prev => ({ ...prev, bid: {} }));
                  }}
                  className="absolute right-4 top-4 text-slate-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>

                <div>
                  <span className="text-xs text-amber-400 uppercase font-bold tracking-widest block">Submit Bid System</span>
                  <h3 className="font-extrabold text-xl text-white mt-1">Formulate Custom Financing Offer</h3>
                  <p className="text-xs text-slate-400 mt-1">Reviewing application dossier for <strong className="text-slate-200">{activeApplicationForBidding.companyName}</strong>.</p>
                </div>

                <form onSubmit={handlePlaceBid} className="space-y-4">
                  
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 font-mono text-amber-400">Target Offered Amount (RM)</label>
                    <input 
                      type="text" required
                      value={newBidForm.amount}
                      onChange={(e) => handleNumericInput(e.target.value, 'bid', 'amount')}
                      className={`w-full px-3 py-2.5 bg-slate-950 border ${formErrors.bid.amount ? 'border-red-500' : 'border-slate-800'} rounded-lg text-sm text-amber-400 font-mono`}
                      placeholder="50000"
                    />
                    {formErrors.bid.amount && <p className="text-[10px] text-red-400 mt-1">{formErrors.bid.amount}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 font-mono text-amber-400">Proposed Interest Rate (% p.a.)</label>
                      <input 
                        type="text" required
                        value={newBidForm.interestRate}
                        onChange={(e) => handleNumericInput(e.target.value, 'bid', 'interestRate', true)}
                        className={`w-full px-3 py-2.5 bg-slate-950 border ${formErrors.bid.interestRate ? 'border-red-500' : 'border-slate-800'} rounded-lg text-sm text-amber-400 font-mono`}
                        placeholder="3.8"
                      />
                      {formErrors.bid.interestRate && <p className="text-[10px] text-red-400 mt-1">{formErrors.bid.interestRate}</p>}
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 font-mono text-amber-400">Repayment Period (Months)</label>
                      <input 
                        type="text" required
                        value={newBidForm.tenure}
                        onChange={(e) => handleNumericInput(e.target.value, 'bid', 'tenure')}
                        className={`w-full px-3 py-2.5 bg-slate-950 border ${formErrors.bid.tenure ? 'border-red-500' : 'border-slate-800'} rounded-lg text-sm text-amber-400 font-mono`}
                        placeholder="24"
                      />
                      {formErrors.bid.tenure && <p className="text-[10px] text-red-400 mt-1">{formErrors.bid.tenure}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Covenants / Special Conditions</label>
                    <input 
                      type="text" required
                      value={newBidForm.conditions}
                      onChange={(e) => setNewBidForm(prev => ({ ...prev, conditions: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                      placeholder="E.g., Submission of 2026 Q2 management accounts upon final disbursement release."
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-850">
                    <button 
                      type="button"
                      onClick={() => {
                        setActiveApplicationForBidding(null);
                        setFormErrors(prev => ({ ...prev, bid: {} }));
                      }}
                      className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg uppercase transition-all"
                    >
                      Confirm & Dispatch Bid
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

          {/* 2. PAYMENT GATEWAY INTEGRATED CHECKOUT SIMULATOR (WITH FPX & CARD STRIPE API SCHEMAS) */}
          {showPaymentModal && paymentData && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>

                <div className="text-center">
                  <span className="text-xs text-amber-400 uppercase font-bold tracking-widest block font-mono flex items-center justify-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    DANA SECURE PAYMENT HUB
                  </span>
                  <h3 className="font-extrabold text-xl text-white mt-1">Clearing Settlement</h3>
                  <p className="text-xs text-slate-400 mt-1">Routing transaction securely to: <strong className="text-slate-200">{paymentData.loan.institution}</strong></p>
                </div>

                {!paymentSuccess ? (
                  <div className="space-y-4">
                    
                    {/* Select Payment Method */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-850">
                      <button 
                        type="button"
                        onClick={() => {
                          setPaymentMethod('fpx');
                          setFormErrors(prev => ({ ...prev, payment: {} }));
                        }}
                        className={`py-2 text-xs font-bold rounded-lg transition-all ${paymentMethod === 'fpx' ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'text-slate-400 hover:text-white'}`}
                      >
                        FPX Online Banking
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setPaymentMethod('card');
                          setFormErrors(prev => ({ ...prev, payment: {} }));
                        }}
                        className={`py-2 text-xs font-bold rounded-lg transition-all ${paymentMethod === 'card' ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'text-slate-400 hover:text-white'}`}
                      >
                        Credit/Debit Card
                      </button>
                    </div>

                    {/* FPX Direct Selector Form */}
                    {paymentMethod === 'fpx' ? (
                      <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                        <label className="text-[10px] text-slate-400 font-bold uppercase block">Choose bank from Malaysian FPX Portal</label>
                        <select 
                          value={selectedFpxBank}
                          onChange={(e) => setSelectedFpxBank(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs text-white p-2 focus:outline-none"
                        >
                          <option value="maybank2u">Maybank2U</option>
                          <option value="cimb_clicks">CIMB Clicks</option>
                          <option value="bank_islam">Bank Islam</option>
                          <option value="public_bank">Public Bank</option>
                        </select>
                      </div>
                    ) : (
                      // Stripe Card mockup form
                      <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Card Number</label>
                          <input 
                            type="text" 
                            placeholder="4111 2222 3333 4444"
                            value={cardDetails.number}
                            onChange={(e) => handleCardNumberInput(e.target.value)}
                            className={`w-full bg-slate-900 border ${formErrors.payment.number ? 'border-red-500' : 'border-slate-800'} rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none`}
                          />
                          {formErrors.payment.number && <p className="text-[10px] text-red-400 mt-1">{formErrors.payment.number}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Expiry</label>
                            <input 
                              type="text" 
                              placeholder="MM/YY"
                              value={cardDetails.expiry}
                              onChange={(e) => handleCardExpiryInput(e.target.value)}
                              className={`w-full bg-slate-900 border ${formErrors.payment.expiry ? 'border-red-500' : 'border-slate-800'} rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none`}
                            />
                            {formErrors.payment.expiry && <p className="text-[10px] text-red-400 mt-1">{formErrors.payment.expiry}</p>}
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">CVC Code</label>
                            <input 
                              type="password" 
                              placeholder="•••"
                              value={cardDetails.cvc}
                              onChange={(e) => handleCardCvcInput(e.target.value)}
                              className={`w-full bg-slate-900 border ${formErrors.payment.cvc ? 'border-red-500' : 'border-slate-800'} rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none`}
                            />
                            {formErrors.payment.cvc && <p className="text-[10px] text-red-400 mt-1">{formErrors.payment.cvc}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Core Invoice Summary */}
                    <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 space-y-3 font-mono text-[11px]">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Core Installment Principal</span>
                        <span className="font-bold text-white">RM {paymentData.loan.monthlyRepayment.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">DANA Platform Service Charge ({paymentData.feePercent}%)</span>
                        <span className="font-bold text-amber-400">+RM {paymentData.feeAmount.toFixed(2)}</span>
                      </div>

                      <div className="h-px bg-slate-850/60 my-2" />

                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-300">Total Charged to Account</span>
                        <span className="font-black text-white text-sm">RM {paymentData.totalToPay.toFixed(2)}</span>
                      </div>
                    </div>

                    {isProcessingPayment ? (
                      <div className="py-6 flex flex-col items-center justify-center space-y-3 bg-slate-950/40 rounded-2xl font-mono text-[11px]">
                        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-400 text-center">Authorizing secure banking clear token via {paymentMethod.toUpperCase()}...</p>
                      </div>
                    ) : (
                      <button
                        onClick={handleProcessPayment}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl text-xs uppercase transition-all"
                      >
                        Authorize Settlement
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-sm">Repayment Transaction Clear</h4>
                      <p className="text-xs text-slate-400 mt-1">DANA platform database updated securely. Notification dispatch sent to recipient email.</p>
                    </div>
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className="bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs px-4 py-2 rounded-lg transition-all"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FOOTER SUMMARY SECTION */}
          <footer className="bg-slate-950 border-t border-slate-850 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
              <p className="uppercase font-bold tracking-wider text-slate-400">
                DANA • MSME Digital Financing & Loan Management Platform
              </p>
              <p>
                <strong>TEB3323: ENTERPRISE SYSTEM DEVELOPMENT PROJECT</strong> - Developed by Danish Hakim (22005975) & Muhammad Aniq Ashraf (22007188).
              </p>
              <p> Lectured by Ts Lt Dr Helmi B Md Rais • Universiti Teknologi Petronas (May 2026 Academic Term). </p>
            </div>
          </footer>
        </>
      )}

    </div>
  );
}