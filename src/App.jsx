import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import CategoryPage from './pages/Category.jsx'
import SubCategoryPage from './pages/SubCategory.jsx'
import ItemTypePage from './pages/ItemType.jsx'
import ItemPage from './pages/Item.jsx'
import ExpenseHeadPage from './pages/ExpenseHead.jsx'
import ExpenseVoucherPage from './pages/ExpenseVoucher.jsx'
import ExpenseSalesReportPage from './pages/ExpenseSalesReport.jsx'
import ManufacturerPage from './pages/Manufacturer.jsx'
import SupplierPage from './pages/Supplier.jsx'
import CustomerPage from './pages/Customer.jsx'
import SalesPage from './pages/Sales.jsx'
import BookingsPage from './pages/Bookings.jsx'
import PurchasePage from './pages/Purchase.jsx'
import OpeningStockPage from './pages/OpeningStock.jsx'
import ExpiryTagsPage from './pages/ExpiryTags.jsx'
import ReorderManagementPage from './pages/ReorderManagement.jsx'
import ClosingStockPage from './pages/ClosingStock.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

const DEFAULT_PATH = '/setup/category'

const PAGE_MAP = {
  '/setup/category': CategoryPage,
  '/setup/subcategory': SubCategoryPage,
  '/setup/item-type': ItemTypePage,
  '/setup/item': ItemPage,
  '/stock/opening': OpeningStockPage,
  '/stock/expiry-tags': ExpiryTagsPage,
  '/stock/reorder': ReorderManagementPage,
  '/stock/closing': ClosingStockPage,
  '/setup/manufacturer': ManufacturerPage,
  '/setup/supplier': SupplierPage,
  '/setup/customer': CustomerPage,
  '/sales/invoice': SalesPage,
  '/bookings': BookingsPage,
  '/purchases/entry': PurchasePage,
  '/expenses/head': ExpenseHeadPage,
  '/expenses/voucher': ExpenseVoucherPage,
  '/expenses/report': ExpenseSalesReportPage,
}

function normalizePath(pathname) {
  return PAGE_MAP[pathname] ? pathname : DEFAULT_PATH
}

export default function App() {
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname))
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true')
  const [authView, setAuthView] = useState('login')

  useEffect(() => {
    const handlePopState = () => setPathname(normalizePath(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const CurrentPage = useMemo(() => PAGE_MAP[pathname] || CategoryPage, [pathname])

  function navigate(nextPath) {
    const targetPath = normalizePath(nextPath)
    window.history.pushState({}, '', targetPath)
    setPathname(targetPath)
  }

  const handleAuthSuccess = () => {
    setIsLoggedIn(true)
    localStorage.setItem('isLoggedIn', 'true')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('isLoggedIn')
    setAuthView('login')
  }

  // Auth View (Login/Register)
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        {authView === 'login' ? (
          <Login onLogin={handleAuthSuccess} onSwitchToRegister={() => setAuthView('register')} />
        ) : (
          <Register onSwitchToLogin={() => setAuthView('login')} />
        )}
      </div>
    )
  }

  // Dashboard View — Sidebar owns the layout shell; CurrentPage renders inside it as a child
  return (
    <Sidebar currentPath={pathname} onNavigate={navigate} onLogout={handleLogout}>
      <CurrentPage />
    </Sidebar>
  )
}