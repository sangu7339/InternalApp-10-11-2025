
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// const HRSalaryManagement = () => {
//   // ------------------ Form state ------------------
//   const [employeeId, setEmployeeId] = useState('');
//   const [basic, setBasic] = useState('');
//   const [flexibleBenefitPlan, setFlexibleBenefitPlan] = useState('');
//   const [specialAllowance, setSpecialAllowance] = useState('');
//   const [pfContributionEmployer, setPfContributionEmployer] = useState('');
//   const [professionalTax, setProfessionalTax] = useState('');
//   const [totalCostToCompany, setTotalCostToCompany] = useState('');
//   const [bankName, setBankName] = useState('');
//   const [accountNumber, setAccountNumber] = useState('');
//   const [ifscCode, setIfscCode] = useState(''); // ✅ Added IFSC state
//   // Compliance fields
//   const [pfNumber, setPfNumber] = useState('');
//   const [uanNumber, setUanNumber] = useState('');
//   const [esiNumber, setEsiNumber] = useState('');
//   const [panNumber, setPanNumber] = useState('');
//   const [lop, setLop] = useState('');
//   // ------------------ Bonus state ------------------
//   const [bonuses, setBonuses] = useState([]);
//   const [bonusForm, setBonusForm] = useState({
//     employeeId: '',
//     incentives: '',
//     month: ''
//   });
//   const [editingBonus, setEditingBonus] = useState(null);
//   // ------------------ Data state ------------------
//   const [salaryPackages, setSalaryPackages] = useState([]);
//   const [monthlySalaries, setMonthlySalaries] = useState([]);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [activeTab, setActiveTab] = useState('salaryPackage');
//   const [loading, setLoading] = useState(false);
//   // ------------------ Filters ------------------
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterMonth, setFilterMonth] = useState('');
//   const [bonusFilterMonth, setBonusFilterMonth] = useState('');
//   const [searchPackage, setSearchPackage] = useState('');
//   const [searchMonthly, setSearchMonthly] = useState('');
//   const [searchBonus, setSearchBonus] = useState('');
//   // Create refs for scrolling
//   const salaryFormRef = useRef(null);
//   const bonusFormRef = useRef(null);
//   // Get current month in YYYY-MM format
//   const getCurrentMonth = () => {
//     const now = new Date();
//     return now.toISOString().slice(0, 7);
//   };
//   // Initialize with current month
//   const [currentMonth] = useState(getCurrentMonth());
//   const token = localStorage.getItem('token');
//   // ------------------ Fetch Data ------------------
//   const fetchSalaryPackages = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get('http://localhost:8080/api/hr/salary/all/packages', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSalaryPackages(res.data);
//     } catch (err) {
//       setMessage({ type: 'error', text: 'Error fetching salary packages' });
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const fetchMonthlySalaries = async () => {
//     try {
//       const res = await axios.get('http://localhost:8080/api/hr/salary/all/monthly', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMonthlySalaries(res.data);
//     } catch (err) {
//       setMessage({ type: 'error', text: 'Error fetching monthly salaries' });
//       console.error(err);
//     }
//   };
//   const fetchBonuses = async () => {
//     try {
//       const res = await axios.get('http://localhost:8080/api/hr/bonus/all', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBonuses(res.data);
//     } catch (err) {
//       setMessage({ type: 'error', text: 'Error fetching bonuses' });
//       console.error(err);
//     }
//   };
//   const fetchBonusesByMonth = async (monthYear) => {
//     try {
//       const res = await axios.get(`http://localhost:8080/api/hr/bonus/month?monthYear=${monthYear}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBonuses(res.data);
//     } catch (err) {
//       setMessage({ type: 'error', text: 'Error fetching bonuses by month' });
//       console.error(err);
//     }
//   };
//   useEffect(() => {
//     fetchSalaryPackages();
//     fetchMonthlySalaries();
//     fetchBonuses();
//     // Set default filters to current month
//     setFilterMonth(currentMonth);
//     setBonusFilterMonth(currentMonth);
//   }, [currentMonth]);
//   // ------------------ Input validation ------------------
//   const handleNumberInput = (value, setter) => {
//     if (value === '' || /^\d*\.?\d*$/.test(value)) setter(value);
//   };
//   const handleAccountNumberInput = (value) => {
//     if (value === '' || /^\d*$/.test(value)) setAccountNumber(value);
//   };
//   // FIXED: Handle month input to prevent more than 4 digit years
//   const handleMonthInput = (value, setter) => {
//     // Basic validation for YYYY-MM format
//     if (value === '' || /^\d{4}-\d{2}$/.test(value) || /^\d{0,4}-?\d{0,2}$/.test(value)) {
//       setter(value);
//     }
//   };
//   // ------------------ Salary Package Submit ------------------
//   const handleSalaryPackageSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
   
//     const payload = {
//       basic: parseFloat(basic) || 0,
//       flexibleBenefitPlan: parseFloat(flexibleBenefitPlan) || 0,
//       specialAllowance: parseFloat(specialAllowance) || 0,
//       pfContributionEmployer: parseFloat(pfContributionEmployer) || 0,
//       professionalTax: parseFloat(professionalTax) || 0,
//       totalCostToCompany: parseFloat(totalCostToCompany) || 0,
//       bankName,
//       accountNumber,
//       ifscCode, // ✅ Added IFSC to payload
//       pfNumber,
//       uanNumber,
//       esiNumber,
//       panNumber,
//       lop: parseFloat(lop) || 0,
//     };
//     try {
//       await axios.post(
//         `http://localhost:8080/api/hr/salary/package?employeeId=${employeeId}`,
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMessage({ type: 'success', text: `Salary package saved for employee ${employeeId}` });
//       resetForm();
//       fetchSalaryPackages();
//     } catch (err) {
//       setMessage({ type: 'error', text: 'Error saving salary package' });
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const resetForm = () => {
//     setEmployeeId('');
//     setBasic('');
//     setFlexibleBenefitPlan('');
//     setSpecialAllowance('');
//     setPfContributionEmployer('');
//     setProfessionalTax('');
//     setTotalCostToCompany('');
//     setBankName('');
//     setAccountNumber('');
//     setIfscCode(''); // ✅ Added IFSC reset
//     setPfNumber('');
//     setUanNumber('');
//     setEsiNumber('');
//     setPanNumber('');
//     setLop('');
//   };
//   // FIXED: Enhanced scroll functionality for edit package
//   const handleEditPackage = (pkg) => {
//     setEmployeeId(pkg.employee.employeeId);
//     setBasic(pkg.basic.toString());
//     setFlexibleBenefitPlan(pkg.flexibleBenefitPlan.toString());
//     setSpecialAllowance(pkg.specialAllowance.toString());
//     setPfContributionEmployer(pkg.pfContributionEmployer.toString());
//     setProfessionalTax(pkg.professionalTax.toString());
//     setTotalCostToCompany(pkg.totalCostToCompany.toString());
//     setBankName(pkg.bankName || '');
//     setAccountNumber(pkg.accountNumber || '');
//     setIfscCode(pkg.ifscCode || ''); // ✅ Added IFSC set
//     setPfNumber(pkg.pfNumber || '');
//     setUanNumber(pkg.uanNumber || '');
//     setEsiNumber(pkg.esiNumber || '');
//     setPanNumber(pkg.panNumber || '');
//     setLop(pkg.lop?.toString() || '');
   
//     setActiveTab('salaryPackage');
   
//     // Scroll to form after a short delay to ensure DOM update
//     setTimeout(() => {
//       salaryFormRef.current?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start'
//       });
//     }, 100);
//   };
//   // ------------------ Bonus Management ------------------
//   const handleBonusSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
   
//     const payload = {
//       incentives: parseFloat(bonusForm.incentives) || 0,
//       startDate: `${bonusForm.month}-01`,
//       month: bonusForm.month,
//     };
//     try {
//       if (editingBonus) {
//         await axios.put(
//           `http://localhost:8080/api/hr/bonus/update/${editingBonus.id}`,
//           { incentives: payload.incentives },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setMessage({ type: 'success', text: 'Bonus updated successfully' });
//       } else {
//         await axios.post(
//           `http://localhost:8080/api/hr/bonus/add/${bonusForm.employeeId}`,
//           payload,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setMessage({ type: 'success', text: 'Bonus added successfully' });
//       }
//       resetBonusForm();
//       fetchBonuses();
//     } catch (err) {
//       setMessage({ type: 'error', text: 'Error saving bonus' });
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // FIXED: Enhanced scroll functionality for edit bonus
//   const handleEditBonus = (bonus) => {
//     setBonusForm({
//       employeeId: bonus.employee.employeeId,
//       incentives: bonus.incentives.toString(),
//       month: bonus.month
//     });
//     setEditingBonus(bonus);
//     setActiveTab('bonusManagement');
   
//     // Scroll to form after a short delay to ensure DOM update
//     setTimeout(() => {
//       bonusFormRef.current?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start'
//       });
//     }, 100);
//   };
//   const handleDeleteBonus = async (bonusId) => {
//     if (window.confirm('Are you sure you want to delete this bonus?')) {
//       setLoading(true);
//       try {
//         await axios.delete(`http://localhost:8080/api/hr/bonus/delete/${bonusId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setMessage({ type: 'success', text: 'Bonus deleted successfully' });
//         fetchBonuses();
//       } catch (err) {
//         setMessage({ type: 'error', text: 'Error deleting bonus' });
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };
//   const resetBonusForm = () => {
//     setBonusForm({
//       employeeId: '',
//       incentives: '',
//       month: ''
//     });
//     setEditingBonus(null);
//   };
//   const handleBonusFilter = () => {
//     if (bonusFilterMonth) {
//       fetchBonusesByMonth(bonusFilterMonth);
//     } else {
//       fetchBonuses();
//     }
//   };
//   // ------------------ Scheduler & Mark Paid ------------------
//   const handleGenerateMonthlySalary = async () => {
//     setLoading(true);
//     try {
//       await axios.post(`http://localhost:8080/api/hr/salary/run-scheduler`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setMessage({ type: 'success', text: 'Salary scheduler executed successfully' });
//       fetchMonthlySalaries();
//     } catch (err) {
//       setMessage({ type: 'error', text: 'Error running salary scheduler' });
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleMarkSalaryPaid = async (id) => {
//     setLoading(true);
//     try {
//       await axios.put(`http://localhost:8080/api/hr/salary/${id}/markpaid`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setMessage({ type: 'success', text: 'Salary marked as PAID' });
//       fetchMonthlySalaries();
//     } catch (err) {
//       setMessage({ type: 'error', text: 'Error marking salary as paid' });
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // ------------------ Filtering ------------------
//   const filteredPackages = salaryPackages.filter(
//     pkg =>
//       (pkg.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//        pkg.employee.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
//       (pkg.employee.employeeId.toLowerCase().includes(searchPackage.toLowerCase()) ||
//        pkg.employee.name.toLowerCase().includes(searchPackage.toLowerCase()))
//   );
//   const filteredMonthlySalaries = monthlySalaries.filter(
//     ms =>
//       (ms.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//        ms.employee.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
//       (ms.employee.employeeId.toLowerCase().includes(searchMonthly.toLowerCase()) ||
//        ms.employee.name.toLowerCase().includes(searchMonthly.toLowerCase()) ||
//        ms.month.includes(searchMonthly)) &&
//       (!filterMonth || ms.month === filterMonth)
//   );
//   const filteredBonuses = bonuses.filter(
//     bonus =>
//       (bonus.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//        bonus.employee.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
//       (bonus.employee.employeeId.toLowerCase().includes(searchBonus.toLowerCase()) ||
//        bonus.employee.name.toLowerCase().includes(searchBonus.toLowerCase()) ||
//        bonus.month.includes(searchBonus)) &&
//       (!bonusFilterMonth || bonus.month === bonusFilterMonth)
//   );
//   // Get unique months for dropdowns
//   const getUniqueMonths = (data, monthField) => {
//     const months = [...new Set(data.map(item => item[monthField]))].sort().reverse();
//     return months;
//   };
//   const salaryMonths = getUniqueMonths(monthlySalaries, 'month');
//   const bonusMonths = getUniqueMonths(bonuses, 'month');
//   // Calculate totals for current month
//   const currentMonthSalaries = monthlySalaries.filter(ms => ms.month === currentMonth);
//   const currentMonthBonuses = bonuses.filter(bonus => bonus.month === currentMonth);
 
//   const totalMonthlySalary = filteredMonthlySalaries.reduce((sum, ms) => sum + (ms.netSalary || 0), 0);
//   const totalBonuses = filteredBonuses.reduce((sum, bonus) => sum + bonus.incentives, 0);
 
//   // FIXED: Proper status checking from backend
//   const pendingSalaries = filteredMonthlySalaries.filter(ms => {
//     const status = ms.status ? ms.status.toUpperCase() : 'PENDING';
//     return status === 'PENDING' || status === 'UNPAID' || status === 'DUE';
//   }).length;
//   const paidSalaries = filteredMonthlySalaries.filter(ms => {
//     const status = ms.status ? ms.status.toUpperCase() : '';
//     return status === 'PAID' || status === 'COMPLETED' || status === 'PROCESSED';
//   }).length;
//   // Helper function to check if salary is pending
//   const isSalaryPending = (salary) => {
//     if (!salary.status) return true;
//     const status = salary.status.toUpperCase();
//     return status === 'PENDING' || status === 'UNPAID' || status === 'DUE';
//   };
//   // Helper function to check if salary is paid
//   const isSalaryPaid = (salary) => {
//     if (!salary.status) return false;
//     const status = salary.status.toUpperCase();
//     return status === 'PAID' || status === 'COMPLETED' || status === 'PROCESSED';
//   };
//   // Get status display text
//   const getStatusDisplay = (salary) => {
//     if (!salary.status) return 'PENDING';
//     const status = salary.status.toUpperCase();
   
//     if (status === 'PAID' || status === 'COMPLETED' || status === 'PROCESSED') {
//       return 'PAID';
//     }
//     if (status === 'PENDING' || status === 'UNPAID' || status === 'DUE') {
//       return 'PENDING';
//     }
//     return status;
//   };
//   // Calculate current month totals
//   const currentMonthSalaryTotal = currentMonthSalaries.reduce((sum, ms) => sum + (ms.netSalary || 0), 0);
//   const currentMonthBonusTotal = currentMonthBonuses.reduce((sum, bonus) => sum + bonus.incentives, 0);
//   // ------------------ Styles ------------------
//   const styles = {
//     container: {
//       minHeight: '100vh',
//       backgroundColor: '#f8fafc',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
//     },
   
//     // Header Styles
//     header: {
//       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//       color: 'white',
//       padding: '2rem 0',
//       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
//     },
//     headerContent: {
//       maxWidth: '1200px',
//       margin: '0 auto',
//       padding: '0 2rem'
//     },
//     headerMain: {
//       marginBottom: '2rem'
//     },
//     headerTitle: {
//       fontSize: '2.5rem',
//       fontWeight: '700',
//       margin: '0 0 0.5rem 0',
//       background: 'linear-gradient(45deg, #fff, #e0e7ff)',
//       WebkitBackgroundClip: 'text',
//       WebkitTextFillColor: 'transparent'
//     },
//     headerSubtitle: {
//       fontSize: '1.1rem',
//       opacity: 0.9,
//       margin: 0
//     },
//     headerStats: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//       gap: '1rem'
//     },
//     statCard: {
//       background: 'rgba(255, 255, 255, 0.1)',
//       backdropFilter: 'blur(10px)',
//       padding: '1.5rem',
//       borderRadius: '12px',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '1rem',
//       border: '1px solid rgba(255, 255, 255, 0.2)'
//     },
//     statIcon: {
//       fontSize: '2rem'
//     },
//     statNumber: {
//       fontSize: '1.5rem',
//       fontWeight: '700'
//     },
//     headerStatLabel: {
//       fontSize: '0.9rem',
//       opacity: 0.8
//     },
//     // Tab Styles
//     tabContainer: {
//       background: 'white',
//       borderBottom: '1px solid #e2e8f0',
//       position: 'sticky',
//       top: 0,
//       zIndex: 100
//     },
//     tabs: {
//       maxWidth: '1200px',
//       margin: '0 auto',
//       padding: '0 2rem',
//       display: 'flex',
//       gap: '0'
//     },
//     tab: {
//       padding: '1rem 1.5rem',
//       background: 'none',
//       border: 'none',
//       borderBottom: '3px solid transparent',
//       cursor: 'pointer',
//       fontSize: '0.9rem',
//       fontWeight: '500',
//       color: '#64748b',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '0.5rem',
//       transition: 'all 0.2s ease'
//     },
//     activeTab: {
//       color: '#6366f1',
//       borderBottomColor: '#6366f1',
//       background: '#f8fafc'
//     },
//     tabIcon: {
//       fontSize: '1.1rem'
//     },
//     // Main Content
//     mainContent: {
//       maxWidth: '1200px',
//       margin: '0 auto',
//       padding: '2rem'
//     },
//     // Search Section
//     searchSection: {
//       marginBottom: '2rem'
//     },
//     searchContainer: {
//       display: 'flex',
//       gap: '1rem',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       flexWrap: 'wrap'
//     },
//     searchInputContainer: {
//       position: 'relative',
//       flex: '1',
//       minWidth: '300px'
//     },
//     searchIcon: {
//       position: 'absolute',
//       left: '12px',
//       top: '50%',
//       transform: 'translateY(-50%)',
//       color: '#64748b'
//     },
//     searchInput: {
//       width: '100%',
//       padding: '0.75rem 1rem 0.75rem 2.5rem',
//       border: '1px solid #e2e8f0',
//       borderRadius: '8px',
//       fontSize: '0.9rem',
//       background: 'white',
//       boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
//     },
//     filterGroup: {
//       display: 'flex',
//       gap: '0.5rem',
//       alignItems: 'center'
//     },
//     filterSelect: {
//       padding: '0.75rem 1rem',
//       border: '1px solid #e2e8f0',
//       borderRadius: '8px',
//       background: 'white',
//       fontSize: '0.9rem'
//     },
//     runPayrollButton: {
//       background: 'linear-gradient(135deg, #10b981, #059669)',
//       color: 'white',
//       border: 'none',
//       padding: '0.75rem 1.5rem',
//       borderRadius: '8px',
//       fontWeight: '600',
//       cursor: 'pointer',
//       fontSize: '0.9rem',
//       boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
//     },
//     // Message Styles
//     message: {
//       padding: '1rem 1.5rem',
//       borderRadius: '8px',
//       marginBottom: '2rem',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '0.5rem',
//       fontSize: '0.9rem',
//       fontWeight: '500'
//     },
//     successMessage: {
//       background: '#dcfce7',
//       color: '#166534',
//       border: '1px solid #bbf7d0'
//     },
//     errorMessage: {
//       background: '#fee2e2',
//       color: '#991b1b',
//       border: '1px solid #fecaca'
//     },
//     messageClose: {
//       background: 'none',
//       border: 'none',
//       fontSize: '1.2rem',
//       cursor: 'pointer',
//       marginLeft: 'auto'
//     },
//     // Loading Overlay
//     loadingOverlay: {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       background: 'rgba(0, 0, 0, 0.5)',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       color: 'white',
//       zIndex: 1000
//     },
//     loadingSpinner: {
//       width: '40px',
//       height: '40px',
//       border: '4px solid #f3f3f3',
//       borderTop: '4px solid #6366f1',
//       borderRadius: '50%',
//       animation: 'spin 1s linear infinite',
//       marginBottom: '1rem'
//     },
//     // Tab Content
//     tabContent: {
//       animation: 'fadeIn 0.3s ease'
//     },
//     // Form Styles
//     formSection: {
//       marginBottom: '2rem'
//     },
//     formCard: {
//       background: 'white',
//       padding: '2rem',
//       borderRadius: '12px',
//       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
//       border: '1px solid #e2e8f0'
//     },
//     formTitle: {
//       fontSize: '1.25rem',
//       fontWeight: '600',
//       marginBottom: '1.5rem',
//       color: '#1e293b'
//     },
//     form: {
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '1.5rem'
//     },
//     formGrid: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//       gap: '1.5rem'
//     },
//     formRow: {
//       display: 'flex',
//       gap: '1rem',
//       flexWrap: 'wrap'
//     },
//     formGroup: {
//       flex: '1',
//       minWidth: '200px'
//     },
//     label: {
//       display: 'block',
//       marginBottom: '0.5rem',
//       fontWeight: '500',
//       color: '#374151',
//       fontSize: '0.9rem'
//     },
//     input: {
//       width: '100%',
//       padding: '0.75rem 1rem',
//       border: '1px solid #d1d5db',
//       borderRadius: '8px',
//       fontSize: '0.9rem',
//       transition: 'all 0.2s ease',
//       boxSizing: 'border-box'
//     },
//     // FIXED: Month input with max length constraint
//     monthInput: {
//       width: '100%',
//       padding: '0.75rem 1rem',
//       border: '1px solid #d1d5db',
//       borderRadius: '8px',
//       fontSize: '0.9rem',
//       transition: 'all 0.2s ease',
//       boxSizing: 'border-box',
//       maxLength: 7 // YYYY-MM format (7 characters)
//     },
//     salaryBreakdown: {
//       gridColumn: '1 / -1'
//     },
//     breakdownTitle: {
//       fontSize: '1.1rem',
//       fontWeight: '600',
//       marginBottom: '1rem',
//       color: '#1e293b'
//     },
//     breakdownGrid: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//       gap: '1rem'
//     },
//     formActions: {
//       display: 'flex',
//       gap: '1rem',
//       marginTop: '1rem'
//     },
//     primaryButton: {
//       background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
//       color: 'white',
//       border: 'none',
//       padding: '0.75rem 1.5rem',
//       borderRadius: '8px',
//       fontWeight: '600',
//       cursor: 'pointer',
//       fontSize: '0.9rem',
//       boxShadow: '0 2px 4px rgba(99, 102, 241, 0.3)',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '0.5rem'
//     },
//     secondaryButton: {
//       background: '#6b7280',
//       color: 'white',
//       border: 'none',
//       padding: '0.75rem 1.5rem',
//       borderRadius: '8px',
//       fontWeight: '600',
//       cursor: 'pointer',
//       fontSize: '0.9rem',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '0.5rem'
//     },
//     // Table Styles
//     tableSection: {
//       background: 'white',
//       padding: '2rem',
//       borderRadius: '12px',
//       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
//       border: '1px solid #e2e8f0',
//       marginBottom: '2rem'
//     },
//     sectionTitle: {
//       fontSize: '1.25rem',
//       fontWeight: '600',
//       marginBottom: '1.5rem',
//       color: '#1e293b'
//     },
//     tableHeader: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginBottom: '1.5rem',
//       flexWrap: 'wrap',
//       gap: '1rem'
//     },
//     tableFilters: {
//       display: 'flex',
//       gap: '0.5rem',
//       alignItems: 'center'
//     },
//     filterInput: {
//       padding: '0.5rem 1rem',
//       border: '1px solid #e2e8f0',
//       borderRadius: '6px',
//       fontSize: '0.9rem'
//     },
//     filterButton: {
//       background: '#3b82f6',
//       color: 'white',
//       border: 'none',
//       padding: '0.5rem 1rem',
//       borderRadius: '6px',
//       cursor: 'pointer',
//       fontSize: '0.9rem'
//     },
//     clearButton: {
//       background: '#6b7280',
//       color: 'white',
//       border: 'none',
//       padding: '0.5rem 1rem',
//       borderRadius: '6px',
//       cursor: 'pointer',
//       fontSize: '0.9rem'
//     },
//     tableContainer: {
//       overflowX: 'auto',
//       borderRadius: '8px',
//       border: '1px solid #e2e8f0'
//     },
//     table: {
//       width: '100%',
//       borderCollapse: 'collapse',
//       fontSize: '0.9rem'
//     },
//     th: {
//       background: '#f8fafc',
//       padding: '1rem',
//       textAlign: 'left',
//       fontWeight: '600',
//       color: '#374151',
//       borderBottom: '1px solid #e2e8f0',
//       whiteSpace: 'nowrap'
//     },
//     tr: {
//       borderBottom: '1px solid #f1f5f9',
//       transition: 'background 0.2s ease'
//     },
//     td: {
//       padding: '1rem',
//       borderBottom: '1px solid #f1f5f9',
//       verticalAlign: 'middle'
//     },
//     // Component Specific Styles
//     employeeInfo: {
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '0.25rem'
//     },
//     employeeId: {
//       fontWeight: '600',
//       color: '#1e293b',
//       fontSize: '0.85rem'
//     },
//     employeeName: {
//       color: '#64748b',
//       fontSize: '0.8rem'
//     },
//     bankInfo: {
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '0.25rem'
//     },
//     accountNumber: {
//       fontFamily: 'monospace',
//       fontSize: '0.8rem',
//       color: '#64748b'
//     },
//     ctc: {
//       fontWeight: '600',
//       color: '#059669'
//     },
//     bonusAmount: {
//       fontWeight: '600',
//       color: '#d97706'
//     },
//     monthBadge: {
//       background: '#eff6ff',
//       color: '#1d4ed8',
//       padding: '0.25rem 0.5rem',
//       borderRadius: '6px',
//       fontSize: '0.8rem',
//       fontWeight: '500',
//       display: 'inline-block'
//     },
//     statusBadge: {
//       padding: '0.25rem 0.75rem',
//       borderRadius: '9999px',
//       fontSize: '0.8rem',
//       fontWeight: '500',
//       display: 'inline-block'
//     },
//     pendingBadge: {
//       background: '#fef3c7',
//       color: '#d97706'
//     },
//     paidBadge: {
//       background: '#d1fae5',
//       color: '#059669'
//     },
//     actionButtons: {
//       display: 'flex',
//       gap: '0.5rem'
//     },
//     editButton: {
//       background: '#fbbf24',
//       color: '#78350f',
//       border: 'none',
//       padding: '0.5rem 0.75rem',
//       borderRadius: '6px',
//       cursor: 'pointer',
//       fontSize: '0.8rem',
//       fontWeight: '500'
//     },
//     deleteButton: {
//       background: '#ef4444',
//       color: 'white',
//       border: 'none',
//       padding: '0.5rem 0.75rem',
//       borderRadius: '6px',
//       cursor: 'pointer',
//       fontSize: '0.8rem',
//       fontWeight: '500'
//     },
//     markPaidButton: {
//       background: '#10b981',
//       color: 'white',
//       border: 'none',
//       padding: '0.5rem 1rem',
//       borderRadius: '6px',
//       cursor: 'pointer',
//       fontSize: '0.8rem',
//       fontWeight: '500'
//     },
//     deduction: {
//       color: '#ef4444',
//       fontWeight: '500'
//     },
//     netSalary: {
//       fontWeight: '700',
//       color: '#059669',
//       fontSize: '0.95rem'
//     },
//     // Payroll Overview
//     payrollOverview: {
//       background: 'white',
//       padding: '2rem',
//       borderRadius: '12px',
//       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
//       border: '1px solid #e2e8f0'
//     },
//     overviewHeader: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginBottom: '2rem',
//       flexWrap: 'wrap',
//       gap: '1rem'
//     },
//     overviewStats: {
//       display: 'flex',
//       gap: '2rem'
//     },
//     overviewStat: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center'
//     },
//     overviewStatValue: {
//       fontSize: '1.5rem',
//       fontWeight: '700',
//       color: '#1e293b'
//     },
//     overviewStatLabel: {
//       fontSize: '0.8rem',
//       color: '#64748b',
//       marginTop: '0.25rem'
//     },
//     // Reports
//     reportsGrid: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//       gap: '2rem'
//     },
//     reportCard: {
//       background: 'white',
//       padding: '1.5rem',
//       borderRadius: '12px',
//       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
//       border: '1px solid #e2e8f0'
//     },
//     reportTitle: {
//       fontSize: '1.1rem',
//       fontWeight: '600',
//       marginBottom: '1rem',
//       color: '#1e293b'
//     },
//     reportContent: {
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '1rem'
//     },
//     reportItem: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '0.75rem 0',
//       borderBottom: '1px solid #f1f5f9'
//     },
//     quickActionButton: {
//       background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
//       color: 'white',
//       border: 'none',
//       padding: '0.75rem 1rem',
//       borderRadius: '8px',
//       cursor: 'pointer',
//       fontSize: '0.9rem',
//       fontWeight: '500',
//       textAlign: 'center'
//     },
//     // Month Selector
//     monthSelector: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '1rem',
//       marginBottom: '1rem',
//       flexWrap: 'wrap'
//     },
//     monthButton: {
//       padding: '0.5rem 1rem',
//       border: '1px solid #e2e8f0',
//       borderRadius: '6px',
//       background: 'white',
//       cursor: 'pointer',
//       fontSize: '0.9rem',
//       transition: 'all 0.2s ease'
//     },
//     activeMonthButton: {
//       background: '#6366f1',
//       color: 'white',
//       borderColor: '#6366f1'
//     },
//     // No Data
//     noData: {
//       textAlign: 'center',
//       padding: '3rem',
//       color: '#64748b',
//       fontSize: '1rem'
//     }
//   };
//   return (
//     <div style={styles.container}>
//       {/* Navigation Tabs */}
//       <div style={styles.tabContainer}>
//         <div style={styles.tabs}>
//           {[
//             { id: 'salaryPackage', label: '💼 Salary Package', icon: '📋' },
//             { id: 'bonusManagement', label: '🎯 Bonus Management', icon: '💰' },
//             { id: 'payroll', label: '📊 Payroll Overview', icon: '📈' },
//             { id: 'reports', label: '📋 Salary Reports', icon: '📄' }
//           ].map(tab => (
//             <button
//               key={tab.id}
//               style={{
//                 ...styles.tab,
//                 ...(activeTab === tab.id ? styles.activeTab : {})
//               }}
//               onClick={() => setActiveTab(tab.id)}
//             >
//               <span style={styles.tabIcon}>{tab.icon}</span>
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>
//       {/* Main Content */}
//       <div style={styles.mainContent}>
//         {/* Search and Filters */}
//         <div style={styles.searchSection}>
//           <div style={styles.searchContainer}>
//             <div style={styles.searchInputContainer}>
//               {/* Global search removed as per requirement */}
//             </div>
//             <div style={styles.filterGroup}>
//               <button
//                 onClick={handleGenerateMonthlySalary}
//                 style={styles.runPayrollButton}
//                 disabled={loading}
//               >
//                 {loading ? '⏳' : '⚡'} Run Payroll
//               </button>
//             </div>
//           </div>
//         </div>
//         {/* Message Alert */}
//         {message.text && (
//           <div style={{
//             ...styles.message,
//             ...(message.type === 'success' ? styles.successMessage : styles.errorMessage)
//           }}>
//             <span style={styles.messageIcon}>
//               {message.type === 'success' ? '✅' : '❌'}
//             </span>
//             {message.text}
//             <button onClick={() => setMessage({ type: '', text: '' })} style={styles.messageClose}>×</button>
//           </div>
//         )}
//         {/* Loading Overlay */}
//         {loading && (
//           <div style={styles.loadingOverlay}>
//             <div style={styles.loadingSpinner}></div>
//             <p>Processing...</p>
//           </div>
//         )}
//         {/* Salary Package Tab */}
//         {activeTab === 'salaryPackage' && (
//           <div style={styles.tabContent}>
//             <div style={styles.formSection} ref={salaryFormRef}>
//               <div style={styles.formCard}>
//                 <h3 style={styles.formTitle}>
//                   {employeeId ? '✏️ Update Salary Package' : '➕ Create Salary Package'}
//                 </h3>
//                 <form onSubmit={handleSalaryPackageSubmit} style={styles.form}>
//                   <div style={styles.formGrid}>
//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>Employee ID *</label>
//                       <input
//                         type="text"
//                         value={employeeId}
//                         onChange={e => setEmployeeId(e.target.value)}
//                         required
//                         style={styles.input}
//                         placeholder="Enter employee ID"
//                       />
//                     </div>
                   
//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>Bank Details</label>
//                       <input
//                         type="text" required
//                         value={bankName}
//                         onChange={e => setBankName(e.target.value)}
//                         style={styles.input}
//                         placeholder="Bank name"
//                       />
//                       <input
//                         type="text" required
//                         value={accountNumber}
//                         onChange={e => handleAccountNumberInput(e.target.value)}
//                         style={{...styles.input, marginTop: '8px'}}
//                         placeholder="Account number"
//                       />
//                       <input // ✅ Added IFSC input
//                         type="text" required
//                         value={ifscCode}
//                         onChange={e => setIfscCode(e.target.value)}
//                         style={{...styles.input, marginTop: '8px'}}
//                         placeholder="IFSC Code"
//                       />
//                     </div>
//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>Compliance Details</label>
//                       <input type="text" value={pfNumber} onChange={e => setPfNumber(e.target.value)} style={styles.input} placeholder="PF Number"/>
//                       <input type="text" value={uanNumber} onChange={e => setUanNumber(e.target.value)} style={{...styles.input, marginTop: '8px'}} placeholder="UAN Number"/>
//                       <input type="text" value={esiNumber} onChange={e => setEsiNumber(e.target.value)} style={{...styles.input, marginTop: '8px'}} placeholder="ESI Number"/>
//                       <input type="text" value={panNumber} onChange={e => setPanNumber(e.target.value)} style={{...styles.input, marginTop: '8px'}} placeholder="PAN Number"/>
//                     </div>
//                     <div style={styles.salaryBreakdown}>
//                       <h4 style={styles.breakdownTitle}>Salary Breakdown</h4>
//                       <div style={styles.breakdownGrid}>
//                         <div style={styles.formGroup}>
//                           <label style={styles.label}>Basic Salary</label>
//                           <input type="text" value={basic} onChange={e => handleNumberInput(e.target.value, setBasic)} style={styles.input}/>
//                         </div>
//                         <div style={styles.formGroup}>
//                           <label style={styles.label}>HRA</label>
//                           <input type="text" value={flexibleBenefitPlan} onChange={e => handleNumberInput(e.target.value, setFlexibleBenefitPlan)} style={styles.input}/>
//                         </div>
//                         <div style={styles.formGroup}>
//                           <label style={styles.label}>Special Allowance</label>
//                           <input type="text" value={specialAllowance} onChange={e => handleNumberInput(e.target.value, setSpecialAllowance)} style={styles.input}/>
//                         </div>
//                         <div style={styles.formGroup}>
//                           <label style={styles.label}>PF Contribution</label>
//                           <input type="text" value={pfContributionEmployer} onChange={e => handleNumberInput(e.target.value, setPfContributionEmployer)} style={styles.input}/>
//                         </div>
//                         <div style={styles.formGroup}>
//                           <label style={styles.label}>Professional Tax</label>
//                           <input type="text" value={professionalTax} onChange={e => handleNumberInput(e.target.value, setProfessionalTax)} style={styles.input}/>
//                         </div>
//                         <div style={styles.formGroup}>
//                           <label style={styles.label}>LOP Days</label>
//                           <input type="text" value={lop} onChange={e => handleNumberInput(e.target.value, setLop)} style={styles.input}/>
//                         </div>
//                         <div style={styles.formGroup}>
//                           <label style={styles.label}>Total CTC</label>
//                           <input type="text" value={totalCostToCompany} onChange={e => handleNumberInput(e.target.value, setTotalCostToCompany)} style={styles.input}/>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div style={styles.formActions}>
//                     <button type="submit" style={styles.primaryButton} disabled={loading}>
//                       {loading ? '⏳' : '💾'} {employeeId ? 'Update' : 'Create'} Salary Package
//                     </button>
//                     <button type="button" onClick={resetForm} style={styles.secondaryButton}>
//                       🗑️ Clear Form
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//             {/* Salary Packages Table */}
//             <div style={styles.tableSection}>
//               <h3 style={styles.sectionTitle}>📋 Salary Packages</h3>
//               <input
//                 type="text"
//                 placeholder="Search in salary packages..."
//                 value={searchPackage}
//                 onChange={e => setSearchPackage(e.target.value)}
//                 style={{ ...styles.filterInput, marginBottom: '1rem' }}
//               />
//               <div style={styles.tableContainer}>
//                 <table style={styles.table}>
//                   <thead>
//                     <tr>
//                       <th style={styles.th}>Employee</th>
//                       <th style={styles.th}>Bank Details</th>
//                       <th style={styles.th}>Basic</th>
//                       <th style={styles.th}>HRA</th>
//                       <th style={styles.th}>Allowance</th>
//                       <th style={styles.th}>CTC</th>
//                       <th style={styles.th}>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredPackages.map(pkg => (
//                       <tr key={pkg.id} style={styles.tr}>
//                         <td style={styles.td}>
//                           <div style={styles.employeeInfo}>
//                             <div style={styles.employeeId}>{pkg.employee.employeeId}</div>
//                             <div style={styles.employeeName}>{pkg.employee.name}</div>
//                           </div>
//                         </td>
//                         <td style={styles.td}>
//                           <div style={styles.bankInfo}>
//                             <div>{pkg.bankName || '-'}</div>
//                             <div style={styles.accountNumber}>{pkg.accountNumber || '-'}</div>
//                             <div style={styles.accountNumber}>{pkg.ifscCode || '-'}</div> {/* ✅ Added IFSC display */}
//                           </div>
//                         </td>
//                         <td style={styles.td}>₹{pkg.basic.toLocaleString()}</td>
//                         <td style={styles.td}>₹{pkg.flexibleBenefitPlan.toLocaleString()}</td>
//                         <td style={styles.td}>₹{pkg.specialAllowance.toLocaleString()}</td>
//                         <td style={styles.td}>
//                           <div style={styles.ctc}>₹{pkg.totalCostToCompany.toLocaleString()}</div>
//                         </td>
//                         <td style={styles.td}>
//                           <button
//                             onClick={() => handleEditPackage(pkg)}
//                             style={styles.editButton}
//                           >
//                             ✏️ Edit
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 {filteredPackages.length === 0 && (
//                   <div style={styles.noData}>
//                     📝 No salary packages found
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//         {/* Bonus Management Tab */}
//         {activeTab === 'bonusManagement' && (
//           <div style={styles.tabContent}>
//             <div style={styles.formSection} ref={bonusFormRef}>
//               <div style={styles.formCard}>
//                 <h3 style={styles.formTitle}>
//                   {editingBonus ? '✏️ Update Bonus' : '➕ Add Bonus/Incentives'}
//                 </h3>
//                 <form onSubmit={handleBonusSubmit} style={styles.form}>
//                   <div style={styles.formRow}>
//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>Employee ID *</label>
//                       <input
//                         type="text"
//                         value={bonusForm.employeeId}
//                         onChange={e => setBonusForm({...bonusForm, employeeId: e.target.value})}
//                         required
//                         style={styles.input}
//                       />
//                     </div>
//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>Incentives Amount *</label>
//                       <input
//                         type="text"
//                         value={bonusForm.incentives}
//                         onChange={e => handleNumberInput(e.target.value, (val) => setBonusForm({...bonusForm, incentives: val}))}
//                         required
//                         style={styles.input}
//                       />
//                     </div>
//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>Month *</label>
//                       <input
//                         type="month"
//                         value={bonusForm.month}
//                         onChange={e => handleMonthInput(e.target.value, (val) => setBonusForm({...bonusForm, month: val}))}
//                         required
//                         style={styles.monthInput}
//                         maxLength="7"
//                         pattern="\d{4}-\d{2}"
//                         title="Please enter date in YYYY-MM format"
//                       />
//                     </div>
//                   </div>
//                   <div style={styles.formActions}>
//                     <button type="submit" style={styles.primaryButton} disabled={loading}>
//                       💰 {editingBonus ? 'Update' : 'Add'} Bonus
//                     </button>
//                     <button type="button" onClick={resetBonusForm} style={styles.secondaryButton}>
//                       🗑️ Clear
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//             {/* Month Selector for Bonuses */}
//             <div style={styles.tableSection}>
//               <div style={styles.tableHeader}>
//                 <h3 style={styles.sectionTitle}>🎯 Bonuses & Incentives - {bonusFilterMonth}</h3>
//                 <div style={styles.monthSelector}>
//                   <select
//                     value={bonusFilterMonth}
//                     onChange={e => setBonusFilterMonth(e.target.value)}
//                     style={styles.filterInput}
//                   >
//                     <option value="">All Months</option>
//                     {bonusMonths.map(month => (
//                       <option key={month} value={month}>
//                         {new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                       </option>
//                     ))}
//                   </select>
//                   <input
//                     type="text"
//                     placeholder="Search employee..."
//                     value={searchBonus}
//                     onChange={e => setSearchBonus(e.target.value)}
//                     style={styles.filterInput}
//                   />
//                 </div>
//               </div>
//               <div style={styles.tableContainer}>
//                 <table style={styles.table}>
//                   <thead>
//                     <tr>
//                       <th style={styles.th}>Employee</th>
//                       <th style={styles.th}>Incentives</th>
//                       <th style={styles.th}>Month</th>
//                       <th style={styles.th}>Date Added</th>
//                       <th style={styles.th}>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredBonuses.map(bonus => (
//                       <tr key={bonus.id} style={styles.tr}>
//                         <td style={styles.td}>
//                           <div style={styles.employeeInfo}>
//                             <div style={styles.employeeId}>{bonus.employee.employeeId}</div>
//                             <div style={styles.employeeName}>{bonus.employee.name}</div>
//                           </div>
//                         </td>
//                         <td style={styles.td}>
//                           <div style={styles.bonusAmount}>
//                             ₹{bonus.incentives.toLocaleString()}
//                           </div>
//                         </td>
//                         <td style={styles.td}>
//                           <div style={styles.monthBadge}>{bonus.month}</div>
//                         </td>
//                         <td style={styles.td}>{bonus.startDate}</td>
//                         <td style={styles.td}>
//                           <div style={styles.actionButtons}>
//                             <button
//                               onClick={() => handleEditBonus(bonus)}
//                               style={styles.editButton}
//                             >
//                               ✏️
//                             </button>
//                             <button
//                               onClick={() => handleDeleteBonus(bonus.id)}
//                               style={styles.deleteButton}
//                             >
//                               🗑️
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 {filteredBonuses.length === 0 && (
//                   <div style={styles.noData}>
//                     🎯 No bonuses found for {bonusFilterMonth || 'selected month'}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//         {/* Payroll Overview Tab */}
//         {activeTab === 'payroll' && (
//           <div style={styles.tabContent}>
//             <div style={styles.payrollOverview}>
//               <div style={styles.overviewHeader}>
//                 <h3 style={styles.sectionTitle}>📊 Payroll Overview - {filterMonth}</h3>
//                 <div style={styles.overviewStats}>
//                   <div style={styles.overviewStat}>
//                     <span style={styles.overviewStatValue}>₹{totalMonthlySalary.toLocaleString()}</span>
//                     <span style={styles.overviewStatLabel}>Month Total</span>
//                   </div>
//                   <div style={styles.overviewStat}>
//                     <span style={styles.overviewStatValue}>{pendingSalaries}</span>
//                     <span style={styles.overviewStatLabel}>Pending</span>
//                   </div>
//                   <div style={styles.overviewStat}>
//                     <span style={styles.overviewStatValue}>{paidSalaries}</span>
//                     <span style={styles.overviewStatLabel}>Paid</span>
//                   </div>
//                 </div>
//               </div>
//               {/* Month Selector for Payroll */}
//               <div style={styles.monthSelector}>
//                 <select
//                   value={filterMonth}
//                   onChange={e => setFilterMonth(e.target.value)}
//                   style={styles.filterInput}
//                 >
//                   <option value="">All Months</option>
//                   {salaryMonths.map(month => (
//                     <option key={month} value={month}>
//                       {new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                     </option>
//                   ))}
//                 </select>
//                 <input
//                   type="text"
//                   placeholder="Search employee..."
//                   value={searchMonthly}
//                   onChange={e => setSearchMonthly(e.target.value)}
//                   style={styles.filterInput}
//                 />
//               </div>
//               {/* Monthly Salaries Table */}
//               <div style={styles.tableContainer}>
//                 <table style={styles.table}>
//                   <thead>
//                     <tr>
//                       <th style={styles.th}>Employee</th>
//                       <th style={styles.th}>Month</th>
//                       <th style={styles.th}>Basic</th>
//                       <th style={styles.th}>Allowances</th>
//                       <th style={styles.th}>Bonus</th>
//                       <th style={styles.th}>Total Days</th>
//                       <th style={styles.th}>Worked Days</th>
//                       <th style={styles.th}>Deductions</th>
//                       <th style={styles.th}>Net Salary</th>
//                       <th style={styles.th}>Status</th>
//                       <th style={styles.th}>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredMonthlySalaries.map(ms => {
//                       const monthlyBonus = bonuses
//                         .filter(b => b.employee.employeeId === ms.employee.employeeId && b.month === ms.month)
//                         .reduce((sum, bonus) => sum + bonus.incentives, 0);
//                       const totalAllowance = (ms.flexibleBenefitPlan || 0) + (ms.specialAllowance || 0);
//                       const lopDeduction = ms.lop ? ((ms.basic + totalAllowance) / ms.totalWorkingDays) * ms.lop : 0;
//                       const adjustedNet = (ms.netSalary || 0) - lopDeduction + monthlyBonus;
//                       const status = getStatusDisplay(ms);
//                       const isPending = isSalaryPending(ms);
//                       return (
//                         <tr key={ms.id} style={styles.tr}>
//                           <td style={styles.td}>
//                             <div style={styles.employeeInfo}>
//                               <div style={styles.employeeId}>{ms.employee.employeeId}</div>
//                               <div style={styles.employeeName}>{ms.employee.name}</div>
//                             </div>
//                           </td>
//                           <td style={styles.td}>
//                             <div style={styles.monthBadge}>{ms.month}</div>
//                           </td>
//                           <td style={styles.td}>₹{ms.basic?.toLocaleString() || '0'}</td>
//                           <td style={styles.td}>₹{totalAllowance.toLocaleString()}</td>
//                           <td style={styles.td}>
//                             <div style={styles.bonusAmount}>₹{monthlyBonus.toLocaleString()}</div>
//                           </td>
//                           <td style={styles.td}>{ms.totalWorkingDays}</td>
//                           <td style={styles.td}>{ms.workedDays}</td>
//                           <td style={styles.td}>
//                             <div style={styles.deduction}>₹{lopDeduction.toFixed(0)}</div>
//                           </td>
//                           <td style={styles.td}>
//                             <div style={styles.netSalary}>₹{adjustedNet.toLocaleString()}</div>
//                           </td>
//                           <td style={styles.td}>
//                             <span style={{
//                               ...styles.statusBadge,
//                               ...(isPending ? styles.pendingBadge : styles.paidBadge)
//                             }}>
//                               {status}
//                             </span>
//                           </td>
//                           <td style={styles.td}>
//                             {isPending && (
//                               <button
//                                 onClick={() => handleMarkSalaryPaid(ms.id)}
//                                 style={styles.markPaidButton}
//                                 disabled={loading}
//                               >
//                                 ✅ Mark Paid
//                               </button>
//                             )}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//                 {filteredMonthlySalaries.length === 0 && (
//                   <div style={styles.noData}>
//                     📊 No payroll records found for {filterMonth || 'selected month'}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//         {/* Reports Tab */}
//         {activeTab === 'reports' && (
//           <div style={styles.tabContent}>
//             <div style={styles.reportsGrid}>
//               <div style={styles.reportCard}>
//                 <h4 style={styles.reportTitle}>📈 Salary Summary</h4>
//                 <div style={styles.reportContent}>
//                   <div style={styles.reportItem}>
//                     <span>Total Employees:</span>
//                     <span>{salaryPackages.length}</span>
//                   </div>
//                   <div style={styles.reportItem}>
//                     <span>Current Month Salary:</span>
//                     <span>₹{currentMonthSalaryTotal.toLocaleString()}</span>
//                   </div>
//                   <div style={styles.reportItem}>
//                     <span>Current Month Bonus:</span>
//                     <span>₹{currentMonthBonusTotal.toLocaleString()}</span>
//                   </div>
//                   <div style={styles.reportItem}>
//                     <span>Pending Salaries:</span>
//                     <span>{pendingSalaries}</span>
//                   </div>
//                   <div style={styles.reportItem}>
//                     <span>Paid Salaries:</span>
//                     <span>{paidSalaries}</span>
//                   </div>
//                 </div>
//               </div>
             
//               <div style={styles.reportCard}>
//                 <h4 style={styles.reportTitle}>📋 Quick Actions</h4>
//                 <div style={styles.reportContent}>
//                   <button style={styles.quickActionButton} onClick={handleGenerateMonthlySalary}>
//                     ⚡ Run Payroll
//                   </button>
//                   <button style={styles.quickActionButton} onClick={() => setActiveTab('bonusManagement')}>
//                     💰 Add Bonus
//                   </button>
//                   <button style={styles.quickActionButton} onClick={() => setActiveTab('salaryPackage')}>
//                     👥 Add Employee
//                   </button>
//                 </div>
//               </div>
//             </div>
//             {/* Month-wise Summary Tables */}
//             <div style={styles.tableSection}>
//               <h3 style={styles.sectionTitle}>📅 Month-wise Summary</h3>
             
//               {/* Salary by Month */}
//               <div style={{ marginBottom: '2rem' }}>
//                 <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Salary by Month</h4>
//                 <div style={styles.tableContainer}>
//                   <table style={styles.table}>
//                     <thead>
//                       <tr>
//                         <th style={styles.th}>Month</th>
//                         <th style={styles.th}>Employees</th>
//                         <th style={styles.th}>Total Salary</th>
//                         <th style={styles.th}>Pending</th>
//                         <th style={styles.th}>Paid</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {salaryMonths.map(month => {
//                         const monthData = monthlySalaries.filter(ms => ms.month === month);
//                         const totalSalary = monthData.reduce((sum, ms) => sum + (ms.netSalary || 0), 0);
//                         const pending = monthData.filter(ms => isSalaryPending(ms)).length;
//                         const paid = monthData.filter(ms => isSalaryPaid(ms)).length;
                       
//                         return (
//                           <tr key={month} style={styles.tr}>
//                             <td style={styles.td}>
//                               <div style={styles.monthBadge}>{month}</div>
//                             </td>
//                             <td style={styles.td}>{monthData.length}</td>
//                             <td style={styles.td}>
//                               <div style={styles.netSalary}>₹{totalSalary.toLocaleString()}</div>
//                             </td>
//                             <td style={styles.td}>{pending}</td>
//                             <td style={styles.td}>{paid}</td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//               {/* Bonus by Month */}
//               <div>
//                 <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Bonus by Month</h4>
//                 <div style={styles.tableContainer}>
//                   <table style={styles.table}>
//                     <thead>
//                       <tr>
//                         <th style={styles.th}>Month</th>
//                         <th style={styles.th}>Employees</th>
//                         <th style={styles.th}>Total Bonus</th>
//                         <th style={styles.th}>Average Bonus</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {bonusMonths.map(month => {
//                         const monthData = bonuses.filter(bonus => bonus.month === month);
//                         const totalBonus = monthData.reduce((sum, bonus) => sum + bonus.incentives, 0);
//                         const averageBonus = monthData.length > 0 ? totalBonus / monthData.length : 0;
                       
//                         return (
//                           <tr key={month} style={styles.tr}>
//                             <td style={styles.td}>
//                               <div style={styles.monthBadge}>{month}</div>
//                             </td>
//                             <td style={styles.td}>{monthData.length}</td>
//                             <td style={styles.td}>
//                               <div style={styles.bonusAmount}>₹{totalBonus.toLocaleString()}</div>
//                             </td>
//                             <td style={styles.td}>₹{averageBonus.toLocaleString()}</td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HRSalaryManagement;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const HRSalaryManagement = () => {
  // ------------------ Form state ------------------
  const [employeeId, setEmployeeId] = useState('');
  const [basic, setBasic] = useState('');
  const [flexibleBenefitPlan, setFlexibleBenefitPlan] = useState('');
  const [specialAllowance, setSpecialAllowance] = useState('');
  const [pfContributionEmployer, setPfContributionEmployer] = useState('');
  const [professionalTax, setProfessionalTax] = useState('');
  const [totalCostToCompany, setTotalCostToCompany] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState(''); // ✅ Added IFSC state
  // Compliance fields
  const [pfNumber, setPfNumber] = useState('');
  const [uanNumber, setUanNumber] = useState('');
  const [esiNumber, setEsiNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [lop, setLop] = useState('');
  // ------------------ Bonus state ------------------
  const [bonuses, setBonuses] = useState([]);
  const [bonusForm, setBonusForm] = useState({
    employeeId: '',
    incentives: '',
    month: ''
  });
  const [editingBonus, setEditingBonus] = useState(null);



  // ------------------ Salary Hike state ------------------
const [hikeEmployeeId, setHikeEmployeeId] = useState('');
const [hikePercentage, setHikePercentage] = useState('');

  // ------------------ Data state ------------------
  const [salaryPackages, setSalaryPackages] = useState([]);
  const [monthlySalaries, setMonthlySalaries] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('salaryPackage');
  const [loading, setLoading] = useState(false);
  // ------------------ Filters ------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [bonusFilterMonth, setBonusFilterMonth] = useState('');
  const [searchPackage, setSearchPackage] = useState('');
  const [searchMonthly, setSearchMonthly] = useState('');
  const [searchBonus, setSearchBonus] = useState('');
  // Create refs for scrolling
  const salaryFormRef = useRef(null);
  const bonusFormRef = useRef(null);
  // Get current month in YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    return now.toISOString().slice(0, 7);
  };
  // Initialize with current month
  const [currentMonth] = useState(getCurrentMonth());
  const token = localStorage.getItem('token');
  // ------------------ Fetch Data ------------------
  const fetchSalaryPackages = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/hr/salary/all/packages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalaryPackages(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error fetching salary packages' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchMonthlySalaries = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/hr/salary/all/monthly', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonthlySalaries(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error fetching monthly salaries' });
      console.error(err);
    }
  };
  const fetchBonuses = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/hr/bonus/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBonuses(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error fetching bonuses' });
      console.error(err);
    }
  };
  const fetchBonusesByMonth = async (monthYear) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/hr/bonus/month?monthYear=${monthYear}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBonuses(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error fetching bonuses by month' });
      console.error(err);
    }
  };
  useEffect(() => {
    fetchSalaryPackages();
    fetchMonthlySalaries();
    fetchBonuses();
    // Set default filters to current month
    setFilterMonth(currentMonth);
    setBonusFilterMonth(currentMonth);
  }, [currentMonth]);
  // ------------------ Input validation ------------------
  const handleNumberInput = (value, setter) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) setter(value);
  };
  const handleAccountNumberInput = (value) => {
    if (value === '' || /^\d*$/.test(value)) setAccountNumber(value);
  };
  // FIXED: Handle month input to prevent more than 4 digit years
  const handleMonthInput = (value, setter) => {
    // Basic validation for YYYY-MM format
    if (value === '' || /^\d{4}-\d{2}$/.test(value) || /^\d{0,4}-?\d{0,2}$/.test(value)) {
      setter(value);
    }
  };
  // ------------------ Salary Package Submit ------------------


  // ------------------ Salary Package Submit ------------------
const handleSalaryPackageSubmit = async (e) => {
  e.preventDefault();

  if (accountNumber !== confirmAccountNumber) {
    setMessage({ type: 'error', text: 'Account numbers do not match' });
    return;
  }

  setLoading(true);

  const payload = {
    basic: parseFloat(basic) || 0,
    flexibleBenefitPlan: parseFloat(flexibleBenefitPlan) || 0,
    specialAllowance: parseFloat(specialAllowance) || 0,
    pfContributionEmployer: parseFloat(pfContributionEmployer) || 0,
    professionalTax: parseFloat(professionalTax) || 0,
    totalCostToCompany: parseFloat(totalCostToCompany) || 0,
    bankName,
    accountNumber,
    ifscCode,
    pfNumber,
    uanNumber,
    esiNumber,
    panNumber,
    lop: parseFloat(lop) || 0,
  };

  try {
    // Create salary package (backend now blocks duplicates)
    await axios.post(
      `http://localhost:8080/api/hr/salary/package?employeeId=${employeeId}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMessage({
      type: 'success',
      text: `✅ Salary package created for employee ${employeeId}`,
    });

    resetForm();
    fetchSalaryPackages();

  } catch (err) {
    if (err.response && err.response.status === 409) {
      // 🚫 Duplicate salary package detected
      setMessage({
        type: 'error',
        text: `❌ Salary package already exists for employee ${employeeId}. Duplicate not allowed.`,
      });
    } else {
      console.error(err);
      setMessage({
        type: 'error',
        text: '❌ Error saving salary package. Please try again later.',
      });
    }
  } finally {
    setLoading(false);
  }
};

  // const handleSalaryPackageSubmit = async (e) => {
  //   e.preventDefault();
  //   if (accountNumber !== confirmAccountNumber) {
  //     setMessage({ type: 'error', text: 'Account numbers do not match' });
  //     return;
  //   }
  //   setLoading(true);
   
  //   const payload = {
  //     basic: parseFloat(basic) || 0,
  //     flexibleBenefitPlan: parseFloat(flexibleBenefitPlan) || 0,
  //     specialAllowance: parseFloat(specialAllowance) || 0,
  //     pfContributionEmployer: parseFloat(pfContributionEmployer) || 0,
  //     professionalTax: parseFloat(professionalTax) || 0,
  //     totalCostToCompany: parseFloat(totalCostToCompany) || 0,
  //     bankName,
  //     accountNumber,
  //     ifscCode, // ✅ Added IFSC to payload
  //     pfNumber,
  //     uanNumber,
  //     esiNumber,
  //     panNumber,
  //     lop: parseFloat(lop) || 0,
  //   };
  //   try {
  //     await axios.post(
  //       `http://localhost:8080/api/hr/salary/package?employeeId=${employeeId}`,
  //       payload,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     setMessage({ type: 'success', text: `Salary package saved for employee ${employeeId}` });
  //     resetForm();
  //     fetchSalaryPackages();
  //   } catch (err) {
  //     setMessage({ type: 'error', text: 'Error saving salary package' });
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const resetForm = () => {
    setEmployeeId('');
    setBasic('');
    setFlexibleBenefitPlan('');
    setSpecialAllowance('');
    setPfContributionEmployer('');
    setProfessionalTax('');
    setTotalCostToCompany('');
    setBankName('');
    setAccountNumber('');
    setConfirmAccountNumber('');
    setIfscCode(''); // ✅ Added IFSC reset
    setPfNumber('');
    setUanNumber('');
    setEsiNumber('');
    setPanNumber('');
    setLop('');
  };
  // FIXED: Enhanced scroll functionality for edit package
  const handleEditPackage = (pkg) => {
    setEmployeeId(pkg.employee.employeeId);
    setBasic(pkg.basic.toString());
    setFlexibleBenefitPlan(pkg.flexibleBenefitPlan.toString());
    setSpecialAllowance(pkg.specialAllowance.toString());
    setPfContributionEmployer(pkg.pfContributionEmployer.toString());
    setProfessionalTax(pkg.professionalTax.toString());
    setTotalCostToCompany(pkg.totalCostToCompany.toString());
    setBankName(pkg.bankName || '');
    setAccountNumber(pkg.accountNumber || '');
    setConfirmAccountNumber(pkg.accountNumber || '');
    setIfscCode(pkg.ifscCode || ''); // ✅ Added IFSC set
    setPfNumber(pkg.pfNumber || '');
    setUanNumber(pkg.uanNumber || '');
    setEsiNumber(pkg.esiNumber || '');
    setPanNumber(pkg.panNumber || '');
    setLop(pkg.lop?.toString() || '');
   
    setActiveTab('salaryPackage');
   
    // Scroll to form after a short delay to ensure DOM update
    setTimeout(() => {
      salaryFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };
  // ------------------ Bonus Management ------------------
  const handleBonusSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
   
    const payload = {
      incentives: parseFloat(bonusForm.incentives) || 0,
      startDate: `${bonusForm.month}-01`,
      month: bonusForm.month,
    };
    try {
      if (editingBonus) {
        await axios.put(
          `http://localhost:8080/api/hr/bonus/update/${editingBonus.id}`,
          { incentives: payload.incentives },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage({ type: 'success', text: 'Bonus updated successfully' });
      } else {
        await axios.post(
          `http://localhost:8080/api/hr/bonus/add/${bonusForm.employeeId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage({ type: 'success', text: 'Bonus added successfully' });
      }
      resetBonusForm();
      fetchBonuses();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error saving bonus' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // FIXED: Enhanced scroll functionality for edit bonus
  const handleEditBonus = (bonus) => {
    setBonusForm({
      employeeId: bonus.employee.employeeId,
      incentives: bonus.incentives.toString(),
      month: bonus.month
    });
    setEditingBonus(bonus);
    setActiveTab('bonusManagement');
   
    // Scroll to form after a short delay to ensure DOM update
    setTimeout(() => {
      bonusFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };
  const handleDeleteBonus = async (bonusId) => {
    if (window.confirm('Are you sure you want to delete this bonus?')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:8080/api/hr/bonus/delete/${bonusId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Bonus deleted successfully' });
        fetchBonuses();
      } catch (err) {
        setMessage({ type: 'error', text: 'Error deleting bonus' });
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };
  const resetBonusForm = () => {
    setBonusForm({
      employeeId: '',
      incentives: '',
      month: ''
    });
    setEditingBonus(null);
  };
  const handleBonusFilter = () => {
    if (bonusFilterMonth) {
      fetchBonusesByMonth(bonusFilterMonth);
    } else {
      fetchBonuses();
    }
  };
  // ------------------ Scheduler & Mark Paid ------------------
  const handleGenerateMonthlySalary = async () => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:8080/api/hr/salary/run-scheduler`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Salary scheduler executed successfully' });
      fetchMonthlySalaries();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error running salary scheduler' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleMarkSalaryPaid = async (id) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/api/hr/salary/${id}/markpaid`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Salary marked as PAID' });
      fetchMonthlySalaries();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error marking salary as paid' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // ------------------ Filtering ------------------
  const filteredPackages = salaryPackages.filter(
    pkg =>
      (pkg.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
       pkg.employee.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (pkg.employee.employeeId.toLowerCase().includes(searchPackage.toLowerCase()) ||
       pkg.employee.name.toLowerCase().includes(searchPackage.toLowerCase()))
  );
  const filteredMonthlySalaries = monthlySalaries.filter(
    ms =>
      (ms.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
       ms.employee.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (ms.employee.employeeId.toLowerCase().includes(searchMonthly.toLowerCase()) ||
       ms.employee.name.toLowerCase().includes(searchMonthly.toLowerCase()) ||
       ms.month.includes(searchMonthly)) &&
      (!filterMonth || ms.month === filterMonth)
  );
  const filteredBonuses = bonuses.filter(
    bonus =>
      (bonus.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
       bonus.employee.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (bonus.employee.employeeId.toLowerCase().includes(searchBonus.toLowerCase()) ||
       bonus.employee.name.toLowerCase().includes(searchBonus.toLowerCase()) ||
       bonus.month.includes(searchBonus)) &&
      (!bonusFilterMonth || bonus.month === bonusFilterMonth)
  );
  // Get unique months for dropdowns
  const getUniqueMonths = (data, monthField) => {
    const months = [...new Set(data.map(item => item[monthField]))].sort().reverse();
    return months;
  };
  const salaryMonths = getUniqueMonths(monthlySalaries, 'month');
  const bonusMonths = getUniqueMonths(bonuses, 'month');
  // Calculate totals for current month
  const currentMonthSalaries = monthlySalaries.filter(ms => ms.month === currentMonth);
  const currentMonthBonuses = bonuses.filter(bonus => bonus.month === currentMonth);
 
  const totalMonthlySalary = filteredMonthlySalaries.reduce((sum, ms) => sum + (ms.netSalary || 0), 0);
  const totalBonuses = filteredBonuses.reduce((sum, bonus) => sum + bonus.incentives, 0);
 
  // FIXED: Proper status checking from backend
  const pendingSalaries = filteredMonthlySalaries.filter(ms => {
    const status = ms.status ? ms.status.toUpperCase() : 'PENDING';
    return status === 'PENDING' || status === 'UNPAID' || status === 'DUE';
  }).length;
  const paidSalaries = filteredMonthlySalaries.filter(ms => {
    const status = ms.status ? ms.status.toUpperCase() : '';
    return status === 'PAID' || status === 'COMPLETED' || status === 'PROCESSED';
  }).length;
  // Helper function to check if salary is pending
  const isSalaryPending = (salary) => {
    if (!salary.status) return true;
    const status = salary.status.toUpperCase();
    return status === 'PENDING' || status === 'UNPAID' || status === 'DUE';
  };
  // Helper function to check if salary is paid
  const isSalaryPaid = (salary) => {
    if (!salary.status) return false;
    const status = salary.status.toUpperCase();
    return status === 'PAID' || status === 'COMPLETED' || status === 'PROCESSED';
  };
  // Get status display text
  const getStatusDisplay = (salary) => {
    if (!salary.status) return 'PENDING';
    const status = salary.status.toUpperCase();
   
    if (status === 'PAID' || status === 'COMPLETED' || status === 'PROCESSED') {
      return 'PAID';
    }
    if (status === 'PENDING' || status === 'UNPAID' || status === 'DUE') {
      return 'PENDING';
    }
    return status;
  };
  // Calculate current month totals
  const currentMonthSalaryTotal = currentMonthSalaries.reduce((sum, ms) => sum + (ms.netSalary || 0), 0);
  const currentMonthBonusTotal = currentMonthBonuses.reduce((sum, bonus) => sum + bonus.incentives, 0);
  // ------------------ Styles ------------------
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
   
    // Header Styles
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem 0',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem'
    },
    headerMain: {
      marginBottom: '2rem'
    },
    headerTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      margin: '0 0 0.5rem 0',
      background: 'linear-gradient(45deg, #fff, #e0e7ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    headerSubtitle: {
      fontSize: '1.1rem',
      opacity: 0.9,
      margin: 0
    },
    headerStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem'
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      padding: '1.5rem',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    statIcon: {
      fontSize: '2rem'
    },
    statNumber: {
      fontSize: '1.5rem',
      fontWeight: '700'
    },
    headerStatLabel: {
      fontSize: '0.9rem',
      opacity: 0.8
    },
    // Tab Styles
    tabContainer: {
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    tabs: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem',
      display: 'flex',
      gap: '0'
    },
    tab: {
      padding: '1rem 1.5rem',
      background: 'none',
      border: 'none',
      borderBottom: '3px solid transparent',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s ease'
    },
    activeTab: {
      color: '#6366f1',
      borderBottomColor: '#6366f1',
      background: '#f8fafc'
    },
    tabIcon: {
      fontSize: '1.1rem'
    },
    // Main Content
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    },
    // Search Section
    searchSection: {
      marginBottom: '2rem'
    },
    searchContainer: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    },
    searchInputContainer: {
      position: 'relative',
      flex: '1',
      minWidth: '300px'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#64748b'
    },
    searchInput: {
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 2.5rem',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '0.9rem',
      background: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    },
    filterGroup: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center'
    },
    filterSelect: {
      padding: '0.75rem 1rem',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      background: 'white',
      fontSize: '0.9rem'
    },
    runPayrollButton: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '0.9rem',
      boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
    },
    // Message Styles
    message: {
      padding: '1rem 1.5rem',
      borderRadius: '8px',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.9rem',
      fontWeight: '500'
    },
    successMessage: {
      background: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0'
    },
    errorMessage: {
      background: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fecaca'
    },
    messageClose: {
      background: 'none',
      border: 'none',
      fontSize: '1.2rem',
      cursor: 'pointer',
      marginLeft: 'auto'
    },
    // Loading Overlay
    loadingOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      zIndex: 1000
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #6366f1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '1rem'
    },
    // Tab Content
    tabContent: {
      animation: 'fadeIn 0.3s ease'
    },
    // Form Styles
    formSection: {
      marginBottom: '2rem'
    },
    formCard: {
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0'
    },
    formTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      color: '#1e293b'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    formRow: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap'
    },
    formGroup: {
      flex: '1',
      minWidth: '200px'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '500',
      color: '#374151',
      fontSize: '0.9rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.9rem',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box'
    },
    // FIXED: Month input with max length constraint
    monthInput: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.9rem',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
      maxLength: 7 // YYYY-MM format (7 characters)
    },
    salaryBreakdown: {
      gridColumn: '1 / -1'
    },
    breakdownTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '1rem',
      color: '#1e293b'
    },
    breakdownGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem'
    },
    formActions: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1rem'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '0.9rem',
      boxShadow: '0 2px 4px rgba(99, 102, 241, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    secondaryButton: {
      background: '#6b7280',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    // Table Styles
    tableSection: {
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      marginBottom: '2rem'
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      color: '#1e293b'
    },
    tableHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    tableFilters: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center'
    },
    filterInput: {
      padding: '0.5rem 1rem',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '0.9rem'
    },
    filterButton: {
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem'
    },
    clearButton: {
      background: '#6b7280',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem'
    },
    tableContainer: {
      overflowX: 'auto',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '0.9rem'
    },
    th: {
      background: '#f8fafc',
      padding: '1rem',
      textAlign: 'left',
      fontWeight: '600',
      color: '#374151',
      borderBottom: '1px solid #e2e8f0',
      whiteSpace: 'nowrap'
    },
    tr: {
      borderBottom: '1px solid #f1f5f9',
      transition: 'background 0.2s ease'
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #f1f5f9',
      verticalAlign: 'middle'
    },
    // Component Specific Styles
    employeeInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    },
    employeeId: {
      fontWeight: '600',
      color: '#1e293b',
      fontSize: '0.85rem'
    },
    employeeName: {
      color: '#64748b',
      fontSize: '0.8rem'
    },
    bankInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    },
    accountNumber: {
      fontFamily: 'monospace',
      fontSize: '0.8rem',
      color: '#64748b'
    },
    ctc: {
      fontWeight: '600',
      color: '#059669'
    },
    bonusAmount: {
      fontWeight: '600',
      color: '#d97706'
    },
    monthBadge: {
      background: '#eff6ff',
      color: '#1d4ed8',
      padding: '0.25rem 0.5rem',
      borderRadius: '6px',
      fontSize: '0.8rem',
      fontWeight: '500',
      display: 'inline-block'
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.8rem',
      fontWeight: '500',
      display: 'inline-block'
    },
    pendingBadge: {
      background: '#fef3c7',
      color: '#d97706'
    },
    paidBadge: {
      background: '#d1fae5',
      color: '#059669'
    },
    actionButtons: {
      display: 'flex',
      gap: '0.5rem'
    },
    editButton: {
      background: '#fbbf24',
      color: '#78350f',
      border: 'none',
      padding: '0.5rem 0.75rem',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.8rem',
      fontWeight: '500'
    },
    deleteButton: {
      background: '#ef4444',
      color: 'white',
      border: 'none',
      padding: '0.5rem 0.75rem',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.8rem',
      fontWeight: '500'
    },
    markPaidButton: {
      background: '#10b981',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.8rem',
      fontWeight: '500'
    },
    deduction: {
      color: '#ef4444',
      fontWeight: '500'
    },
    netSalary: {
      fontWeight: '700',
      color: '#059669',
      fontSize: '0.95rem'
    },
    // Payroll Overview
    payrollOverview: {
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0'
    },
    overviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    overviewStats: {
      display: 'flex',
      gap: '2rem'
    },
    overviewStat: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    overviewStatValue: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1e293b'
    },
    overviewStatLabel: {
      fontSize: '0.8rem',
      color: '#64748b',
      marginTop: '0.25rem'
    },
    // Reports
    reportsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem'
    },
    reportCard: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0'
    },
    reportTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '1rem',
      color: '#1e293b'
    },
    reportContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    reportItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 0',
      borderBottom: '1px solid #f1f5f9'
    },
    quickActionButton: {
      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      textAlign: 'center'
    },
    // Month Selector
    monthSelector: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1rem',
      flexWrap: 'wrap'
    },
    monthButton: {
      padding: '0.5rem 1rem',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      background: 'white',
      cursor: 'pointer',
      fontSize: '0.9rem',
      transition: 'all 0.2s ease'
    },
    activeMonthButton: {
      background: '#6366f1',
      color: 'white',
      borderColor: '#6366f1'
    },
    // No Data
    noData: {
      textAlign: 'center',
      padding: '3rem',
      color: '#64748b',
      fontSize: '1rem'
    }
  };
  return (
    <div style={styles.container}>
      {/* Navigation Tabs */}
      <div style={styles.tabContainer}>
        <div style={styles.tabs}>
          {[
            { id: 'salaryPackage', label: '💼 Salary Package', icon: '📋' },
            { id: 'bonusManagement', label: '🎯 Bonus Management', icon: '💰' },
            { id: 'payroll', label: '📊 Payroll Overview', icon: '📈' },
            { id: 'reports', label: '📋 Salary Reports', icon: '📄' }
          ].map(tab => (
            <button
              key={tab.id}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={styles.tabIcon}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Search and Filters */}
        <div style={styles.searchSection}>
          <div style={styles.searchContainer}>
            <div style={styles.searchInputContainer}>
              {/* Global search removed as per requirement */}
            </div>
            <div style={styles.filterGroup}>
              <button
                onClick={handleGenerateMonthlySalary}
                style={styles.runPayrollButton}
                disabled={loading}
              >
                {loading ? '⏳' : '⚡'} Run Payroll
              </button>
            </div>
          </div>
        </div>
        {/* Message Alert */}
        {message.text && (
          <div style={{
            ...styles.message,
            ...(message.type === 'success' ? styles.successMessage : styles.errorMessage)
          }}>
            <span style={styles.messageIcon}>
              {message.type === 'success' ? '✅' : '❌'}
            </span>
            {message.text}
            <button onClick={() => setMessage({ type: '', text: '' })} style={styles.messageClose}>×</button>
          </div>
        )}
        {/* Loading Overlay */}
        {loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.loadingSpinner}></div>
            <p>Processing...</p>
          </div>
        )}
        {/* Salary Package Tab */}
        {activeTab === 'salaryPackage' && (
          <div style={styles.tabContent}>
            <div style={styles.formSection} ref={salaryFormRef}>
              <div style={styles.formCard}>
                <h3 style={styles.formTitle}>
                  {employeeId ? '✏️ Update Salary Package' : '➕ Create Salary Package'}
                </h3>
                <form onSubmit={handleSalaryPackageSubmit} style={styles.form}>
                  <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Employee ID *</label>
                      <input
                        type="text"
                        value={employeeId}
                        onChange={e => setEmployeeId(e.target.value)}
                        required
                        style={styles.input}
                        placeholder="Enter employee ID"
                      />
                    </div>
                   
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Bank Details</label>
                      <input
                        type="text" required
                        value={bankName}
                        onChange={e => setBankName(e.target.value)}
                        style={styles.input}
                        placeholder="Bank name"
                      />
                      <input
                        type="text" required
                        value={accountNumber}
                        onChange={e => handleAccountNumberInput(e.target.value)}
                        style={{...styles.input, marginTop: '8px'}}
                        placeholder="Account number"
                      />
                      <input
                        type="text" required
                        value={confirmAccountNumber}
                        onChange={e => {
                          if (e.target.value === '' || /^\d*$/.test(e.target.value)) {
                            setConfirmAccountNumber(e.target.value);
                          }
                        }}
                        style={{...styles.input, marginTop: '8px'}}
                        placeholder="Confirm account number"
                      />
                      <input // ✅ Added IFSC input
                        type="text" required
                        value={ifscCode}
                        onChange={e => setIfscCode(e.target.value)}
                        style={{...styles.input, marginTop: '8px'}}
                        placeholder="IFSC Code"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Compliance Details</label>
                      <input type="text" value={pfNumber} onChange={e => setPfNumber(e.target.value)} style={styles.input} placeholder="PF Number"/>
                      <input type="text" value={uanNumber} onChange={e => setUanNumber(e.target.value)} style={{...styles.input, marginTop: '8px'}} placeholder="UAN Number"/>
                      <input type="text" value={esiNumber} onChange={e => setEsiNumber(e.target.value)} style={{...styles.input, marginTop: '8px'}} placeholder="ESI Number"/>
                      <input type="text" value={panNumber} onChange={e => setPanNumber(e.target.value)} style={{...styles.input, marginTop: '8px'}} placeholder="PAN Number"/>
                    </div>
                    <div style={styles.salaryBreakdown}>
                      <h4 style={styles.breakdownTitle}>Salary Breakdown</h4>
                      <div style={styles.breakdownGrid}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Basic Salary</label>
                          <input type="text" value={basic} onChange={e => handleNumberInput(e.target.value, setBasic)} style={styles.input}/>
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>HRA</label>
                          <input type="text" value={flexibleBenefitPlan} onChange={e => handleNumberInput(e.target.value, setFlexibleBenefitPlan)} style={styles.input}/>
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Special Allowance</label>
                          <input type="text" value={specialAllowance} onChange={e => handleNumberInput(e.target.value, setSpecialAllowance)} style={styles.input}/>
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>PF Contribution</label>
                          <input type="text" value={pfContributionEmployer} onChange={e => handleNumberInput(e.target.value, setPfContributionEmployer)} style={styles.input}/>
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Professional Tax</label>
                          <input type="text" value={professionalTax} onChange={e => handleNumberInput(e.target.value, setProfessionalTax)} style={styles.input}/>
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>LOP Days</label>
                          <input type="text" value={lop} onChange={e => handleNumberInput(e.target.value, setLop)} style={styles.input}/>
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Total CTC</label>
                          <input type="text" value={totalCostToCompany} onChange={e => handleNumberInput(e.target.value, setTotalCostToCompany)} style={styles.input}/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={styles.formActions}>
                    <button type="submit" style={styles.primaryButton} disabled={loading}>
                      {loading ? '⏳' : '💾'} {employeeId ? 'Update' : 'Create'} Salary Package
                    </button>
                    <button type="button" onClick={resetForm} style={styles.secondaryButton}>
                      🗑️ Clear Form
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* Salary Packages Table */}
            <div style={styles.tableSection}>
              <h3 style={styles.sectionTitle}>📋 Salary Packages</h3>
              <input
                type="text"
                placeholder="Search in salary packages..."
                value={searchPackage}
                onChange={e => setSearchPackage(e.target.value)}
                style={{ ...styles.filterInput, marginBottom: '1rem' }}
              />
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Employee</th>
                      <th style={styles.th}>Bank Details</th>
                      <th style={styles.th}>Basic</th>
                      <th style={styles.th}>HRA</th>
                      <th style={styles.th}>Allowance</th>
                      <th style={styles.th}>CTC</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPackages.map(pkg => (
                      <tr key={pkg.id} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={styles.employeeInfo}>
                            <div style={styles.employeeId}>{pkg.employee.employeeId}</div>
                            <div style={styles.employeeName}>{pkg.employee.name}</div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.bankInfo}>
                            <div>{pkg.bankName || '-'}</div>
                            <div style={styles.accountNumber}>{pkg.accountNumber || '-'}</div>
                            <div style={styles.accountNumber}>{pkg.ifscCode || '-'}</div> {/* ✅ Added IFSC display */}
                          </div>
                        </td>
                        <td style={styles.td}>₹{pkg.basic.toLocaleString()}</td>
                        <td style={styles.td}>₹{pkg.flexibleBenefitPlan.toLocaleString()}</td>
                        <td style={styles.td}>₹{pkg.specialAllowance.toLocaleString()}</td>
                        <td style={styles.td}>
                          <div style={styles.ctc}>₹{pkg.totalCostToCompany.toLocaleString()}</div>
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() => handleEditPackage(pkg)}
                            style={styles.editButton}
                          >
                            ✏️ Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredPackages.length === 0 && (
                  <div style={styles.noData}>
                    📝 No salary packages found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Bonus Management Tab */}
        {activeTab === 'bonusManagement' && (
          <div style={styles.tabContent}>
            <div style={styles.formSection} ref={bonusFormRef}>
              <div style={styles.formCard}>
                <h3 style={styles.formTitle}>
                  {editingBonus ? '✏️ Update Bonus' : '➕ Add Bonus/Incentives'}
                </h3>
                <form onSubmit={handleBonusSubmit} style={styles.form}>
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Employee ID *</label>
                      <input
                        type="text"
                        value={bonusForm.employeeId}
                        onChange={e => setBonusForm({...bonusForm, employeeId: e.target.value})}
                        required
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Incentives Amount *</label>
                      <input
                        type="text"
                        value={bonusForm.incentives}
                        onChange={e => handleNumberInput(e.target.value, (val) => setBonusForm({...bonusForm, incentives: val}))}
                        required
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Month *</label>
                      <input
                        type="month"
                        value={bonusForm.month}
                        onChange={e => handleMonthInput(e.target.value, (val) => setBonusForm({...bonusForm, month: val}))}
                        required
                        style={styles.monthInput}
                        maxLength="7"
                        pattern="\d{4}-\d{2}"
                        title="Please enter date in YYYY-MM format"
                      />
                    </div>
                  </div>
                  <div style={styles.formActions}>
                    <button type="submit" style={styles.primaryButton} disabled={loading}>
                      💰 {editingBonus ? 'Update' : 'Add'} Bonus
                    </button>
                    <button type="button" onClick={resetBonusForm} style={styles.secondaryButton}>
                      🗑️ Clear
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* Month Selector for Bonuses */}
            <div style={styles.tableSection}>
              <div style={styles.tableHeader}>
                <h3 style={styles.sectionTitle}>🎯 Bonuses & Incentives - {bonusFilterMonth}</h3>
                <div style={styles.monthSelector}>
                  <select
                    value={bonusFilterMonth}
                    onChange={e => setBonusFilterMonth(e.target.value)}
                    style={styles.filterInput}
                  >
                    <option value="">All Months</option>
                    {bonusMonths.map(month => (
                      <option key={month} value={month}>
                        {new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Search employee..."
                    value={searchBonus}
                    onChange={e => setSearchBonus(e.target.value)}
                    style={styles.filterInput}
                  />
                </div>
              </div>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Employee</th>
                      <th style={styles.th}>Incentives</th>
                      <th style={styles.th}>Month</th>
                      {/* <th style={styles.th}>Date Added</th> */}
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBonuses.map(bonus => (
                      <tr key={bonus.id} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={styles.employeeInfo}>
                            <div style={styles.employeeId}>{bonus.employee.employeeId}</div>
                            <div style={styles.employeeName}>{bonus.employee.name}</div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.bonusAmount}>
                            ₹{bonus.incentives.toLocaleString()}
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.monthBadge}>{bonus.month}</div>
                        </td>
                        <td style={styles.td}>{bonus.startDate}</td>
                        <td style={styles.td}>
                          <div style={styles.actionButtons}>
                            <button
                              onClick={() => handleEditBonus(bonus)}
                              style={styles.editButton}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteBonus(bonus.id)}
                              style={styles.deleteButton}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredBonuses.length === 0 && (
                  <div style={styles.noData}>
                    🎯 No bonuses found for {bonusFilterMonth || 'selected month'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Payroll Overview Tab */}
        {activeTab === 'payroll' && (
          <div style={styles.tabContent}>
            <div style={styles.payrollOverview}>
              <div style={styles.overviewHeader}>
                <h3 style={styles.sectionTitle}>📊 Payroll Overview - {filterMonth}</h3>
                <div style={styles.overviewStats}>
                  <div style={styles.overviewStat}>
                    <span style={styles.overviewStatValue}>₹{totalMonthlySalary.toLocaleString()}</span>
                    <span style={styles.overviewStatLabel}>Month Total</span>
                  </div>
                  <div style={styles.overviewStat}>
                    <span style={styles.overviewStatValue}>{pendingSalaries}</span>
                    <span style={styles.overviewStatLabel}>Pending</span>
                  </div>
                  <div style={styles.overviewStat}>
                    <span style={styles.overviewStatValue}>{paidSalaries}</span>
                    <span style={styles.overviewStatLabel}>Paid</span>
                  </div>
                </div>
              </div>
              {/* Month Selector for Payroll */}
              <div style={styles.monthSelector}>
                <select
                  value={filterMonth}
                  onChange={e => setFilterMonth(e.target.value)}
                  style={styles.filterInput}
                >
                  <option value="">All Months</option>
                  {salaryMonths.map(month => (
                    <option key={month} value={month}>
                      {new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={searchMonthly}
                  onChange={e => setSearchMonthly(e.target.value)}
                  style={styles.filterInput}
                />
              </div>
              {/* Monthly Salaries Table */}
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Employee</th>
                      <th style={styles.th}>Month</th>
                      <th style={styles.th}>Basic</th>
                      <th style={styles.th}>Allowances</th>
                      <th style={styles.th}>Bonus</th>
                      <th style={styles.th}>Total Days</th>
                      <th style={styles.th}>Worked Days</th>
                      <th style={styles.th}>Deductions</th>
                      <th style={styles.th}>Net Salary</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMonthlySalaries.map(ms => {
                      const monthlyBonus = bonuses
                        .filter(b => b.employee.employeeId === ms.employee.employeeId && b.month === ms.month)
                        .reduce((sum, bonus) => sum + bonus.incentives, 0);
                      const totalAllowance = (ms.flexibleBenefitPlan || 0) + (ms.specialAllowance || 0);
                      const lopDeduction = ms.lop ? ((ms.basic + totalAllowance) / ms.totalWorkingDays) * ms.lop : 0;
                      const adjustedNet = (ms.netSalary || 0) - lopDeduction + monthlyBonus;
                      const status = getStatusDisplay(ms);
                      const isPending = isSalaryPending(ms);
                      return (
                        <tr key={ms.id} style={styles.tr}>
                          <td style={styles.td}>
                            <div style={styles.employeeInfo}>
                              <div style={styles.employeeId}>{ms.employee.employeeId}</div>
                              <div style={styles.employeeName}>{ms.employee.name}</div>
                            </div>
                          </td>
                          <td style={styles.td}>
                            <div style={styles.monthBadge}>{ms.month}</div>
                          </td>
                          <td style={styles.td}>₹{ms.basic?.toLocaleString() || '0'}</td>
                          <td style={styles.td}>₹{totalAllowance.toLocaleString()}</td>
                          <td style={styles.td}>
                            <div style={styles.bonusAmount}>₹{monthlyBonus.toLocaleString()}</div>
                          </td>
                          <td style={styles.td}>{ms.totalWorkingDays}</td>
                          <td style={styles.td}>{ms.workedDays}</td>
                          <td style={styles.td}>
                            <div style={styles.deduction}>₹{lopDeduction.toFixed(0)}</div>
                          </td>
                          <td style={styles.td}>
                            <div style={styles.netSalary}>₹{adjustedNet.toLocaleString()}</div>
                          </td>
                          <td style={styles.td}>
                            <span style={{
                              ...styles.statusBadge,
                              ...(isPending ? styles.pendingBadge : styles.paidBadge)
                            }}>
                              {status}
                            </span>
                          </td>
                          <td style={styles.td}>
                            {isPending && (
                              <button
                                onClick={() => handleMarkSalaryPaid(ms.id)}
                                style={styles.markPaidButton}
                                disabled={loading}
                              >
                                ✅ Mark Paid
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredMonthlySalaries.length === 0 && (
                  <div style={styles.noData}>
                    📊 No payroll records found for {filterMonth || 'selected month'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div style={styles.tabContent}>
            <div style={styles.reportsGrid}>
              <div style={styles.reportCard}>
                <h4 style={styles.reportTitle}>📈 Salary Summary</h4>
                <div style={styles.reportContent}>
                  <div style={styles.reportItem}>
                    <span>Total Employees:</span>
                    <span>{salaryPackages.length}</span>
                  </div>
                  <div style={styles.reportItem}>
                    <span>Current Month Salary:</span>
                    <span>₹{currentMonthSalaryTotal.toLocaleString()}</span>
                  </div>
                  <div style={styles.reportItem}>
                    <span>Current Month Bonus:</span>
                    <span>₹{currentMonthBonusTotal.toLocaleString()}</span>
                  </div>
                  <div style={styles.reportItem}>
                    <span>Pending Salaries:</span>
                    <span>{pendingSalaries}</span>
                  </div>
                  <div style={styles.reportItem}>
                    <span>Paid Salaries:</span>
                    <span>{paidSalaries}</span>
                  </div>
                </div>
              </div>
             
              <div style={styles.reportCard}>
                <h4 style={styles.reportTitle}>📋 Quick Actions</h4>
                <div style={styles.reportContent}>
                  <button style={styles.quickActionButton} onClick={handleGenerateMonthlySalary}>
                    ⚡ Run Payroll
                  </button>
                  <button style={styles.quickActionButton} onClick={() => setActiveTab('bonusManagement')}>
                    💰 Add Bonus
                  </button>
                  <button style={styles.quickActionButton} onClick={() => setActiveTab('salaryPackage')}>
                    👥 Add Employee
                  </button>
                </div>
              </div>
            </div>
            {/* Month-wise Summary Tables */}
            <div style={styles.tableSection}>
              <h3 style={styles.sectionTitle}>📅 Month-wise Summary</h3>
             
              {/* Salary by Month */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Salary by Month</h4>
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Month</th>
                        <th style={styles.th}>Employees</th>
                        <th style={styles.th}>Total Salary</th>
                        <th style={styles.th}>Pending</th>
                        <th style={styles.th}>Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salaryMonths.map(month => {
                        const monthData = monthlySalaries.filter(ms => ms.month === month);
                        const totalSalary = monthData.reduce((sum, ms) => sum + (ms.netSalary || 0), 0);
                        const pending = monthData.filter(ms => isSalaryPending(ms)).length;
                        const paid = monthData.filter(ms => isSalaryPaid(ms)).length;
                       
                        return (
                          <tr key={month} style={styles.tr}>
                            <td style={styles.td}>
                              <div style={styles.monthBadge}>{month}</div>
                            </td>
                            <td style={styles.td}>{monthData.length}</td>
                            <td style={styles.td}>
                              <div style={styles.netSalary}>₹{totalSalary.toLocaleString()}</div>
                            </td>
                            <td style={styles.td}>{pending}</td>
                            <td style={styles.td}>{paid}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Bonus by Month */}
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Bonus by Month</h4>
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Month</th>
                        <th style={styles.th}>Employees</th>
                        <th style={styles.th}>Total Bonus</th>
                        <th style={styles.th}>Average Bonus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bonusMonths.map(month => {
                        const monthData = bonuses.filter(bonus => bonus.month === month);
                        const totalBonus = monthData.reduce((sum, bonus) => sum + bonus.incentives, 0);
                        const averageBonus = monthData.length > 0 ? totalBonus / monthData.length : 0;
                       
                        return (
                          <tr key={month} style={styles.tr}>
                            <td style={styles.td}>
                              <div style={styles.monthBadge}>{month}</div>
                            </td>
                            <td style={styles.td}>{monthData.length}</td>
                            <td style={styles.td}>
                              <div style={styles.bonusAmount}>₹{totalBonus.toLocaleString()}</div>
                            </td>
                            <td style={styles.td}>₹{averageBonus.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRSalaryManagement;