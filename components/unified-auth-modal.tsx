"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Eye, EyeOff } from "lucide-react"
import { ModalWrapper } from "./modal-wrapper"
import { AuthTabs } from "./auth-tabs"
import { InputField } from "./input-field"
import { PrimaryButton } from "./primary-button"
import { PhoneInputWithCode } from "./phone-input-with-code"
import { FileUploadField } from "./file-upload-field"
import { useModal } from "../hooks/use-modal"
import { useAuthStore } from "../lib/store/auth.store"

interface UnifiedAuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "login" | "signup"
  initialRole?: "client" | "reseller" | "isv"
}

export function UnifiedAuthModal({ 
  isOpen, 
  onClose, 
  initialMode = "login", 
  initialRole = "client" 
}: UnifiedAuthModalProps) {
  const { authMode, authRole, setAuthMode, setAuthRole } = useModal()
  const { login, signup, isLoading, error, clearError } = useAuthStore()
  
  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [registeredName, setRegisteredName] = useState("")
  const [registeredAddress, setRegisteredAddress] = useState("")
  const [domain, setDomain] = useState("")
  const [whitelistedDomain, setWhitelistedDomain] = useState("")
  const [countryCode, setCountryCode] = useState("IND")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [mouFile, setMouFile] = useState<File | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  // Stable onChange handler for password to prevent focus loss
  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }, [])

  // Remember credentials functions
  const saveCredentials = (email: string, password: string) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('remembered_email', email)
        localStorage.setItem('remembered_password', password)
      } catch (e) {
        console.error('Error saving credentials:', e)
      }
    }
  }

  const loadCredentials = () => {
    if (typeof window !== 'undefined') {
      try {
        const savedEmail = localStorage.getItem('remembered_email')
        const savedPassword = localStorage.getItem('remembered_password')
        if (savedEmail) setEmail(savedEmail)
        if (savedPassword) setPassword(savedPassword)
      } catch (e) {
        console.error('Error loading credentials:', e)
      }
    }
  }

  // Initialize with props
  useEffect(() => {
    if (initialMode) setAuthMode(initialMode)
    if (initialRole) setAuthRole(initialRole)
  }, [initialMode, initialRole, setAuthMode, setAuthRole])

  // Load saved credentials when modal opens in login mode
  useEffect(() => {
    if (isOpen && authMode === "login") {
      loadCredentials()
    }
  }, [isOpen, authMode])

  // Clear form when switching modes or roles
  useEffect(() => {
    if (authMode === "signup") {
      // Clear all fields when switching to signup
      setEmail("")
      setPassword("")
      setName("")
      setCompany("")
      setContactNumber("")
      setRegisteredName("")
      setRegisteredAddress("")
      setDomain("")
      setWhitelistedDomain("")
      setCountryCode("IND")
      setLogoFile(null)
      setMouFile(null)
      clearError()
    } else if (authMode === "login") {
      // When switching to login, only clear non-credential fields
      setName("")
      setCompany("")
      setContactNumber("")
      setRegisteredName("")
      setRegisteredAddress("")
      setDomain("")
      setWhitelistedDomain("")
      setCountryCode("IND")
      setLogoFile(null)
      setMouFile(null)
      clearError()
    }
  }, [authMode, authRole, clearError])

  // Load credentials when modal opens in login mode
  useEffect(() => {
    if (isOpen && authMode === "login") {
      loadCredentials()
    }
  }, [isOpen, authMode])

  const handleLogin = async () => {
    clearError()
    
    if (!email || !password) {
      return
    }

    const result = await login(email, password)
    
    if (result.success) {
      // Always remember credentials by default
      saveCredentials(email, password)
      onClose()
      if (result.redirect) {
        window.location.href = result.redirect
      }
    }
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const handleSignup = async () => {
    clearError()
    
    if (!email || !password || !name) {
      return
    }

    // Build signup data based on role
    const signupData: any = {
      email,
      password,
      role: authRole
    }

    // Add role-specific fields
    if (authRole === "client") {
      signupData.client_name = name
      signupData.client_company = company
      signupData.client_mob_no = contactNumber
    } else if (authRole === "reseller") {
      signupData.reseller_name = name
      signupData.reseller_registered_name = registeredName
      signupData.reseller_address = registeredAddress
      signupData.reseller_domain = domain
      signupData.reseller_mob_no = contactNumber
      signupData.reseller_country_code = countryCode
      signupData.reseller_whitelisted_domain = whitelistedDomain
      
      // Convert logo file to base64
      if (logoFile) {
        try {
          signupData.reseller_logo = await convertFileToBase64(logoFile)
        } catch (error) {
          console.error("Error converting logo file:", error)
        }
      }
    } else if (authRole === "isv") {
      signupData.isv_name = name
      signupData.isv_registered_name = registeredName
      signupData.isv_address = registeredAddress
      signupData.isv_domain = domain
      signupData.isv_mob_no = contactNumber
      signupData.isv_country_code = countryCode
      
      // Convert MOU file to base64
      if (mouFile) {
        try {
          signupData.isv_mou = await convertFileToBase64(mouFile)
        } catch (error) {
          console.error("Error converting MOU file:", error)
        }
      }
    }

    const result = await signup(signupData)
    
    if (result.success) {
      onClose()
      if (result.redirect) {
        window.location.href = result.redirect
      }
    }
  }

  const handleSubmit = () => {
    if (authMode === "login") {
      handleLogin()
    } else {
      handleSignup()
    }
  }

  const toggleMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login")
  }

  const isFormValid = () => {
    if (authMode === "login") {
      return email.length > 0 && password.length > 0
    } else {
      const baseValid = email.length > 0 && password.length > 0 && name.length > 0
      
      if (authRole === "client") {
        return baseValid && company.length > 0 && contactNumber.length > 0
      } else if (authRole === "reseller") {
        return baseValid && 
               registeredName.length > 0 && 
               registeredAddress.length > 0 && 
               domain.length > 0 && 
               contactNumber.length > 0 &&
               logoFile !== null
      } else if (authRole === "isv") {
        return baseValid && 
               registeredName.length > 0 && 
               registeredAddress.length > 0 && 
               domain.length > 0 && 
               contactNumber.length > 0 &&
               mouFile !== null
      }
      return baseValid
    }
  }

  // PasswordField component - memoized to prevent recreation and focus loss
  const renderPasswordField = useCallback(({
    label = "Password",
    withForgotLink = false,
  }: {
    label?: string
    withForgotLink?: boolean
  }) => (
      <div className="space-y-2">
        {withForgotLink ? (
          <div className="flex items-center justify-between">
            <label 
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0%",
                color: "#555555",
              }}
            >
              {label}
            </label>
            <button 
              type="button" 
              className="hover:underline"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "12px",
                lineHeight: "24px",
                letterSpacing: "0%",
                color: "#555555",
              }}
            >
              Forgot password?
            </button>
          </div>
        ) : (
          <label 
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "24px",
              letterSpacing: "0%",
              color: "#555555",
            }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={passwordInputRef}
            type={showPassword ? "text" : "password"}
            placeholder="Set your secret key"
            value={password}
            onChange={handlePasswordChange}
            autoComplete={authMode === "login" ? "current-password" : "new-password"}
            name="password"
            id="password"
            className="w-full px-4 pr-12 outline-none transition-colors focus:border-gray-400 focus:ring-1 focus:ring-gray-400 placeholder:italic placeholder:text-gray-400"
            style={{
              width: "100%",
              maxWidth: "504px",
              height: "42px",
              borderRadius: "4px",
              border: "1px solid #E5E7EB",
              backgroundColor: "#FFFFFF",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "28px",
              letterSpacing: "0%",
              color: password ? "#181818" : "#B3B3B3",
            }}
            onFocus={(e) => {
              e.target.style.color = "#181818"
            }}
            onBlur={(e) => {
              e.target.style.color = e.target.value ? "#181818" : "#B3B3B3"
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
    ), [password, showPassword, authMode, handlePasswordChange])

  if (!isOpen) return null

  return (
    <>
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/40"
      onClick={onClose}
    >
      <div className="min-h-full flex flex-col items-center justify-center py-8">
        <ModalWrapper 
          isOpen={isOpen} 
          onClose={onClose}
          showOverlay={authMode === "signup"}
          onOverlayAction={() => {
            setAuthMode("login")
            clearError()
          }}
          showLoginOverlay={authMode === "login"}
          onLoginOverlayAction={() => {
            setAuthMode("signup")
            clearError()
          }}
        >
          <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h2 
            className="font-bold"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontStyle: "normal",
              fontSize: "24px",
              lineHeight: "100%",
              letterSpacing: "0px",
              textAlign: "center",
              verticalAlign: "middle",
              background: "linear-gradient(90deg, #2F0368 0%, #5E04D2 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            {authMode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p 
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "150%",
              letterSpacing: "-0.4px",
              textAlign: "center",
              verticalAlign: "middle",
              color: "#65717C",
            }}
          >
            {authMode === "login"
              ? "Access Tangram AI with your credentials."
              : "Choose your profile type and share the essentials to get started."}
          </p>
        </div>

        {/* User Type Selection */}
        <div className="mb-4">
          <AuthTabs activeTab={authRole} onTabChange={setAuthRole} />
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form 
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          autoComplete="on"
        >
          <div className="space-y-3">
            <div className="space-y-2">
              <label 
                htmlFor="email"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "24px",
                  letterSpacing: "0%",
                  color: "#555555",
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                name="email"
                id="email"
                className="w-full px-4 outline-none transition-colors focus:border-gray-400 focus:ring-1 focus:ring-gray-400 placeholder:italic placeholder:text-gray-400"
                style={{
                  width: "100%",
                  maxWidth: "504px",
                  height: "42px",
                  borderRadius: "4px",
                  border: "1px solid #E5E7EB",
                  backgroundColor: "#FFFFFF",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "28px",
                  letterSpacing: "0%",
                  color: email ? "#181818" : "#B3B3B3",
                }}
                onFocus={(e) => {
                  e.target.style.color = "#181818"
                }}
                onBlur={(e) => {
                  e.target.style.color = e.target.value ? "#181818" : "#B3B3B3"
                }}
              />
            </div>

            {(authMode === "login" || authRole === "reseller" || authRole === "isv") && (
              renderPasswordField({ withForgotLink: authMode === "login" })
            )}

          {authMode === "signup" && (
            <div className="space-y-3">
              <InputField
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChange={setName}
              />

              {authRole === "client" && (
                <div className="grid gap-3">
                  <InputField
                    label="Company"
                    placeholder="Your organisation name"
                    value={company}
                    onChange={setCompany}
                  />
                  <InputField
                    label="Contact Number"
                    placeholder="Phone number"
                    value={contactNumber}
                    onChange={setContactNumber}
                  />
                </div>
              )}

              {(authRole === "reseller" || authRole === "isv") && (
                <div className="space-y-3">
                  <div className="grid gap-3">
                    <InputField
                      label="Registered Name"
                      placeholder="Legal entity name"
                      value={registeredName}
                      onChange={setRegisteredName}
                    />
                    <InputField
                      label="Registered Address"
                      placeholder="Primary business address"
                      value={registeredAddress}
                      onChange={setRegisteredAddress}
                    />
                    <InputField
                      label="Domain"
                      placeholder="Primary domain (example.com)"
                      value={domain}
                      onChange={setDomain}
                    />
                    {authRole === "reseller" && (
                      <InputField
                        label="Whitelisted Domain"
                        placeholder="Optional secondary domain"
                        value={whitelistedDomain}
                        onChange={setWhitelistedDomain}
                      />
                    )}
                  </div>

                  <PhoneInputWithCode
                    label="Contact Number"
                    placeholder="Enter your contact number"
                    value={contactNumber}
                    countryCode={countryCode}
                    onValueChange={setContactNumber}
                    onCountryCodeChange={setCountryCode}
                    required
                  />

                  {authRole === "reseller" && (
                    <FileUploadField
                      label="Brand Logo"
                      accept="image/jpeg,image/png"
                      maxSize={5}
                      fileType="image"
                      description="JPEG or PNG, max 5MB, minimum 400×400px"
                      file={logoFile}
                      onFileChange={setLogoFile}
                      required
                    />
                  )}

                  {authRole === "isv" && (
                    <FileUploadField
                      label="MOU Document"
                      accept=".pdf,.doc,.docx"
                      maxSize={25}
                      fileType="document"
                      description="PDF or Word, max 25MB"
                      file={mouFile}
                      onFileChange={setMouFile}
                      required
                    />
                  )}
                </div>
              )}

              {authRole === "client" && renderPasswordField({})}
            </div>
          )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className="w-full uppercase transition-colors disabled:bg-gray-200 disabled:text-gray-400 mt-4"
            style={{
              width: "100%",
              maxWidth: "504px",
              height: "38px",
              borderRadius: "4px",
              backgroundColor: isLoading || !isFormValid() ? "#E5E7EB" : "#181818",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "100%",
              letterSpacing: "0.5px",
              textAlign: "center",
              verticalAlign: "middle",
              textTransform: "uppercase",
              color: isLoading || !isFormValid() ? "#9CA3AF" : "#FFFFFF",
            }}
          >
            {isLoading ? "Loading..." : authMode === "login" ? "Continue" : "Create Account"}
          </button>
        </form>
          </div>
        </ModalWrapper>

    {/* New section below main login window - separate element */}
    {isOpen && authMode === "login" && (
      <div 
        className="flex items-center justify-center mt-[10px]"
        style={{
          width: "560px",
          maxWidth: "560px",
          minWidth: "540px",
          padding: "0 20px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="relative overflow-hidden"
          style={{
            width: "540px",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
          }}
        >
          <div 
            className="relative bg-white flex items-center"
            style={{
              width: "100%",
              height: "62px",
              minHeight: "62px",
              border: "1px solid #E5E7EB",
              padding: "0 32px",
            }}
          >
            <div className="flex items-center justify-between w-full">
              <p style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "150%",
                letterSpacing: "-0.4px",
                verticalAlign: "middle",
                color: "#111827",
              }}>
                New to Tangram AI?{" "}
                <span style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "16px",
                  lineHeight: "150%",
                  letterSpacing: "-0.4px",
                  verticalAlign: "middle",
                  color: "#6B7280",
                }}>
                  Create an account
                </span>
              </p>
              <button 
                onClick={toggleMode} 
                className="uppercase transition-colors hover:bg-gray-200"
                style={{
                  width: "92px",
                  height: "37px",
                  maxWidth: "363.41px",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  padding: "12px 16px",
                  backgroundColor: "#FAFAFA",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0.5px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  textTransform: "uppercase",
                  color: "#181818",
                  whiteSpace: "nowrap",
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* New section below main signup window - separate element */}
    {isOpen && authMode === "signup" && (
      <div 
        className="flex items-center justify-center mt-[-10px]"
        style={{
          width: "580px",
          maxWidth: "580px",
          minWidth: "540px",
          padding: "0 20px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="relative overflow-hidden"
          style={{
            width: "600px",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
            padding: "10px",
          }}
        >
          <div 
            className="relative bg-white flex items-center"
            style={{
              width: "100%",
              height: "62px",
              minHeight: "62px",
              border: "1px solid #E5E7EB",
              padding: "0 32px",
            }}
          >
            <div className="flex items-center justify-between w-full" style={{ gap: "8px" }}>
              <p style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "150%",
                letterSpacing: "-0.4px",
                verticalAlign: "middle",
                color: "#111827",
                whiteSpace: "nowrap",
              }}>
                Already onboard{" "}
                <span style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "16px",
                  lineHeight: "150%",
                  letterSpacing: "-0.4px",
                  verticalAlign: "middle",
                  color: "#65717C",
                }}>
                  and have an existing account?
                </span>
              </p>
              <button 
                onClick={toggleMode} 
                className="uppercase transition-colors hover:bg-gray-200"
                style={{
                  width: "92px",
                  height: "37px",
                  maxWidth: "363.41px",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  padding: "12px 16px",
                  backgroundColor: "#FAFAFA",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0.5px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  textTransform: "uppercase",
                  color: "#181818",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
    </div>
    </>
  )
}
