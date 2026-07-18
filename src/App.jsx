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
  ShieldCheck,
  UserMinus
} from 'lucide-react';

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
    status: 'Bidding Open',
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
    status: 'Pending'
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

const INITIAL_USER_ACCOUNTS = [
  {
    username: 'danish',
    password: 'password123',
    role: 'Applicant',
    approved: true, // Seeded users are pre-approved
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
    approved: true,
    profile: {
      username: 'Aniq Ashraf (Maybank Islamic)',
      institution: 'Maybank Islamic',
      email: 'aniq.ashraf@maybank.com.my',
      department: 'Corporate SME Credit Risk Division'
    }
  },
  {
    username: 'admin',
    password: 'password123',
    role: 'Administrator',
    approved: true,
    profile: {
      username: 'System Administrator (ESD Portal)',
      email: 'helmi.rais@utp.edu.my',
      level: 'Super Admin'
    }
  }
];

const loadSavedData = (key, fallbackValue) => {
  try {
    const savedValue = localStorage.getItem(key);

    return savedValue !== null
      ? JSON.parse(savedValue)
      : fallbackValue;
  } catch (error) {
    console.error(`Unable to load ${key}:`, error);
    return fallbackValue;
  }
};

export default function App() {
const [applications, setApplications] = useState(() =>
  loadSavedData('dana_applications', INITIAL_APPLICATIONS)
);

const [loanProducts, setLoanProducts] = useState(() =>
  loadSavedData('dana_loan_products', INITIAL_LOAN_PRODUCTS)
);

const [offers, setOffers] = useState(() =>
  loadSavedData('dana_offers', INITIAL_OFFERS)
);
  
  const [systemLogs, setSystemLogs] = useState(() =>
  loadSavedData('dana_system_logs', [
    {
      id: 1,
      userId: 'SYS',
      role: 'System',
      action: 'DANA Platform initialized securely',
      timestamp: '2026-07-15 08:00 AM',
      ip: '127.0.0.1'
    }
  ])
);
  
  const [sentEmails, setSentEmails] = useState(() =>
  loadSavedData('dana_sent_emails', [])
);

  const [userAccounts, setUserAccounts] = useState(() =>
  loadSavedData('dana_user_accounts', INITIAL_USER_ACCOUNTS)
);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [currentRole, setCurrentRole] = useState('Applicant'); 
  const [currentUser, setCurrentUser] = useState(null);

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    industry: 'Technology',
    revenue: '',
    ageYears: ''
  });

  const [officerForm, setOfficerForm] = useState({
    username: '',
    password: '',
    fullName: '',
    institution: 'Maybank Islamic',
    email: '',
    department: 'Corporate SME Credit Risk Division'
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [notificationCount, setNotificationCount] = useState(1);
  const [showNotifications, setShowNotifications] = useState(false);

  const [activeApplicationForBidding, setActiveApplicationForBidding] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const [newProductForm, setNewProductForm] = useState({
    name: '', minAmount: '', maxAmount: '', interestRate: '', tenureMonths: '', minRevenue: '', minAgeYears: '', requirements: '', description: ''
  });
  const [newBidForm, setNewBidForm] = useState({
    amount: '', interestRate: '', tenure: '', conditions: ''
  });
  const [newApplicationForm, setNewApplicationForm] = useState({
    requestedAmount: 50000, purpose: '', ssmVerified: false, bankStmtUploaded: false
  });

  const [accumulatedPlatformFees, setAccumulatedPlatformFees] = useState(() =>
  loadSavedData('dana_platform_fees', 117.6)
);

useEffect(() => {
  localStorage.setItem(
    'dana_applications',
    JSON.stringify(applications)
  );
}, [applications]);

useEffect(() => {
  localStorage.setItem(
    'dana_loan_products',
    JSON.stringify(loanProducts)
  );
}, [loanProducts]);

useEffect(() => {
  localStorage.setItem(
    'dana_offers',
    JSON.stringify(offers)
  );
}, [offers]);

useEffect(() => {
  localStorage.setItem(
    'dana_user_accounts',
    JSON.stringify(userAccounts)
  );
}, [userAccounts]);

useEffect(() => {
  localStorage.setItem(
    'dana_system_logs',
    JSON.stringify(systemLogs)
  );
}, [systemLogs]);

useEffect(() => {
  localStorage.setItem(
    'dana_sent_emails',
    JSON.stringify(sentEmails)
  );
}, [sentEmails]);

useEffect(() => {
  localStorage.setItem(
    'dana_platform_fees',
    JSON.stringify(accumulatedPlatformFees)
  );
}, [accumulatedPlatformFees]);

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
    setNotificationCount(c => c + 1);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');
    
    const account = userAccounts.find(
      u => u.username.toLowerCase() === loginForm.username.toLowerCase() && u.password === loginForm.password
    );

    if (account) {
      if (!account.approved) {
        setAuthError('Access Denied: Your registration is pending Administrator authorization. Please check back later.');
        addLog(`Blocked unauthorized login attempt for pending user: ${account.username}`, account.role, account.username);
        return;
      }

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
      setAuthError('Incorrect username or password. Try using the quick-select profiles below!');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');

    if (registerForm.username.length < 3) {
      setAuthError('Username must be at least 3 characters.');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    if (userAccounts.some(u => u.username.toLowerCase() === registerForm.username.toLowerCase())) {
      setAuthError('This username is already taken.');
      return;
    }

    const newAccount = {
      username: registerForm.username.toLowerCase(),
      password: registerForm.password,
      role: 'Applicant',
      approved: false, // FLAG: Must be approved by the Administrator first
      profile: {
        username: registerForm.fullName,
        company: registerForm.companyName,
        email: registerForm.email,
        industry: registerForm.industry,
        revenue: Number(registerForm.revenue) || 10000,
        ageYears: Number(registerForm.ageYears) || 1,
        phone: registerForm.phone || '+6012-XXXXXXX'
      }
    };

    setUserAccounts(prev => [...prev, newAccount]);
    setAuthSuccessMsg('Registration submitted successfully! Your account is pending Administrator authorization. Once approved, you will be able to log in.');
    setAuthMode('login');
    
    addLog(`Submitted new Applicant profile registration: ${registerForm.fullName} (${registerForm.companyName}). Pending approval.`, 'Applicant', registerForm.username);
    
    sendEmailNotification(
      registerForm.email,
      'DANA Sign-up Under Review',
      `Dear ${registerForm.fullName}, welcome to DANA! Your profile for ${registerForm.companyName} has been recorded and is currently under review by the Administrator.`
    );

    setRegisterForm({
      username: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      industry: 'Technology',
      revenue: '',
      ageYears: ''
    });
  };

  const handleApproveAccount = (username) => {
    setUserAccounts(prev => prev.map(u => {
      if (u.username === username) {
        // Dispatch mock approval email
        sendEmailNotification(
          u.profile.email,
          'DANA Account Approved & Authorized',
          `Dear ${u.profile.username || u.username}, congratulations! Your DANA MSME portal registration has been successfully approved by the Administrator. You can now log in.`
        );
        return { ...u, approved: true };
      }
      return u;
    }));
    addLog(`Administrator authorized account registration: ${username}`);
  };

  const handleRejectAccount = (username) => {
    setUserAccounts(prev => prev.filter(u => u.username !== username));
    addLog(`Administrator declined registration request: ${username}`);
  };

  const handleCreateOfficer = (e) => {
    e.preventDefault();
    setAuthError('');

    if (officerForm.username.length < 3) {
      alert('Username must be at least 3 characters.');
      return;
    }
    if (userAccounts.some(u => u.username.toLowerCase() === officerForm.username.toLowerCase())) {
      alert('This username is already taken.');
      return;
    }

    const newOfficer = {
      username: officerForm.username.toLowerCase(),
      password: officerForm.password,
      role: 'Loan Officer',
      approved: true, // Officer accounts created by Admin are pre-approved
      profile: {
        username: `${officerForm.fullName} (${officerForm.institution})`,
        institution: officerForm.institution,
        email: officerForm.email,
        department: officerForm.department
      }
    };

    setUserAccounts(prev => [...prev, newOfficer]);
    addLog(`Administrator generated and deployed Partner Loan Officer profile: ${officerForm.fullName} (${officerForm.institution})`);
    
    sendEmailNotification(
      officerForm.email,
      'DANA Loan Officer Portfolio Deployed',
      `Dear ${officerForm.fullName}, your banking credential for the ${officerForm.institution} Division has been initialized securely by the system Administrator.`
    );

    setOfficerForm({
      username: '',
      password: '',
      fullName: '',
      institution: 'Maybank Islamic',
      email: '',
      department: 'Corporate SME Credit Risk Division'
    });

    alert('Partner Loan Officer account deployed successfully!');
  };

  const handleLogout = () => {
    addLog('Logged out of system session');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleQuickLogin = (username, password) => {
    setLoginForm({ username, password });
    setAuthError('');
    const account = userAccounts.find(u => u.username === username && u.password === password);
    if (account) {
      if (!account.approved) {
        setAuthError('Access Denied: Your account is pending Administrator authorization.');
        return;
      }
      setCurrentRole(account.role);
      setCurrentUser(account.profile);
      setIsAuthenticated(true);
      if (account.role === 'Applicant') setActiveTab('dashboard');
      else if (account.role === 'Loan Officer') setActiveTab('review');
      else if (account.role === 'Administrator') setActiveTab('adminDashboard');
      addLog('Logged in successfully (Quick Select)', account.role, account.profile.username);
    }
  };

  const calculatePlatformFee = (amount) => {
    if (amount <= 1000) return { percent: 1, fee: amount * 0.01 };
    if (amount <= 5000) return { percent: 2, fee: amount * 0.02 };
    return { percent: 3, fee: amount * 0.03 };
  };

  const getSmartMatchingScore = (product, applicantProfile) => {
    if (!applicantProfile) return { percentage: 0, reasons: [], grade: 'No Active Session' };
    
    let score = 100;
    let reasons = [];

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

    if (newApplicationForm.requestedAmount < product.minAmount || newApplicationForm.requestedAmount > product.maxAmount) {
      score -= 20;
      reasons.push(`Requested amount RM ${newApplicationForm.requestedAmount} lies outside allowed span [RM ${product.minAmount} - RM ${product.maxAmount}].`);
    }

    return {
      percentage: Math.max(0, score),
      reasons,
      grade: score >= 80 ? 'Highly Suitable' : score >= 50 ? 'Moderate Fit' : 'High Risk Profile'
    };
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    
    const appCode = `APP-${Math.floor(100 + Math.random() * 900)}`;
    const newAppObj = {
      id: appCode,
      applicantName: currentUser.username,
      companyName: currentUser.company,
      industry: currentUser.industry,
      revenue: currentUser.revenue,
      ageYears: currentUser.ageYears,
      requestedAmount: Number(newApplicationForm.requestedAmount),
      purpose: newApplicationForm.purpose,
      status: 'Bidding Open',
      documents: [
        { name: 'SSM_Registration.pdf', size: '1.2 MB', status: 'Verified' },
        { name: 'BankStatement_6Months.pdf', size: '4.8 MB', status: 'Verified' }
      ],
      timestamp: new Date().toLocaleString()
    };

    setApplications(prev => [newAppObj, ...prev]);
    addLog(`Submitted dynamic financing application request for RM ${newApplicationForm.requestedAmount} (${appCode}) via DANA`);
    sendEmailNotification(
      currentUser.email,
      'Financing Request Dispatched on DANA',
      `Dear ${currentUser.username}, your application ${appCode} for RM ${newApplicationForm.requestedAmount} has been registered successfully.`
    );

    setNewApplicationForm({ requestedAmount: 50000, purpose: '', ssmVerified: false, bankStmtUploaded: false });
    setActiveTab('applications');
  };

  const handlePublishProduct = (e) => {
    e.preventDefault();
    const newProd = {
      id: `prod-${Date.now()}`,
      institution: currentUser.institution || 'Maybank Islamic',
      name: newProductForm.name,
      minAmount: Number(newProductForm.minAmount),
      maxAmount: Number(newProductForm.maxAmount),
      interestRate: Number(newProductForm.interestRate),
      tenureMonths: Number(newProductForm.tenureMonths),
      minRevenue: Number(newProductForm.minRevenue),
      minAgeYears: Number(newProductForm.minAgeYears),
      requirements: newProductForm.requirements,
      description: newProductForm.description
    };

    setLoanProducts(prev => [...prev, newProd]);
    addLog(`Published new financial product: "${newProductForm.name}" on DANA`);
    setNewProductForm({ name: '', minAmount: '', maxAmount: '', interestRate: '', tenureMonths: '', minRevenue: '', minAgeYears: '', requirements: '', description: '' });
    setActiveTab('products');
  };

  const handlePlaceBid = (e) => {
    e.preventDefault();
    if (!activeApplicationForBidding) return;

    const newOffer = {
      id: `OFF-${Math.floor(100 + Math.random() * 900)}`,
      applicationId: activeApplicationForBidding.id,
      institution: currentUser.institution || 'Maybank Islamic',
      amount: Number(newBidForm.amount),
      interestRate: Number(newBidForm.interestRate),
      tenure: Number(newBidForm.tenure),
      specialConditions: newBidForm.conditions,
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
      `Tailored DANA financing offer submitted for your business for RM ${newBidForm.amount} @ ${newBidForm.interestRate}% interest rate.`
    );

    setActiveApplicationForBidding(null);
    setNewBidForm({ amount: '', interestRate: '', tenure: '', conditions: '' });
    setActiveTab('review');
  };

  const handleSelectOffer = (offerId, appId) => {
    const selectedOffer = offers.find(o => o.id === offerId);
    
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

    addLog(`Applicant selected & authorized DANA contract offer ${offerId} from ${selectedOffer.institution}`);
    sendEmailNotification(
      'finance-operations@maybank.com.my',
      'DANA Financing Offer Accepted by Applicant',
      `MSME ${currentUser.username} has accepted your offer bid of RM ${selectedOffer.amount}.`
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
    setShowPaymentModal(true);
    setPaymentSuccess(false);
  };

  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
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

      addLog(`Processed DANA repayment installment of RM ${paymentData.loan.monthlyRepayment} with platform service fee RM ${paymentData.feeAmount.toFixed(2)}`);
      sendEmailNotification(
        currentUser.email,
        'DANA Repayment Transaction Receipt Successful',
        `Monthly installment of RM ${paymentData.loan.monthlyRepayment} cleared successfully. DANA Platform fee: RM ${paymentData.feeAmount.toFixed(2)}.`
      );
    }, 1500);
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

  const resetDemoData = () => {
  const confirmed = window.confirm(
    'Reset all DANA demonstration data?'
  );

  if (!confirmed) return;

  [
    'dana_applications',
    'dana_loan_products',
    'dana_offers',
    'dana_user_accounts',
    'dana_system_logs',
    'dana_sent_emails',
    'dana_platform_fees'
  ].forEach(key => localStorage.removeItem(key));

  window.location.reload();
};

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
                        onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccessMsg(''); }}
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
                          <span className="text-[10px] text-slate-500">System Monitoring & Approvals</span>
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
                    <p className="text-xs text-slate-400 mt-1">Create your secure gateway account. Registrations require Administrator authorization.</p>
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
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                          placeholder="e.g. helmirais"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Password</label>
                          <input 
                            type="password" required
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                            placeholder="Min 6 chars"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Confirm Password</label>
                          <input 
                            type="password" required
                            value={registerForm.confirmPassword}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                            placeholder="Re-enter password"
                          />
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
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                            placeholder="+6012-XXXXXXX"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Email</label>
                          <input 
                            type="email" required
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                            placeholder="helmi@utp.edu.my"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Avg. Monthly Revenue (RM)</label>
                          <input 
                            type="number" required
                            value={registerForm.revenue}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, revenue: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                            placeholder="e.g. 55000"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Business Age (Years)</label>
                          <input 
                            type="number" required
                            value={registerForm.ageYears}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, ageYears: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                            placeholder="e.g. 3"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
                    >
                      Request Registration Approval
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-400">
                      Already have an account?{' '}
                      <button 
                        onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccessMsg(''); }}
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
                      onClick={() => setActiveTab('manageAccounts')} 
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'manageAccounts' ? 'bg-slate-800 text-amber-400 border border-slate-700' : 'text-slate-400 hover:text-white'}`}
                    >
                      <UserPlus className="w-4 h-4" />
                      Manage Accounts
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
                              <span className="ml-auto font-mono text-[10px]">{email.timestamp}</span>
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
                
                {/* Tab: Dashboard Main Content view */}
                {activeTab === 'dashboard' && (
                  <>
                    {/* Welcome Card & Key Highlights */}
                    <div className="bg-gradient-to-br from-slate-950 via-slate-950 to-amber-950/20 rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
                      <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient from-amber-500/10 to-transparent pointer-events-none" />
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                            DANA: MSME Digital Financing <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">System</span>
                          </h1>
                          <p className="text-slate-400 mt-2 max-w-xl text-sm leading-relaxed">
                            Welcome back, <strong>{currentUser.username}</strong>. Explore matching schemes, request digital loans, clear installment payments, and view banking bids on your company.
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
                                      <h3 className="text-lg font-bold text-white mt-0.5">RM {loan.amount.toLocaleString()}</h3>
                                      <p className="text-xs text-slate-400 mt-1">Application Reference: <strong className="font-mono text-slate-200">{app.id}</strong></p>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-xs text-slate-400 uppercase block font-semibold">Monthly Installment</span>
                                      <span className="text-xl font-black text-amber-400">RM {loan.monthlyRepayment.toLocaleString()}</span>
                                    </div>
                                  </div>

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

                    {/* Offer Bidding System: Pending Custom Offers */}
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 shadow-md mt-8">
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
                                    <span className="bg-slate-950 text-amber-400 text-[11px] px-2.5 py-0.5 rounded-full font-bold font-mono uppercase">{app.id}</span>
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
                  </>
                )}

                {/* APPLICANT TABS: FINANCING MARKETPLACE COMPARISON */}
                {activeTab === 'marketplace' && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white">DANA Financing Marketplace Dashboard</h2>
                        <p className="text-xs text-slate-400">Explore, search, and evaluate published MSME financing structures side-by-side.</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-72">
                          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                          <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search institution or product..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {loanProducts
                        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.institution.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(product => {
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
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
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
                        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Requested Financing Capital (RM)</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-3 text-slate-500 text-sm font-bold">RM</span>
                          <input 
                            type="number"
                            required
                            value={newApplicationForm.requestedAmount}
                            onChange={(e) => setNewApplicationForm(prev => ({ ...prev, requestedAmount: Number(e.target.value) }))}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                            placeholder="50,000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Detailed Business Purpose of Funds</label>
                        <textarea 
                          required
                          value={newApplicationForm.purpose}
                          onChange={(e) => setNewApplicationForm(prev => ({ ...prev, purpose: e.target.value }))}
                          rows="3"
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 placeholder-slate-600"
                          placeholder="E.g., Purchasing raw inventory materials for upcoming government pipeline supply contract..."
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Enterprise Documentation Management</label>
                        
                        <div className="border border-dashed border-slate-800 rounded-xl p-5 text-center bg-slate-900/40 space-y-3">
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
                                onChange={(e) => setNewApplicationForm(prev => ({ ...prev, ssmVerified: e.target.checked }))}
                                className="rounded border-slate-850 text-amber-500 focus:ring-0"
                              />
                              SSM_CompanyProfile.pdf ({newApplicationForm.ssmVerified ? "Attached" : "Attach Draft"})
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 hover:bg-slate-900 transition-all">
                              <input 
                                type="checkbox" 
                                checked={newApplicationForm.bankStmtUploaded} 
                                onChange={(e) => setNewApplicationForm(prev => ({ ...prev, bankStmtUploaded: e.target.checked }))}
                                className="rounded border-slate-850 text-amber-500 focus:ring-0"
                              />
                              BankStatement_6Months.pdf ({newApplicationForm.bankStmtUploaded ? "Attached" : "Attach Draft"})
                            </label>
                          </div>
                        </div>
                      </div>

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
                    <div>
                      <h2 className="text-2xl font-bold text-white">My Submitted Requests</h2>
                      <p className="text-xs text-slate-400">Track dynamic review stages and institutional response status inside DANA.</p>
                    </div>

                    <div className="space-y-4">
                      {applications.filter(app => app.applicantName === currentUser.username).length === 0 ? (
                        <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-850">
                          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                          <p className="font-bold text-slate-400">No requests submitted yet.</p>
                          <button 
                            onClick={() => setActiveTab('apply')}
                            className="mt-3 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg"
                          >
                            Launch Application Wizard
                          </button>
                        </div>
                      ) : (
                        applications.filter(app => app.applicantName === currentUser.username).map(app => (
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

              </div>
            )}

            {/* ======================================= */}
            {/* LOAN OFFICER INTERFACE VIEW             */}
            {/* ======================================= */}
            {currentRole === 'Loan Officer' && (
              <div className="space-y-8">
                
                {/* Header / Brand context */}
                <div className="bg-gradient-to-br from-slate-950 via-slate-950 to-amber-950/20 rounded-3xl p-6 sm:p-8 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-amber-400 uppercase tracking-wider font-extrabold block mb-1">Financial Partner Console</span>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">{currentUser.username}</h1>
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

                    <div className="space-y-6">
                      {filteredApplications.map(app => (
                        <div key={app.id} className="bg-slate-950 rounded-2xl border border-slate-850 p-6 flex flex-col lg:flex-row justify-between gap-6">
                          
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

                          <div className="w-full lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-850 pt-6 lg:pt-0 lg:pl-6">
                            <div>
                              <div className="flex justify-between items-center text-xs mb-3">
                                <span className="text-slate-400 font-semibold">Requested Amount:</span>
                                <span className="font-black text-lg text-amber-400">RM {app.requestedAmount.toLocaleString()}</span>
                              </div>

                              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Clean Financing Match</span>
                                  <span className="text-[11px] font-extrabold text-emerald-400">High Suitability</span>
                                </div>
                                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500 w-[90%]" />
                                </div>
                                <p className="text-[10px] text-slate-400 leading-relaxed">
                                  Profile exceeds minimum capital rules and meets age requirements. Suitable for unsecured corporate capital line.
                                </p>
                              </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-900">
                              {app.status === 'Bidding Open' || app.status === 'Offers Received' ? (
                                <button
                                  onClick={() => {
                                    setActiveApplicationForBidding(app);
                                    setNewBidForm(prev => ({
                                      ...prev,
                                      amount: app.requestedAmount,
                                      interestRate: 3.8,
                                      tenure: 24
                                    }));
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
                    </div>

                  </div>
                )}

                {/* LOAN OFFICER TABS: PUBLISH PRODUCTS CONFIG */}
                {activeTab === 'products' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
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
                            onChange={(e) => setNewProductForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                            placeholder="E.g., Micro-Retail Expansion Fund"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Min Capital (RM)</label>
                            <input 
                              type="number" required
                              value={newProductForm.minAmount}
                              onChange={(e) => setNewProductForm(prev => ({ ...prev, minAmount: e.target.value }))}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                              placeholder="5000"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Max Capital (RM)</label>
                            <input 
                              type="number" required
                              value={newProductForm.maxAmount}
                              onChange={(e) => setNewProductForm(prev => ({ ...prev, maxAmount: e.target.value }))}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                              placeholder="100000"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Profit/Rate (% p.a.)</label>
                            <input 
                              type="number" step="0.1" required
                              value={newProductForm.interestRate}
                              onChange={(e) => setNewProductForm(prev => ({ ...prev, interestRate: e.target.value }))}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                              placeholder="3.5"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Max Tenure (Mo)</label>
                            <input 
                              type="number" required
                              value={newProductForm.tenureMonths}
                              onChange={(e) => setNewProductForm(prev => ({ ...prev, tenureMonths: e.target.value }))}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                              placeholder="24"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Min Revenue/Mo</label>
                            <input 
                              type="number" required
                              value={newProductForm.minRevenue}
                              onChange={(e) => setNewProductForm(prev => ({ ...prev, minRevenue: e.target.value }))}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                              placeholder="10000"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Min Business Age</label>
                            <input 
                              type="number" required
                              value={newProductForm.minAgeYears}
                              onChange={(e) => setNewProductForm(prev => ({ ...prev, minAgeYears: e.target.value }))}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                              placeholder="2"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Mandatory Documents required</label>
                          <input 
                            type="text" required
                            value={newProductForm.requirements}
                            onChange={(e) => setNewProductForm(prev => ({ ...prev, requirements: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                            placeholder="SSM Certificate, 3 months statements"
                          />
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
                          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-xl text-xs uppercase text-center"
                        >
                          Publish to Marketplace
                        </button>
                      </form>
                    </div>

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
                            
                            <div className="pt-3 border-t border-slate-900 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
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
              <div className="space-y-8">
                
                {activeTab === 'adminDashboard' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      
                      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 shadow-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs text-slate-400 uppercase font-semibold">Accumulated Repayments</span>
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

                      <button type="button" onClick={resetDemoData}>
  Reset Demo Data
</button>

                      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 shadow-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs text-slate-400 uppercase font-semibold">Platform Fee Income</span>
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
                            <span className="text-xs text-slate-400 uppercase font-semibold">Average Market Approval</span>
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      
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
                  </>
                )}

                {}
                {activeTab === 'manageAccounts' && (
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white">System Directory Manager</h2>
                        <p className="text-xs text-slate-400">Approve pending enterprise applicant profiles and register partnered financial officers.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: Pending Approvals list */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 shadow-md">
                          <div className="flex items-center gap-2 mb-6">
                            <ShieldAlert className="text-amber-500 w-5 h-5" />
                            <h3 className="font-bold text-white text-base">Pending MSME Applicant Sign-Ups ({userAccounts.filter(u => u.role === 'Applicant' && !u.approved).length})</h3>
                          </div>

                          {userAccounts.filter(u => u.role === 'Applicant' && !u.approved).length === 0 ? (
                            <div className="text-center py-12 text-slate-500 text-xs">
                              <ShieldCheck className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                              <p className="font-bold text-slate-400 text-sm">No Pending Authorizations</p>
                              <p className="text-slate-500 mt-1 max-w-sm mx-auto">All newly registered MSME portal applications have been audited and resolved.</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {userAccounts.filter(u => u.role === 'Applicant' && !u.approved).map(acc => (
                                <div key={acc.username} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between gap-4">
                                  <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2">
                                      <span className="bg-amber-500/10 text-amber-400 text-[10px] px-2.5 py-0.5 rounded font-black font-mono">@{acc.username}</span>
                                      <span className="text-slate-400 font-semibold">• Industry: {acc.profile.industry}</span>
                                    </div>
                                    <h4 className="font-bold text-base text-white">{acc.profile.company}</h4>
                                    <p className="text-slate-300">Contact: <strong className="text-white">{acc.profile.username}</strong> ({acc.profile.email})</p>
                                    
                                    <div className="grid grid-cols-2 gap-4 max-w-xs pt-1">
                                      <div>
                                        <span className="text-slate-500 block uppercase font-bold text-[9px]">Revenue/Mo</span>
                                        <span className="font-bold text-amber-400">RM {acc.profile.revenue.toLocaleString()}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-500 block uppercase font-bold text-[9px]">Enterprise Age</span>
                                        <span className="font-bold text-slate-300">{acc.profile.ageYears} Years Operational</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex md:flex-col justify-end gap-2.5 self-center w-full md:w-auto">
                                    <button 
                                      onClick={() => handleApproveAccount(acc.username)}
                                      className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1"
                                    >
                                      <ShieldCheck className="w-4 h-4" />
                                      Approve Account
                                    </button>
                                    <button 
                                      onClick={() => handleRejectAccount(acc.username)}
                                      className="flex-1 md:flex-none bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold px-4 py-2 rounded-lg text-xs border border-red-500/20 transition-all flex items-center justify-center gap-1"
                                    >
                                      <UserMinus className="w-4 h-4" />
                                      Decline request
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Register new Partner Loan Officer Account */}
                      <div className="lg:col-span-1 bg-slate-950 p-6 rounded-2xl border border-slate-850 h-fit space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-slate-850">
                          <UserPlus className="text-amber-500 w-5 h-5" />
                          <h3 className="font-bold text-white text-base">Register Loan Officer</h3>
                        </div>

                        <form onSubmit={handleCreateOfficer} className="space-y-4">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Select Bank Institution</label>
                            <select 
                              value={officerForm.institution}
                              onChange={(e) => setOfficerForm(prev => ({ ...prev, institution: e.target.value }))}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                            >
                              <option value="Maybank Islamic">Maybank Islamic</option>
                              <option value="SME Bank Malaysia">SME Bank Malaysia</option>
                              <option value="Bank Rakyat">Bank Rakyat</option>
                              <option value="MARA">MARA</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Corporate Officer Full Name</label>
                            <input 
                              type="text" required
                              value={officerForm.fullName}
                              onChange={(e) => setOfficerForm(prev => ({ ...prev, fullName: e.target.value }))}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                              placeholder="e.g. Aniq Ashraf"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Sign-In Username</label>
                            <input 
                              type="text" required
                              value={officerForm.username}
                              onChange={(e) => setOfficerForm(prev => ({ ...prev, username: e.target.value }))}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                              placeholder="e.g. aniq_officer"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Assigned Temporary Password</label>
                            <input 
                              type="password" required
                              value={officerForm.password}
                              onChange={(e) => setOfficerForm(prev => ({ ...prev, password: e.target.value }))}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                              placeholder="••••••••"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Officer Email Address</label>
                            <input 
                              type="email" required
                              value={officerForm.email}
                              onChange={(e) => setOfficerForm(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                              placeholder="e.g. officer@maybank.my"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Bank Department / Division</label>
                            <input 
                              type="text" required
                              value={officerForm.department}
                              onChange={(e) => setOfficerForm(prev => ({ ...prev, department: e.target.value }))}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                              placeholder="SME Credit Division"
                            />
                          </div>

                          <button 
                            type="submit"
                            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2 rounded-xl text-xs uppercase"
                          >
                            Deploy Officer Account
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* PLATFORM ADMINISTRATOR TABS: SYSTEM AUDIT LOGS */}
                {activeTab === 'logs' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">DANA Activity Logging System</h2>
                      <p className="text-xs text-slate-400">Live operational logs audit tracing transactions, authentication events, and status modifications inside DANA.</p>
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
                            {systemLogs.map(log => (
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
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

          </main>

          {/* ======================================= */}
          {/* GLOBAL OVERLAYS & SIMULATION MODALS    */}
          {/* ======================================= */}
          
          {/* 1. BANK OFFER BIDDING SIMULATOR MODAL */}
          {activeApplicationForBidding && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
                <button 
                  onClick={() => setActiveApplicationForBidding(null)}
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
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Target Offered Amount (RM)</label>
                    <input 
                      type="number" required
                      value={newBidForm.amount}
                      onChange={(e) => setNewBidForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none"
                      placeholder="50000"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Proposed Interest Rate (% p.a.)</label>
                      <input 
                        type="number" step="0.1" required
                        value={newBidForm.interestRate}
                        onChange={(e) => setNewBidForm(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none"
                        placeholder="3.8"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Repayment Period (Months)</label>
                      <input 
                        type="number" required
                        value={newBidForm.tenure}
                        onChange={(e) => setNewBidForm(prev => ({ ...prev, tenure: Number(e.target.value) }))}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none"
                        placeholder="24"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Covenants / Special Conditions</label>
                    <input 
                      type="text" required
                      value={newBidForm.conditions}
                      onChange={(e) => setNewBidForm(prev => ({ ...prev, conditions: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                      placeholder="E.g., Submission of 2026 Q2 management accounts."
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-850">
                    <button 
                      type="button"
                      onClick={() => setActiveApplicationForBidding(null)}
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

          {/* 2. PAYMENT GATEWAY INTEGRATED CHECKOUT SIMULATOR */}
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
                  <span className="text-xs text-amber-400 uppercase font-bold tracking-widest block font-mono">DANA PAY GATEWAY</span>
                  <h3 className="font-extrabold text-xl text-white mt-1">Installment Checkout</h3>
                  <p className="text-xs text-slate-400 mt-1">Direct API authorization mapping scheduled to: <strong className="text-slate-200">{paymentData.loan.institution}</strong></p>
                </div>

                {!paymentSuccess ? (
                  <div className="space-y-4">
                    <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Core Installment Principal</span>
                        <span className="font-bold text-white">RM {paymentData.loan.monthlyRepayment.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">DANA Platform Service Charge ({paymentData.feePercent}%)</span>
                        <span className="font-bold text-amber-400">+RM {paymentData.feeAmount.toFixed(2)}</span>
                      </div>

                      <div className="h-px bg-slate-850/60 my-2" />

                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-300">Total Charged to Account</span>
                        <span className="font-black text-white text-base">RM {paymentData.totalToPay.toFixed(2)}</span>
                      </div>
                    </div>

                    {isProcessingPayment ? (
                      <div className="py-6 flex flex-col items-center justify-center space-y-3 bg-slate-950/40 rounded-2xl">
                        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs text-slate-400">Authorizing secure bank direct-debit clearing token...</p>
                      </div>
                    ) : (
                      <button
                        onClick={handleProcessPayment}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl text-xs uppercase transition-all"
                      >
                        Authorize Payment Clear
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-sm">Repayment Transaction Clear</h4>
                      <p className="text-xs text-slate-400 mt-1">Outstanding DANA financing balance updated in enterprise records.</p>
                    </div>
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className="bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs px-4 py-2 rounded-lg transition-all"
                    >
                      Back to Hub
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
              <p>
                Lecturer: Ts Lt Dr Helmi B Md Rais • Universiti Teknologi Petronas (May 2026 Academic Term). All rights reserved.
              </p>
            </div>
          </footer>
        </>
      )}

    </div>
  );
}