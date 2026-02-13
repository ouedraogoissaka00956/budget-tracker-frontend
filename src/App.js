import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import { CategoryProvider } from './context/CategoryContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { GoalProvider } from './context/GoalContext';
import { NotificationProvider } from './context/NotificationContext';
import { RecurringTransactionProvider } from './context/RecurringTransactionContext';
import { AccountProvider } from './context/AccountContext';


// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import Goals from './pages/Goals';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import RecurringTransactions from './pages/RecurringTransactions';
import Accounts from './pages/Accounts';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyPIN from './pages/VerifyPIN';
import ResetPasswordPIN from './pages/ResetPasswordPIN';


function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AccountProvider>  
              <TransactionProvider>
                <CategoryProvider>
                  <GoalProvider>
                    <RecurringTransactionProvider>
                      <Routes>
                        {/* Routes publiques */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/verify-pin" element={<VerifyPIN />} />
                        <Route path="/reset-password-pin" element={<ResetPasswordPIN />} />


                        {/* Routes protégées */}
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <Dashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/transactions"
                          element={
                            <ProtectedRoute>
                              <Transactions />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/recurring-transactions"
                          element={
                            <ProtectedRoute>
                              <RecurringTransactions />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/accounts"  
                          element={
                            <ProtectedRoute>
                              <Accounts />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/categories"
                          element={
                            <ProtectedRoute>
                              <Categories />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/goals"
                          element={
                            <ProtectedRoute>
                              <Goals />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/notifications"
                          element={
                            <ProtectedRoute>
                              <Notifications />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/reports"
                          element={
                            <ProtectedRoute>
                              <Reports />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          }
                        />

                        {/* Redirection par défaut */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </RecurringTransactionProvider>
                  </GoalProvider>
                </CategoryProvider>
              </TransactionProvider>
            </AccountProvider>  
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;


