import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { Snackbar, Alert, AlertColor } from '@mui/material'

interface SnackbarContextType {
  showSnackbar: (message: string, severity?: AlertColor) => void
  showError: (message: string) => void
  showSuccess: (message: string) => void
  showWarning: (message: string) => void
  showInfo: (message: string) => void
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
)

// Global notification service for use outside React components
let globalShowError: ((message: string) => void) | null = null

export const setGlobalErrorHandler = (handler: (message: string) => void) => {
  globalShowError = handler
}

export const showGlobalError = (message: string) => {
  if (globalShowError) {
    globalShowError(message)
  }
}

export const useSnackbar = () => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return context
}

interface SnackbarProviderProps {
  children: ReactNode
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor>('info')

  const showSnackbar = (msg: string, sev: AlertColor = 'info') => {
    setMessage(msg)
    setSeverity(sev)
    setOpen(true)
  }

  const showError = (msg: string) => showSnackbar(msg, 'error')
  const showSuccess = (msg: string) => showSnackbar(msg, 'success')
  const showWarning = (msg: string) => showSnackbar(msg, 'warning')
  const showInfo = (msg: string) => showSnackbar(msg, 'info')

  // Register global error handler
  useEffect(() => {
    setGlobalErrorHandler(showError)
    return () => {
      setGlobalErrorHandler(() => {})
    }
  }, [])

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  return (
    <SnackbarContext.Provider
      value={{ showSnackbar, showError, showSuccess, showWarning, showInfo }}
    >
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
