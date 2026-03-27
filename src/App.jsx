import { useEffect, useMemo, useState } from 'react'
import Layout from './components/Layout.jsx'
import CategoryPage from './pages/Category.jsx'
import SubCategoryPage from './pages/SubCategory.jsx'
import ItemTypePage from './pages/ItemType.jsx'
import ItemPage from './pages/Item.jsx'

const DEFAULT_PATH = '/setup/category'

const PAGE_MAP = {
  '/setup/category': CategoryPage,
  '/setup/subcategory': SubCategoryPage,
  '/setup/item-type': ItemTypePage,
  '/setup/item': ItemPage,
}

function normalizePath(pathname) {
  return PAGE_MAP[pathname] ? pathname : DEFAULT_PATH
}

export default function App() {
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const normalized = normalizePath(window.location.pathname)
    if (normalized !== window.location.pathname) {
      window.history.replaceState({}, '', normalized)
    }

    const handlePopState = () => {
      setPathname(normalizePath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const CurrentPage = useMemo(() => PAGE_MAP[pathname] || CategoryPage, [pathname])

  function navigate(nextPath) {
    const targetPath = normalizePath(nextPath)
    if (targetPath === pathname) {
      return
    }

    window.history.pushState({}, '', targetPath)
    setPathname(targetPath)
  }

  return (
    <Layout currentPath={pathname} onNavigate={navigate}>
      <CurrentPage />
    </Layout>
  )
}
