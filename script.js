// ============================================
// FASTRINGGIT LOAN FORM - JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('customerForm');
    const successMessage = document.getElementById('successMessage');
    const reasonTextarea = document.getElementById('reason');
    const charCount = document.getElementById('charCount');

    // Character counter for textarea
    reasonTextarea.addEventListener('input', function() {
        charCount.textContent = this.value.length;
        if (this.value.length > 500) {
            this.value = this.value.substring(0, 500);
            charCount.textContent = 500;
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate form
        if (validateForm()) {
            // Collect form data
            const formData = collectFormData();

            // Log data (for testing/debugging)
            console.log('Form Data:', formData);

            // Send to server or email (replace with your backend)
            submitForm(formData);
        }
    });

    // Form reset
    document.querySelector('.btn-reset').addEventListener('click', function() {
        clearAllErrors();
    });
});

// ============================================
// VALIDATION FUNCTIONS
// ============================================

function validateForm() {
    clearAllErrors();
    let isValid = true;

    // Validate Nama (Name)
    const nama = document.getElementById('nama').value.trim();
    if (!nama || nama.length < 3) {
        showError('nama', 'Nama mesti sekurang-kurangnya 3 aksara');
        isValid = false;
    }

    // Validate IC Number
    const ic = document.getElementById('ic').value.trim();
    if (!validateIC(ic)) {
        showError('ic', 'Sila masukkan IC dalam format XXXXXX-XX-XXXX (contoh: 990515-10-1234)');
        isValid = false;
    }

    // Validate Phone Number
    const phone = document.getElementById('phone').value.trim();
    if (!validatePhone(phone)) {
        showError('phone', 'Sila masukkan 10 digit nombor telefon (contoh: 0123456789)');
        isValid = false;
    }

    // Validate Loan Package
    const packageValue = document.getElementById('package').value;
    if (!packageValue) {
        showError('package', 'Sila pilih pakej pinjaman');
        isValid = false;
    }

    // Validate End Date
    const endDate = document.getElementById('endDate').value;
    if (!endDate) {
        showError('endDate', 'Sila pilih tarikh akhir pinjaman');
        isValid = false;
    } else if (!validateEndDate(endDate)) {
        showError('endDate', 'Tarikh akhir mesti lebih awal daripada hari ini');
        isValid = false;
    }

    // Validate Reason
    const reason = document.getElementById('reason').value.trim();
    if (!reason || reason.length < 10) {
        showError('reason', 'Sila jelaskan alasan tunggakan (sekurang-kurangnya 10 aksara)');
        isValid = false;
    }

    // Validate Agreement Checkbox
    const agreement = document.getElementById('agreement').checked;
    if (!agreement) {
        showError('agreement', 'Sila setujui bahawa maklumat adalah benar dan tepat');
        isValid = false;
    }

    return isValid;
}

// ============================================
// VALIDATION HELPER FUNCTIONS
// ============================================

function validateIC(ic) {
    // Format: XXXXXX-XX-XXXX (Malaysia IC format)
    const icRegex = /^\d{6}-\d{2}-\d{4}$/;
    return icRegex.test(ic);
}

function validatePhone(phone) {
    // Malaysia phone: 10 digits, must start with 0
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
}

function validateEndDate(dateString) {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Date should be today or in the future (since it's loan end date)
    return selectedDate >= today;
}

// ============================================
// ERROR DISPLAY FUNCTIONS
// ============================================

function showError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    const formGroup = document.getElementById(fieldName).parentElement;

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    formGroup.classList.add('error');
}

function clearAllErrors() {
    // Clear all error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
    });

    // Remove error class from all form groups
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error');
    });

    // Clear all input fields
    document.getElementById('customerForm').reset();
}

// ============================================
// DATA COLLECTION
// ============================================

function collectFormData() {
    return {
        nama: document.getElementById('nama').value.trim(),
        ic: document.getElementById('ic').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        package: document.getElementById('package').value,
        endDate: document.getElementById('endDate').value,
        reason: document.getElementById('reason').value.trim(),
        submittedAt: new Date().toLocaleString('ms-MY'),
        timestamp: new Date().toISOString()
    };
}

// ============================================
// FORM SUBMISSION
// ============================================

