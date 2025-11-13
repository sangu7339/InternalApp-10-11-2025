import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';

const EmpManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    employeeId: '',
    name: '',
    department: 'IT',
    deptRole: '',
    dateOfJoining: '',
    status: 'ACTIVE',
    email: '',
    confirmEmail: '',
  });
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  // Search
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  // Reset password modal
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetId, setResetId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  // ⭐ ADDED: ref to scroll to form
  const formRef = useRef(null);
  // Departments and roles
  const departments = ['IT', 'MARKETING', 'FINANCE', 'OPERATIONS', 'HR'];
  const roles = ['DEVELOPER', 'MANAGER', 'DESIGNER', 'HR_EXECUTIVE', 'TEAM_LEAD', 'QA'];
  // ⭐ ADDED: Email domain validator (hard block)
  const isVentureEmail = (email) => /^[A-Za-z0-9._%+-]+@venturebiz\.in$/i.test((email || '').trim());
  // ⭐ ADDED: Month-range helpers (last month -> next month)
  const { minDateStr, maxDateStr, minDateObj, maxDateObj } = useMemo(() => {
    const now = new Date();
    // Start of last month
    const startOfLast = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    // End of next month
    const endOfNext = new Date(now.getFullYear(), now.getMonth() + 2, 0); // day 0 -> last day of previous month (i.e., next month)
    endOfNext.setHours(23, 59, 59, 999);
    const toStr = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };
    return {
      minDateStr: toStr(startOfLast),
      maxDateStr: toStr(endOfNext),
      minDateObj: startOfLast,
      maxDateObj: endOfNext,
    };
  }, []);
  // ⭐ ADDED: parse and validate DOJ within allowed range (optional field overall)
  const parseDoJ = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? null : dt;
  };
  const isDoJWithinAllowedRange = (dateStr) => {
    const dt = parseDoJ(dateStr);
    if (!dt) return true; // keep optional behavior (no change to original logic)
    return dt >= minDateObj && dt <= maxDateObj;
  };
  // Function to open email with welcome message
  const openWelcomeEmail = (employeeData) => {
    const subject = `Welcome to VentureBiz - Employee Onboarding: ${employeeData.name}`;
  
    const body = `
Dear ${employeeData.name},
Welcome to VentureBiz! We are thrilled to have you as part of our team.
Your employee account has been successfully created with the following details:
Employee ID: ${employeeData.employeeId}
Name: ${employeeData.name}
Department: ${employeeData.department}
Role: ${employeeData.deptRole}
Email: ${employeeData.email}
Password: ${employeeData.email} (If you need to change your password, please contact HR)
Login Credentials:
Username: ${employeeData.email}
Password: ${employeeData.email}
Please use these credentials to access the employee portal.
As a new employee of VentureBiz, you are now part of a dynamic team dedicated to innovation and excellence. We look forward to your valuable contributions and growth with our company.
Please feel free to reach out to the HR department if you have any questions or need assistance.
Best regards,
HR Team
VentureBiz
 Address: #2085/16, 2nd Floor, Spoorthi, Wilson Garden Society Layout,
 Puttenahalli Main Road, JP Nagar 7th Phase, Bangalore - 560078
Website: www.venturebiz.in
Contact: +91 9008522366
Email: info@venturebiz.in | hr@venturebiz.in
    `.trim();
    const mailtoLink = `mailto:${employeeData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
    const hrMailtoLink = `mailto:hr@venturebiz.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(hrMailtoLink, '_blank');
  };
  const handleLogin = () => {
    const token = prompt('Please enter your JWT token:');
    if (token) {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      fetchEmployees();
    } else {
      setError('Authentication required.');
    }
  };
  const axiosConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  };
  const fetchEmployees = async () => {
    if (!isAuthenticated) return setError('Please log in to view employees.');
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await axios.get('http://localhost:8080/api/hr/employees', axiosConfig);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Failed to fetch employees.');
      if (err.response?.status === 403) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isAuthenticated) fetchEmployees();
  }, [isAuthenticated]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const resetForm = () => {
    setEditing(false);
    setFormData({
      id: '',
      employeeId: '',
      name: '',
      department: 'IT',
      deptRole: '',
      dateOfJoining: '',
      status: 'ACTIVE',
      email: '',
      confirmEmail: '',
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return setError('Please log in to perform this action.');
    // Show popup message
    // 🟡 Check email match — POPUP ONLY (no inline error)
if (formData.email !== formData.confirmEmail) {
  // Clear any existing inline errors
  setError('');

  await new Promise((resolve) => setTimeout(resolve, 0));

  // Show popup message
  window.alert("⚠️ Email and Confirm Email do not match");

  // Stop further execution
  return;
}

  // ⭐ Hard block invalid email domain (Popup Only)
if (!isVentureEmail(formData.email)) {
  // Remove any old inline error
  setError('');
  
  // Show popup message
  window.alert("⚠️ Email must end with @venturebiz.in");

  // Focus the email field for user correction
  const emailField = document.querySelector('input[name="email"]');
  if (emailField) emailField.focus();

  // Stop form submission
  return;
}


    // ⭐ ADDED: DOJ range validation (now required, so always check)
    if (!formData.dateOfJoining) {
      setError('Date of Joining is required');
      return;
    }
   
    if (!isDoJWithinAllowedRange(formData.dateOfJoining)) {
  setError(`Date of Joining must be between ${minDateStr} and ${maxDateStr}`
  );
  return;
}
// ❌ Block adding employee with HR email (but allow editing existing HR user)
if (!editing && formData.email.trim().toLowerCase() === "hr@venturebiz.in") {
  alert("⚠️ You cannot add an employee using hr@venturebiz.in");
  return;
}

// ✅ CHECK FOR EXISTING EMAIL BEFORE SUBMIT
const emailExists = employees.some(
  (emp) => emp.user?.email?.toLowerCase() === formData.email.toLowerCase()
);
// ❌ Block adding employee with HR email (but allow editing existing HR user)
if (!editing && formData.email.trim().toLowerCase() === "hr@venturebiz.in") {
  alert("⚠️ You cannot add an employee using hr@venturebiz.in");
  return;
}

if (!editing && emailExists) {
  alert("E-mail already exists. Please use a different email address.");
  return;
}
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        employeeId: formData.employeeId,
        name: formData.name,
        department: formData.department || null,
        deptRole: formData.deptRole || null,
        status: formData.status,
        dateOfJoining: formData.dateOfJoining || null,
        user: { email: formData.email }
      };
      let res;
      if (editing) {
        res = await axios.put(`http://localhost:8080/api/hr/employees/${formData.id}`, payload, axiosConfig);
        setMessage(res.data?.message || 'Employee updated successfully!');
      } else {
        res = await axios.post('http://localhost:8080/api/hr/employees', payload, axiosConfig);
        const successMessage = `${res.data?.message || 'Employee added successfully!'} Initial password is set to the email address: ${formData.email}`;
        setMessage(successMessage);
        setTimeout(() => {
          openWelcomeEmail({
            name: formData.name,
            employeeId: formData.employeeId,
            department: formData.department,
            deptRole: formData.deptRole,
            email: formData.email
          });
        }, 1000);
      }
      resetForm();
      setShowForm(false);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Failed to save employee.');
    } finally {
      setLoading(false);
    }
  };
  const handleUpdate = (emp) => {
    setEditing(true);
    setShowForm(true);
    setFormData({
      id: emp.id,
      employeeId: emp.employeeId,
      name: emp.name,
      department: emp.department || 'IT',
      deptRole: emp.deptRole || '',
      dateOfJoining: emp.dateOfJoining || '',
      status: emp.status || 'ACTIVE',
      email: emp.user?.email || '',
      confirmEmail: emp.user?.email || '',
    });
    // ⭐ ADDED: smooth scroll to the form
    requestAnimationFrame(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };
  const openResetPassword = (id, email) => {
    setResetId(id);
    setResetEmail(email || '');
    setNewPassword('');
    setShowReset(true);
  };
  const submitResetPassword = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return setError('Please log in to perform this action.');
    if (!newPassword.trim()) return setError('New password is required.');
    // ⭐ ADDED: Enforce venturebiz email in reset modal as well
    if (!isVentureEmail(resetEmail)) {
      setError('Email must end with @venturebiz.in');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const employee = employees.find(emp => emp.id === resetId);
      if (!employee) throw new Error('Employee not found');
      const res = await axios.put(
        `http://localhost:8080/api/hr/employees/${resetId}`,
        {
          employeeId: employee.employeeId,
          name: employee.name,
          department: employee.department || null,
          deptRole: employee.deptRole || null,
          dateOfJoining: employee.dateOfJoining || null,
          status: employee.status,
          user: { email: resetEmail, password: newPassword },
        },
        axiosConfig
      );
      setMessage(res.data?.message || 'Password updated successfully!');
      setShowReset(false);
      setNewPassword('');
      setResetId(null);
      setResetEmail('');
      fetchEmployees();
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };
  // ✅ DELETE EMPLOYEE
  const handleDelete = async (id) => {
    if (!isAuthenticated) return setError('Please log in to perform this action.');
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await axios.delete(`http://localhost:8080/api/hr/employees/${id}`, axiosConfig);
      setMessage(res.data || 'Employee deleted successfully!');
      fetchEmployees(); // refresh table
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Failed to delete employee.');
    } finally {
      setLoading(false);
    }
  };
  // Department member counts
  const deptCounts = useMemo(() => {
    const map = new Map();
    employees.forEach(e => {
      const key = e.department || 'Unassigned';
      map.set(key, (map.get(key) || 0) + 1);
    });
    departments.forEach(d => { if (!map.has(d)) map.set(d, 0); });
    return Array.from(map.entries());
  }, [employees]);
  // ⭐ Instant filtering as you type
