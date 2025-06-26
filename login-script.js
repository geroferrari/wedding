// Base de datos de invitados (en una aplicación real esto estaría en un servidor)
const invitados = {
  FAM001: {
    nombre: "Familia García",
    cantidad: 4,
    nombres: ["Juan García", "María García", "Ana García", "Luis García"],
  },
  FAM002: {
    nombre: "Familia Rodríguez",
    cantidad: 3,
    nombres: ["Carlos Rodríguez", "Laura Rodríguez", "Sofía Rodríguez"],
  },
  FAM003: {
    nombre: "Familia López",
    cantidad: 2,
    nombres: ["Pedro López", "Carmen López"],
  },
  AMI001: {
    nombre: "Grupo de Amigos del Colegio",
    cantidad: 6,
    nombres: ["Martín", "Lucía", "Diego", "Valentina", "Sebastián", "Camila"],
  },
  AMI002: {
    nombre: "Amigos de la Universidad",
    cantidad: 4,
    nombres: ["Nicolás", "Florencia", "Tomás", "Agustina"],
  },
  TRA001: {
    nombre: "Compañeros de Trabajo",
    cantidad: 3,
    nombres: ["Roberto", "Patricia", "Alejandro"],
  },
  TIO001: {
    nombre: "Tíos y Primos",
    cantidad: 5,
    nombres: ["Tío Miguel", "Tía Rosa", "Primo Javier", "Prima Elena", "Prima Carla"],
  },
  VEC001: {
    nombre: "Vecinos",
    cantidad: 2,
    nombres: ["Señora Martha", "Señor Alberto"],
  },
  TEST: {
    nombre: "Invitado de Prueba",
    cantidad: 1,
    nombres: ["Usuario Test"],
  },
};

class LoginManager {
  constructor() {
    this.loginForm = null;
    this.errorMessage = null;
    this.codigoInput = null;
    this.submitButton = null;
    this.isSubmitting = false;
    
    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.initializeElements();
      this.checkExistingLogin();
      this.setupEventListeners();
    });
  }

  initializeElements() {
    this.loginForm = document.getElementById("loginForm");
    this.errorMessage = document.getElementById("error-message");
    this.codigoInput = document.getElementById("codigo");
    this.submitButton = this.loginForm?.querySelector('button[type="submit"]');

    if (!this.loginForm || !this.errorMessage || !this.codigoInput || !this.submitButton) {
      console.error("Required elements not found");
      return;
    }
  }

  checkExistingLogin() {
    try {
      const usuarioLogueado = localStorage.getItem("invitado_logueado");
      if (usuarioLogueado) {
        const userData = JSON.parse(usuarioLogueado);
        // Validate stored data
        if (userData.codigo && userData.nombre) {
          this.redirectToMain();
        } else {
          // Clear invalid data
          localStorage.removeItem("invitado_logueado");
        }
      }
    } catch (error) {
      console.error("Error checking existing login:", error);
      localStorage.removeItem("invitado_logueado");
    }
  }

  setupEventListeners() {
    if (!this.loginForm) return;

    this.loginForm.addEventListener("submit", (e) => this.handleSubmit(e));
    this.codigoInput.addEventListener("input", () => this.clearError());
    this.codigoInput.addEventListener("keydown", (e) => this.handleKeyDown(e));
    
    // Focus management
    this.codigoInput.focus();
  }

  handleKeyDown(e) {
    // Allow only alphanumeric characters and navigation keys
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ];
    
    if (!allowedKeys.includes(e.key) && !e.key.match(/^[a-zA-Z0-9]$/)) {
      e.preventDefault();
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (this.isSubmitting) return;
    
    const codigo = this.codigoInput.value.trim().toUpperCase();
    
    if (!codigo) {
      this.showError("Por favor, ingresá tu código de invitación.");
      return;
    }

    if (codigo.length < 3) {
      this.showError("El código debe tener al menos 3 caracteres.");
      return;
    }

    this.isSubmitting = true;
    this.setLoadingState(true);
    
    try {
      await this.verifyCode(codigo);
    } catch (error) {
      console.error("Login error:", error);
      this.showError("Ocurrió un error. Por favor, intentá nuevamente.");
    } finally {
      this.isSubmitting = false;
    }
  }

  async verifyCode(codigo) {
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    if (invitados[codigo]) {
      await this.handleSuccessfulLogin(codigo);
    } else {
      this.handleFailedLogin();
    }
  }

  async handleSuccessfulLogin(codigo) {
    const datosInvitado = {
      codigo: codigo,
      ...invitados[codigo],
      fechaLogin: new Date().toISOString(),
      sessionId: this.generateSessionId()
    };

    try {
      localStorage.setItem("invitado_logueado", JSON.stringify(datosInvitado));
      
      this.setSuccessState();
      
      // Redirect after showing success message
      setTimeout(() => {
        this.redirectToMain();
      }, 1500);
      
    } catch (error) {
      console.error("Error saving login data:", error);
      this.showError("Error al guardar los datos. Por favor, intentá nuevamente.");
      this.setLoadingState(false);
    }
  }

  handleFailedLogin() {
    this.showError("Código incorrecto. Por favor, verificá tu invitación.");
    this.setLoadingState(false);
    this.codigoInput.value = "";
    this.codigoInput.focus();
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
      this.clearError();
    }, 5000);
  }

  setLoadingState(isLoading) {
    if (!this.submitButton) return;
    
    this.submitButton.disabled = isLoading;
    
    if (isLoading) {
      this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Verificando...';
    } else {
      this.submitButton.innerHTML = '<i class="fas fa-key" aria-hidden="true"></i> Ingresar';
    }
  }

  setSuccessState() {
    if (!this.submitButton) return;
    
    this.submitButton.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> ¡Bienvenido!';
    this.submitButton.style.backgroundColor = "#10b981";
    this.clearError();
  }

  showError(message) {
    if (!this.errorMessage) return;
    
    this.errorMessage.querySelector('span').textContent = message;
    this.errorMessage.style.display = "flex";
    this.errorMessage.setAttribute('aria-hidden', 'false');
    
    // Announce error to screen readers
    this.announceToScreenReader(message);
  }

  clearError() {
    if (!this.errorMessage) return;
    
    this.errorMessage.style.display = "none";
    this.errorMessage.setAttribute('aria-hidden', 'true');
  }

  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  redirectToMain() {
    window.location.href = "index.html";
  }
}

// Utility class for screen reader only content
const srOnlyStyles = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

// Add sr-only styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = srOnlyStyles;
document.head.appendChild(styleSheet);

// Initialize login manager
new LoginManager();

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