function submitForm(formData) {
    // Show loading state (optional)
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Menghantar...';
    submitBtn.disabled = true;

    // Option 1: Send to Google Sheets via Google Apps Script
    // Uncomment and update the URL with your Google Apps Script URL
    /*
    fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => handleSuccess())
    .catch(error => handleError(error));
    */

    // Option 2: Send to your backend API
    // Uncomment and update the URL with your API endpoint
    /*
    fetch('https://your-backend.com/api/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => handleSuccess())
    .catch(error => handleError(error));
    */

    // Option 3: Save to localStorage (for testing)
    saveToLocalStorage(formData);

    // Option 4: Send email via EmailJS
    // Uncomment and update with your EmailJS credentials
    /*
    emailjs.init('YOUR_PUBLIC_KEY');
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        to_email: 'support@fastringgit.com',
        customer_name: formData.nama,
        customer_ic: formData.ic,
        customer_phone: formData.phone,
        loan_package: formData.package,
        loan_end_date: formData.endDate,
        delinquency_reason: formData.reason
    })
    .then(response => handleSuccess())
    .catch(error => handleError(error));
    */

    // For now, show success message after a short delay
    setTimeout(() => {
        handleSuccess();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// ============================================
// LOCAL STORAGE FUNCTIONS (For Testing)
// ============================================

function saveToLocalStorage(formData) {
    let submissions = [];
    
    // Get existing submissions
    const storedData = localStorage.getItem('fastringgitSubmissions');
    if (storedData) {
        submissions = JSON.parse(storedData);
    }

    // Add new submission
    submissions.push(formData);

    // Save back to localStorage
    localStorage.setItem('fastringgitSubmissions', JSON.stringify(submissions));

    // Log submissions (for debugging)
    console.log('All Submissions:', submissions);
}

function getSubmissionsFromLocalStorage() {
    const stored = localStorage.getItem('fastringgitSubmissions');
    return stored ? JSON.parse(stored) : [];
}

function exportToCSV() {
    const submissions = getSubmissionsFromLocalStorage();
    
    if (submissions.length === 0) {
        alert('Tiada data untuk diexport');
        return;
    }

    // Create CSV header
    const headers = ['Nama', 'IC.No', 'HP.No', 'Pakej Pinjaman', 'Tarikh Habis', 'Alasan Tunggakan', 'Dihantar Pada'];
    
    // Create CSV rows
    const rows = submissions.map(sub => [
        sub.nama,
        sub.ic,
        sub.phone,
        sub.package,
        sub.endDate,
        sub.reason,
        sub.submittedAt
    ]);

    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `fastringgit-submissions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ============================================
// SUCCESS/ERROR HANDLERS
// ============================================

function handleSuccess() {
    const form = document.getElementById('customerForm');
    const successMessage = document.getElementById('successMessage');

    // Hide form
    form.style.display = 'none';

    // Show success message
    successMessage.style.display = 'block';

    // Log success
    console.log('Form submitted successfully!');
}

function handleError(error) {
    console.error('Form submission error:', error);
    alert('Terjadi kesalahan saat mengirim borang. Sila cuba lagi nanti.');

    // Re-enable submit button
    const submitBtn = document.querySelector('.btn-submit');
    submitBtn.textContent = 'Hantar Borang';
    submitBtn.disabled = false;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Function to format phone number while typing
document.getElementById('phone')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    e.target.value = value;
});

// Function to format IC number while typing
document.getElementById('ic')?.addEventListener('input', function(e) {
    let value = e.target.value.toUpperCase().replace(/[^0-9-]/g, '');
    
    // Auto-format: XXXXXX-XX-XXXX
    if (value.length > 6 && value[6] !== '-') {
        value = value.substring(0, 6) + '-' + value.substring(6);
    }
    if (value.length > 9 && value[9] !== '-') {
        value = value.substring(0, 9) + '-' + value.substring(9);
    }
    if (value.length > 13) {
        value = value.substring(0, 13);
    }
    
    e.target.value = value;
});

// ============================================
// DEBUGGING FUNCTION
// ============================================

function debugLocalStorage() {
    const submissions = getSubmissionsFromLocalStorage();
    console.table(submissions);
    return submissions;
}

// Developer console commands (remove in production)
console.log('FastRinggit Form Loaded');
console.log('Debug: Type debugLocalStorage() to see all submissions');
console.log('Export: Type exportToCSV() to download submissions as CSV');