const filteredEmployees = useMemo(() => {
  const term = searchInput.trim().toLowerCase();
  if (!term) return employees;
  return employees.filter(emp =>
    (emp.name || '').toLowerCase().includes(term) ||
    (emp.employeeId || '').toLowerCase().includes(term) ||
    (emp.user?.email || '').toLowerCase().includes(term)
  );
}, [employees, searchInput]);

  // Inline Styles (unchanged)
  const styles = {
    container: {
      minHeight: '100vh',
      padding: '24px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    authContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' },
    authCard: {
      background: 'white', borderRadius: '16px', padding: '40px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      textAlign: 'center', maxWidth: '400px', width: '100%',
    },
    card: {
      background: 'white', borderRadius: '16px', padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      marginBottom: '24px', border: '1px solid #e2e8f0',
    },
    alert: {
      borderRadius: '12px', padding: '16px', marginBottom: '20px', fontWeight: '600',
      display: 'flex', alignItems: 'center', gap: '8px',
    },
    successAlert: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' },
    errorAlert: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
    deptStrip: { display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' },
    deptChip: {
      display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px',
      background: 'white', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0', transition: 'all 0.2s',
    },
    deptName: { fontWeight: '600', color: '#1e293b' },
    deptCount: { background: '#e0e7ff', color: '#1e40af', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', fontSize: '14px' },
    topActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    button: {
      border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: '600', cursor: 'pointer',
      transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px',
    },
    primaryButton: { background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.25)' },
    secondaryButton: { background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' },
    dangerButton: { background: '#ef4444', color: 'white' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '20px' },
    input: {
      width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #d1d5db',
      background: 'white', fontSize: '16px', outline: 'none', transition: 'all 0.2s',
    },
    select: {
      width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #d1d5db',
      background: 'white', fontSize: '16px', outline: 'none', transition: 'all 0.2s',
    },
    formActions: { display: 'flex', gap: '12px', justifyContent: 'center' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' },
    searchGroup: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' },
    searchInput: {
      padding: '10px 16px', borderRadius: '12px', border: '1px solid #d1d5db', width: '300px',
      background: 'white', fontSize: '16px', outline: 'none',
    },
    tableWrapper: { overflowX: 'auto', borderRadius: '12px', border: '1px solid #e2e8f0' },
    table: { width: '100%', borderCollapse: 'collapse', minWidth: '1000px' },
    tableHeader: { background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
    tableHeaderCell: {
      padding: '16px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '14px',
      textTransform: 'uppercase', letterSpacing: '0.05em',
    },
    tableCell: { padding: '16px', borderBottom: '1px solid ', color: '#334155' },
    tableRow: { transition: 'background-color 0.2s' },
    badge: {
      padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
      textTransform: 'uppercase', letterSpacing: '0.05em',
    },
    activeBadge: { background: '#dcfce7', color: '#166534' },
    inactiveBadge: { background: '#f3f4f6', color: '#6b7280' },
    actionsCell: { display: 'flex', gap: '8px', justifyContent: 'center' },
    modalOverlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)',
    },
    modal: {
      background: 'white', borderRadius: '16px', padding: '24px', maxWidth: '480px', width: '90%',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    modalTitle: { fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px 0' },
    modalGrid: { display: 'grid', gap: '16px', marginBottom: '24px' },
    modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
    loadingSpinner: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' },
    spinner: { width: '40px', height: '40px', border: '4px solid #f3f4f6', borderLeft: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    inlineGroup: { display: 'flex', alignItems: 'center', gap: '12px', gridColumn: 'span 2' },
    inlineLabel: { fontSize: '14px', fontWeight: '600', color: '#374151', whiteSpace: 'nowrap', minWidth: '140px' },
    loginNote: { color: '#64748b', marginBottom: '20px', fontSize: '16px' },
    loginButton: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', borderRadius: '12px',
      padding: '12px 24px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
      boxShadow: '0 4px 6px rgba(59, 130, 246, 0.25)',
    },
  };
  // Add CSS animations (unchanged)
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      button:hover { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1); }
      input:focus, select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
      .dept-chip:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
      .table-row:hover { background-color: #f8fafc; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);
  return (
    <div style={styles.container}>
      {!isAuthenticated ? (
        <div style={styles.authContainer}>
          <div style={styles.authCard}>
            <h2 style={{ color: '#1e293b', marginBottom: '16px' }}>Employee Management</h2>
            <p style={styles.loginNote}>Please log in to access employee management</p>
            <button style={styles.loginButton} onClick={handleLogin}>🔐 Login with JWT</button>
          </div>
        </div>
      ) : (
        <>
          {/* Department Summary */}
          <div style={styles.card}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>Department Overview</h3>
            <div style={styles.deptStrip}>
              {deptCounts.map(([dept, count]) => (
                <div key={dept} style={styles.deptChip} className="dept-chip">
                  <span style={styles.deptName}>{dept}</span>
                  <span style={styles.deptCount}>{count}</span>
                </div>
              ))}
            </div>
            <div style={styles.topActions}>
              <div style={{ flex: 1 }}></div>
              <button
                style={{...styles.button, ...styles.primaryButton}}
                onClick={() => {
                  if (editing) resetForm();
                  setShowForm(v => !v);
                  // ⭐ ADDED: scroll when opening
                  requestAnimationFrame(() => {
                    if (formRef.current && !showForm) {
                      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  });
                }}
                onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
                onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
              >
                {showForm ? '✕ Close Form' : '+ Add Employee'}
              </button>
            </div>
            {showForm && (
              <form onSubmit={handleSubmit} ref={formRef}>
                <div style={styles.formGrid}>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="Employee ID"
                    style={styles.input}
                    required
                    disabled={loading}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    style={styles.input}
                    required
                    disabled={loading}
                  />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    style={styles.select}
                    required
                    disabled={loading}
                  >
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <input
                    type="text"
                    name="deptRole"
                    value={formData.deptRole}
                    onChange={handleChange}
                    placeholder="Department Role (Manual Entry)"
                    style={styles.input}
                    required
                    disabled={loading}
                  />
                  <input
                    type="date"
                    name="dateOfJoining"
                    value={formData.dateOfJoining}
                    onChange={handleChange}
                    style={styles.input}
                    required
                    disabled={loading}
                    // ⭐ ADDED: allowed range = last month -> next month
                    min={minDateStr}
                    max={maxDateStr}
                  />
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={styles.select}
                    required
                    disabled={loading}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                
                  {/* ⭐ UPDATED: Email field - read-only when editing */}
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    style={{
                      ...styles.input,
                      ...(editing ? {
                        backgroundColor: '#f1f5f9',
                        cursor: 'not-allowed',
                        borderColor: '#cbd5e1'
                      } : {})
                    }}
                    required
                    disabled={loading || editing} // Disable when editing
                    pattern="^[A-Za-z0-9._%+-]+@venturebiz\.in$"
                    title="Email must end with @venturebiz.in"
                  />
                
                  {/* ⭐ ADDED: Confirm Email field - hidden when editing */}
                  {!editing && (
                    <input
                      type="email"
                      name="confirmEmail"
                      value={formData.confirmEmail}
                      onChange={handleChange}
                      placeholder="Confirm Email Address"
                      style={styles.input}
                      required
                      disabled={loading}
                      pattern="^[A-Za-z0-9._%+-]+@venturebiz\.in$"
                      title="Email must end with @venturebiz.in"
                    />
                  )}
                </div>
                <div style={styles.formActions}>
                  <button
                    type="submit"
                    style={{...styles.button, ...styles.primaryButton}}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div style={{...styles.spinner, width: '16px', height: '16px', borderWidth: '2px', marginRight: '8px'}}></div>
                        {editing ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      editing ? '📝 Update Employee' : '➕ Add Employee'
                    )}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      style={{...styles.button, ...styles.secondaryButton}}
                      onClick={() => { resetForm(); setShowForm(false); }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
          {/* Employee Table */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Employee Directory</h3>
              <div style={styles.searchGroup}>
  <input
    type="text"
    placeholder="Search by name, email, or employee ID..."
    value={searchInput}
    onChange={(e) => {
      const value = e.target.value;
      setSearchInput(value);
      setSearchTerm(value.trim().toLowerCase()); // instant filtering
    }}
    style={styles.searchInput}
  />
</div>

            </div>
            
              {error && !( error.toLowerCase().includes("email and confirm email") ||
    error.toLowerCase().includes("@venturebiz.in") ||
    error.toLowerCase().includes("e-mail already exists") ||
    error.toLowerCase().includes("email must end"))&& (
              <div style={{...styles.alert, ...styles.errorAlert}}>
                ⚠️ {error}
              </div>
            )}
            {message && (
              <div style={{...styles.alert, ...styles.successAlert}}>
                ✅ {message}
              </div>
            )}
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={styles.tableHeaderCell}>Emp ID</th>
                    <th style={styles.tableHeaderCell}>Name</th>
                    <th style={styles.tableHeaderCell}>Department</th>
                    <th style={styles.tableHeaderCell}>Role</th>
                    <th style={styles.tableHeaderCell}>Join Date</th>
                    <th style={styles.tableHeaderCell}>Status</th>
                    <th style={styles.tableHeaderCell}>Email</th>
                    <th style={styles.tableHeaderCell}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{...styles.tableCell, textAlign: 'center', color: '#64748b'}}>
                        No employees found
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map(emp => (
                      <tr key={emp.id} style={styles.tableRow} className="table-row">
                        <td style={styles.tableCell}>
                          <strong>{emp.employeeId}</strong>
                        </td>
                        <td style={styles.tableCell}>{emp.name}</td>
                        <td style={styles.tableCell}>{emp.department || '-'}</td>
                        <td style={styles.tableCell}>{emp.deptRole || '-'}</td>
                        <td style={styles.tableCell}>{emp.dateOfJoining || '-'}</td>
                        <td style={styles.tableCell}>
                          <span style={{
                            ...styles.badge,
                            ...(emp.status === 'ACTIVE' ? styles.activeBadge : styles.inactiveBadge)
                          }}>
                            {emp.status}
                          </span>
                        </td>
                        <td style={styles.tableCell}>{emp.user?.email}</td>
                        <td style={styles.tableCell}>
                          <div style={styles.actionsCell}>
                            <button
                              style={{...styles.button, ...styles.secondaryButton}}
                              onClick={() => handleUpdate(emp)}
                            >
                              Edit
                            </button>
                            <button
                              style={{...styles.button, ...styles.primaryButton}}
                              onClick={() => openResetPassword(emp.id, emp.user?.email)}
                            >
                              🔑 Reset
                            </button>
                            {/* <button
                              style={{...styles.button, ...styles.dangerButton}}
                              onClick={() => handleDelete(emp.id)}
                            >
                              Delete
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Reset Password Modal */}
          {showReset && (
            <div style={styles.modalOverlay} onClick={() => setShowReset(false)}>
              <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 style={styles.modalTitle}>Reset Password</h3>
                <form onSubmit={submitResetPassword}>
                  <div style={styles.modalGrid}>
                    {/* Email field - now read-only */}
                    <input
                      type="email"
                      value={resetEmail}
                      readOnly
                      style={{
                        ...styles.input,
                        backgroundColor: '#f1f5f9',
                        cursor: 'not-allowed',
                      }}
                      placeholder="Email Address"
                      required
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={styles.input}
                      placeholder="New Password"
                      required
                    />
                  </div>
                  <div style={styles.modalActions}>
                    <button
                      type="button"
                      style={{...styles.button, ...styles.secondaryButton}}
                      onClick={() => setShowReset(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{...styles.button, ...styles.primaryButton}}
                    >
                      Update Password
                    </button>
                  </div> </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmpManagement;