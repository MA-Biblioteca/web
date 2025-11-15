import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string | null) => void
  userData: {
    email: string
    id: number
    firstName?: string
    lastName?: string
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem('token')
  })

  const [userData, setUserData] = useState<{
    id: number
    email: string
    firstName?: string
    lastName?: string
  }>({ email: '', id: 0 })

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        setTokenState(e.newValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token')
      if (currentToken !== token) {
        setTokenState(currentToken)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [token])

  const decodeToken = (token: string) => {
    try {
      const payload = token.split('.')[1]
      const decoded = JSON.parse(atob(payload))
      return decoded
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('token', newToken)
      const { email, firstName, lastName, id } = decodeToken(newToken)
      setUserData({ email, firstName, lastName, id })
    } else {
      localStorage.removeItem('token')
      setUserData({ email: '', id: 0 })
    }
    setTokenState(newToken)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        setToken,
        userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
