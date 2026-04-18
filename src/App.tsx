import { lazy, Suspense, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Benefits from './components/Benefits.jsx'
import Preview from './components/Preview.jsx'
import Problem from './components/Problem.jsx'
import Solution from './components/Solution.jsx'
import CTA from './components/CTA.jsx'
import Footer from './components/Footer.jsx'
import AuthPage from './components/AuthPage.jsx'
import Sidebar from './components/post-login/Sidebar.jsx'
import Topbar from './components/post-login/Topbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreatePresskit from './pages/CreatePresskit.jsx'
import PublicPresskit from './pages/PublicPresskit.jsx'
import Checkout from './pages/Checkout.jsx'
import { auth } from './lib/firebase'

const PresskitPDF = lazy(() => import('./pages/PresskitPDF.jsx'))

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      
      // Si el usuario está autenticado y está en la página de inicio, redirigir al dashboard
      if (firebaseUser && window.location.pathname === '/') {
        window.location.assign('/dashboard')
      }
    })

    return () => unsubscribe()
  }, [])

  const isAuthPage = pathname === '/auth'
  const isDashboardPage = pathname === '/dashboard'
  const isCreatePresskitPage = pathname === '/createPresskit'
  const isCheckoutPage = pathname === '/checkout'
  const isPresskitPdfPage = pathname === '/presskitPDF'
  const isPublicPresskitPage = pathname.startsWith('/presskit/')
  const publicPresskitId = isPublicPresskitPage ? pathname.replace('/presskit/', '') : ''

  const handleSignOut = async () => {
    await signOut(auth)
    window.location.assign('/')
  }

  return (
    <div className="bg-zinc-950 text-zinc-100">
      {isAuthPage ? (
        <main>
          <AuthPage />
        </main>
      ) : isDashboardPage ? (
        user ? (
          <main className="mx-auto flex min-h-screen w-full max-w-400 gap-6 px-6 py-8 lg:px-12">
            <div className="hidden w-72 shrink-0 lg:block">
              <Sidebar user={user} />
            </div>
            <div className="flex-1 space-y-6">
              <Topbar user={user} onSignOut={handleSignOut} />
              <Dashboard user={user} />
            </div>
          </main>
        ) : (
          <main>
            <AuthPage />
          </main>
        )
      ) : isCreatePresskitPage ? (
        user ? (
          <main>
            <CreatePresskit user={user} onSignOut={handleSignOut} />
          </main>
        ) : (
          <main>
            <AuthPage />
          </main>
        )
      ) : isCheckoutPage ? (
        user ? (
          <main>
            <Checkout user={user} onSignOut={handleSignOut} />
          </main>
        ) : (
          <main>
            <AuthPage />
          </main>
        )
      ) : isPresskitPdfPage ? (
        user ? (
          <main>
            <Suspense fallback={<div className="px-6 py-8 text-sm text-zinc-300">Cargando modulo PDF...</div>}>
              <PresskitPDF user={user} onSignOut={handleSignOut} />
            </Suspense>
          </main>
        ) : (
          <main>
            <AuthPage />
          </main>
        )
      ) : isPublicPresskitPage ? (
        <main>
          <PublicPresskit presskitId={publicPresskitId} />
        </main>
      ) : (
        <>
          <Navbar user={user} />
          <main>
            <Hero />
            <HowItWorks />
            <Benefits />
            <Preview />
            <Problem />
            <Solution />
            <CTA />
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}

export default App
