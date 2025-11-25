// js/utils.js - Utility functions for HelpEthiopia

// Form validation utilities
const FormValidator = {
    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate phone number (Ethiopian format)
    isValidPhone(phone) {
        const phoneRegex = /^\+?251[0-9]{9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    },

    // Validate required field
    isNotEmpty(value) {
        return value && value.trim().length > 0;
    },

    // Validate minimum length
    hasMinLength(value, minLength) {
        return value && value.length >= minLength;
    },

    // Show error message
    showError(inputElement, message) {
        // Remove existing error
        this.clearError(inputElement);
        
        // Create error element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.color = 'var(--primary-red)';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        
        // Insert after input
        inputElement.parentNode.appendChild(errorDiv);
        inputElement.style.borderColor = 'var(--primary-red)';
    },

    // Clear error message
    clearError(inputElement) {
        const errorDiv = inputElement.parentNode.querySelector('.form-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        inputElement.style.borderColor = '#e0e0e0';
    },

    // Validate entire form
    validateForm(formElement) {
        let isValid = true;
        const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            this.clearError(input);
            
            if (!this.isNotEmpty(input.value)) {
                this.showError(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && !this.isValidEmail(input.value)) {
                this.showError(input, 'Please enter a valid email address');
                isValid = false;
            } else if (input.type === 'tel' && !this.isValidPhone(input.value)) {
                this.showError(input, 'Please enter a valid Ethiopian phone number (+251...)');
                isValid = false;
            } else if (input.type === 'password' && !this.hasMinLength(input.value, 6)) {
                this.showError(input, 'Password must be at least 6 characters');
                isValid = false;
            }
        });
        
        return isValid;
    }
};

// Image preview utility
const ImagePreview = {
    // Show preview of selected image
    showPreview(fileInput, previewElement) {
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                if (!previewElement) {
                    // Create preview element if it doesn't exist
                    previewElement = document.createElement('img');
                    previewElement.style.maxWidth = '200px';
                    previewElement.style.maxHeight = '200px';
                    previewElement.style.marginTop = '10px';
                    previewElement.style.borderRadius = '10px';
                    previewElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    fileInput.parentNode.appendChild(previewElement);
                }
                previewElement.src = e.target.result;
            };
            
            reader.readAsDataURL(fileInput.files[0]);
        }
    }
};

// Notification utility
const Notification = {
    // Show success notification
    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    },

    // Show error notification
    error(message, duration = 3000) {
        this.show(message, 'error', duration);
    },

    // Show info notification
    info(message, duration = 3000) {
        this.show(message, 'info', duration);
    },

    // Show notification
    show(message, type = 'info', duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style notification
        const colors = {
            success: 'var(--primary-green)',
            error: 'var(--primary-red)',
            info: 'var(--primary-yellow)'
        };
        
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.background = colors[type] || colors.info;
        notification.style.color = type === 'info' ? 'var(--dark)' : 'white';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '10px';
        notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        notification.style.zIndex = '10000';
        notification.style.animation = 'slideIn 0.3s ease';
        notification.style.maxWidth = '300px';
        notification.style.fontWeight = '500';
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after duration
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }
};

// Add CSS animations for notifications
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Search and filter utilities
const SearchFilter = {
    // Debounce function for search input
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Highlight search terms in text
    highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark style="background: var(--primary-yellow); padding: 2px;">$1</mark>');
    }
};

// Date formatting utility
const DateFormatter = {
    // Format date to readable string
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        }
    },

    // Get relative time
    getRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffMinutes < 60) {
            return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        }
    }
};

// Loading spinner utility
const LoadingSpinner = {
    show(element) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
            <div style="
                border: 4px solid #f3f3f3;
                border-top: 4px solid var(--primary-green);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 20px auto;
            "></div>
        `;
        
        // Add spin animation
        if (!document.getElementById('spinner-styles')) {
            const style = document.createElement('style');
            style.id = 'spinner-styles';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        element.innerHTML = '';
        element.appendChild(spinner);
    },

    hide(element) {
        const spinner = element.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }
};
