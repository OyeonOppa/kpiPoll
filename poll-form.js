// ========================================
// Date Input Enhancement
// ========================================

function initDateInput() {
    const dateInput = document.getElementById('interviewDate');
    
    if (dateInput) {
        // Set default date to today
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayString = `${year}-${month}-${day}`;
        
        dateInput.value = todayString;
        
        // Add click handler to open calendar when clicking anywhere on the input
        dateInput.addEventListener('click', function(e) {
            this.showPicker && this.showPicker();
        });
        
        // Also trigger on icon area
        dateInput.parentElement.addEventListener('click', function(e) {
            if (e.target !== dateInput) {
                dateInput.focus();
                dateInput.showPicker && dateInput.showPicker();
            }
        });
    }
}

// ========================================
// PDPA Modal
// ========================================

function initPDPAModal() {
    const viewPDPABtn = document.getElementById('viewPDPABtn');
    const pdpaModal = document.getElementById('pdpaModal');
    const closePDPAModal = document.getElementById('closePDPAModal');
    const pdpaModalOverlay = document.getElementById('pdpaModalOverlay');
    const acceptPDPABtn = document.getElementById('acceptPDPABtn');
    const pdpaConsent = document.getElementById('pdpaConsent');
    const submitBtn = document.getElementById('submitBtn');

    // Open modal
    if (viewPDPABtn) {
        viewPDPABtn.addEventListener('click', () => {
            pdpaModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal functions
    const closeModal = () => {
        pdpaModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closePDPAModal) {
        closePDPAModal.addEventListener('click', closeModal);
    }

    if (pdpaModalOverlay) {
        pdpaModalOverlay.addEventListener('click', closeModal);
    }

    // Accept and close
    if (acceptPDPABtn) {
        acceptPDPABtn.addEventListener('click', () => {
            if (pdpaConsent) {
                pdpaConsent.checked = true;
                submitBtn.disabled = false;
            }
            closeModal();
        });
    }

    // Enable/disable submit button based on PDPA consent
    if (pdpaConsent && submitBtn) {
        pdpaConsent.addEventListener('change', function() {
            submitBtn.disabled = !this.checked;
        });
    }

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pdpaModal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ========================================
// Form Progress Tracking
// ========================================

function updateProgress() {
    const form = document.getElementById('pollForm');
    const sections = form.querySelectorAll('.form-section');
    const requiredFields = form.querySelectorAll('[required]');
    
    let completedCount = 0;
    const radioCheckboxGroups = new Set();
    
    requiredFields.forEach(field => {
        if (field.type === 'radio' || field.type === 'checkbox') {
            const name = field.getAttribute('name');
            if (!radioCheckboxGroups.has(name)) {
                radioCheckboxGroups.add(name);
                const checked = form.querySelector(`[name="${name}"]:checked`);
                if (checked) completedCount++;
            }
        } else if (field.value.trim() !== '') {
            completedCount++;
        }
    });
    
    const totalRequired = radioCheckboxGroups.size + (requiredFields.length - Array.from(requiredFields).filter(f => f.type === 'radio' || f.type === 'checkbox').length);
    const percentage = Math.round((completedCount / totalRequired) * 100);
    
    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = percentage + '%';
        progressBar.style.background = `linear-gradient(90deg, #26513C ${percentage}%, #e0e0e0 ${percentage}%)`;
    }
    
    // Update progress text (exclude PDPA section from count)
    const sectionsWithoutPDPA = Array.from(sections).filter(s => !s.classList.contains('pdpa-section'));
    const currentSection = Math.min(Math.ceil((completedCount / totalRequired) * sectionsWithoutPDPA.length), sectionsWithoutPDPA.length);
    document.getElementById('progressText').textContent = `ส่วนที่ ${currentSection}/${sectionsWithoutPDPA.length}`;
    document.getElementById('progressPercent').textContent = percentage + '%';
}

// ========================================
// Conditional Fields (Show/Hide)
// ========================================

// Q5 - Show "Other" field
document.addEventListener('change', function(e) {
    if (e.target.name === 'q5') {
        const otherGroup = document.getElementById('q5_other_group');
        if (e.target.value === '9') {
            otherGroup.style.display = 'block';
            document.querySelector('[name="q5_other"]').required = true;
        } else {
            otherGroup.style.display = 'none';
            document.querySelector('[name="q5_other"]').required = false;
            document.querySelector('[name="q5_other"]').value = '';
        }
    }
});

// Q6 - Show "Other" field
document.addEventListener('change', function(e) {
    if (e.target.name === 'q6') {
        const otherGroup = document.getElementById('q6_other_group');
        if (e.target.value === '9') {
            otherGroup.style.display = 'block';
            document.querySelector('[name="q6_other"]').required = true;
        } else {
            otherGroup.style.display = 'none';
            document.querySelector('[name="q6_other"]').required = false;
            document.querySelector('[name="q6_other"]').value = '';
        }
    }
});

// Q11 - Show "Other" field and limit selection to 3
document.addEventListener('change', function(e) {
    if (e.target.name === 'q11[]') {
        const checkboxes = document.querySelectorAll('[name="q11[]"]');
        const checked = Array.from(checkboxes).filter(cb => cb.checked);
        
        // Check if "บุคคลอื่น" is selected
        const otherCheckbox = Array.from(checkboxes).find(cb => cb.value === '11');
        const otherGroup = document.getElementById('q11_other_group');
        
        if (otherCheckbox && otherCheckbox.checked) {
            otherGroup.style.display = 'block';
            document.querySelector('[name="q11_other"]').required = true;
        } else {
            otherGroup.style.display = 'none';
            document.querySelector('[name="q11_other"]').required = false;
            document.querySelector('[name="q11_other"]').value = '';
        }
        
        // Limit to 3 selections
        if (checked.length > 3) {
            e.target.checked = false;
            Swal.fire({
                icon: 'warning',
                title: 'เลือกได้สูงสุด 3 ข้อ',
                text: 'กรุณาเลือกไม่เกิน 3 ข้อ',
                confirmButtonColor: '#26513C',
                timer: 2000
            });
        }
    }
});

// ========================================
// Form Validation
// ========================================

function validateForm() {
    const form = document.getElementById('pollForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;
    
    // Check Q11 - must select at least 1
    const q11Checkboxes = form.querySelectorAll('[name="q11[]"]');
    const q11Checked = Array.from(q11Checkboxes).filter(cb => cb.checked);
    
    if (q11Checked.length === 0) {
        isValid = false;
        const q11Group = q11Checkboxes[0].closest('.form-group');
        if (!firstInvalidField) {
            firstInvalidField = q11Group;
            q11Group.style.animation = 'shake 0.5s';
            setTimeout(() => {
                q11Group.style.animation = '';
            }, 500);
        }
    }
    
    requiredFields.forEach(field => {
        const formGroup = field.closest('.form-group');
        
        if (field.type === 'radio') {
            const name = field.getAttribute('name');
            const checked = form.querySelector(`[name="${name}"]:checked`);
            
            if (!checked && !firstInvalidField) {
                isValid = false;
                firstInvalidField = formGroup;
                formGroup.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    formGroup.style.animation = '';
                }, 500);
            }
        } else if (field.value.trim() === '') {
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = formGroup;
                formGroup.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    formGroup.style.animation = '';
                }, 500);
            }
            field.style.borderColor = '#e74c3c';
        } else {
            field.style.borderColor = '#e0e0e0';
        }
    });
    
    if (!isValid && firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    return isValid;
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    
    .help-text {
        font-size: 0.9em;
        color: #7f8c8d;
        margin-top: 10px;
        font-style: italic;
    }
    
    .form-input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 1em;
        font-family: 'Sarabun', sans-serif;
        transition: all 0.3s;
    }
    
    .form-input:focus {
        outline: none;
        border-color: #26513C;
        box-shadow: 0 0 0 3px rgba(38, 81, 60, 0.1);
    }
    
    #progressBar {
        height: 8px;
        background: linear-gradient(90deg, #26513C 0%, #e0e0e0 0%);
        border-radius: 10px;
        transition: all 0.5s ease;
    }
`;
document.head.appendChild(style);

// ========================================
// Auto Save to LocalStorage
// ========================================

function saveFormData() {
    const form = document.getElementById('pollForm');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    localStorage.setItem('kpiPollData', JSON.stringify(data));
    localStorage.setItem('kpiPollTimestamp', new Date().toISOString());
}

function loadFormData() {
    const savedData = localStorage.getItem('kpiPollData');
    const timestamp = localStorage.getItem('kpiPollTimestamp');
    
    if (savedData && timestamp) {
        const data = JSON.parse(savedData);
        const savedDate = new Date(timestamp);
        const now = new Date();
        const daysDiff = (now - savedDate) / (1000 * 60 * 60 * 24);
        
        // Only load if saved within 7 days
        if (daysDiff < 7) {
            Swal.fire({
                title: 'พบข้อมูลที่บันทึกไว้',
                text: `มีข้อมูลที่บันทึกไว้เมื่อ ${savedDate.toLocaleString('th-TH')} ต้องการโหลดข้อมูลหรือไม่?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#26513C',
                cancelButtonColor: '#7f8c8d',
                confirmButtonText: 'โหลดข้อมูล',
                cancelButtonText: 'เริ่มใหม่'
            }).then((result) => {
                if (result.isConfirmed) {
                    fillFormData(data);
                    updateProgress();
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'โหลดข้อมูลสำเร็จ',
                        text: 'ข้อมูลที่บันทึกไว้ถูกโหลดเรียบร้อยแล้ว',
                        confirmButtonColor: '#26513C',
                        timer: 2000
                    });
                } else {
                    localStorage.removeItem('kpiPollData');
                    localStorage.removeItem('kpiPollTimestamp');
                }
            });
        } else {
            // Clear old data
            localStorage.removeItem('kpiPollData');
            localStorage.removeItem('kpiPollTimestamp');
        }
    }
}

function fillFormData(data) {
    const form = document.getElementById('pollForm');
    
    for (let [key, value] of Object.entries(data)) {
        const elements = form.querySelectorAll(`[name="${key}"]`);
        
        elements.forEach(element => {
            if (element.type === 'radio') {
                if (element.value === value) {
                    element.checked = true;
                }
            } else if (element.type === 'checkbox') {
                if (Array.isArray(value)) {
                    if (value.includes(element.value)) {
                        element.checked = true;
                    }
                } else if (element.value === value) {
                    element.checked = true;
                }
            } else if (element.tagName === 'SELECT') {
                element.value = value;
            } else if (element.tagName === 'INPUT') {
                element.value = value;
            }
        });
    }
}

// ========================================
// Form Submission
// ========================================

// 🔥 เปลี่ยน URL นี้เป็น URL ของ Google Apps Script ของคุณ
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1RyVe_c1Jt6jXjk6gv9to5ESSapfFaMARIywlefm_TaFW6k4WOIcXYiKyVOlSoUIRnA/exec';

async function submitForm(formData) {
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // สำคัญ! ต้องใช้ no-cors กับ Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        // no-cors จะไม่ได้ response กลับมา แต่ถ้าไม่มี error แสดงว่าสำเร็จ
        return { 
            success: true, 
            id: 'KPI-POLL-' + Date.now(),
            message: 'บันทึกข้อมูลสำเร็จ'
        };
        
    } catch (error) {
        console.error('Error submitting form:', error);
        throw error;
    }
}

function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        Swal.fire({
            icon: 'error',
            title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            text: 'โปรดตรวจสอบและกรอกข้อมูลที่จำเป็นทั้งหมด',
            confirmButtonColor: '#e74c3c'
        });
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    const form = document.getElementById('pollForm');
    const formData = new FormData(form);
    
    // Convert FormData to object
    const data = {};
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    console.log('Form Data:', data);
    
    submitForm(data)
        .then(response => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            if (response.success) {
                // Clear saved data
                localStorage.removeItem('kpiPollData');
                localStorage.removeItem('kpiPollTimestamp');
                
                Swal.fire({
                    icon: 'success',
                    title: 'ส่งแบบสำรวจสำเร็จ!',
                    html: `
                        <p>ขอบคุณที่สละเวลาตอบแบบสำรวจของเรา</p>
                        <p style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #26513C;">
                            <strong>รหัสอ้างอิง:</strong> ${response.id}
                        </p>
                    `,
                    confirmButtonColor: '#26513C',
                    confirmButtonText: 'ปิด'
                }).then(() => {
                    // Reset form
                    form.reset();
                    updateProgress();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
        })
        .catch(error => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถส่งแบบสำรวจได้ กรุณาลองใหม่อีกครั้ง',
                confirmButtonColor: '#e74c3c'
            });
        });
}

function handleSaveDraft() {
    saveFormData();
    
    Swal.fire({
        icon: 'success',
        title: 'บันทึกแบบร่างสำเร็จ',
        text: 'ข้อมูลของท่านถูกบันทึกไว้แล้ว สามารถกลับมากรอกต่อได้ภายใน 7 วัน',
        confirmButtonColor: '#26513C',
        timer: 2000
    });
}

// ========================================
// Initialize
// ========================================

function init() {
    console.log('🚀 Initializing KPI Poll Form');
    
    // Initialize Date Input
    initDateInput();
    
    // Initialize PDPA Modal
    initPDPAModal();
    
    // Load saved data
    loadFormData();
    
    // Auto-save every 30 seconds
    setInterval(() => {
        const form = document.getElementById('pollForm');
        const hasData = Array.from(new FormData(form)).length > 0;
        if (hasData) {
            saveFormData();
            console.log('📝 Auto-saved form data');
        }
    }, 30000);
    
    // Form submission
    const form = document.getElementById('pollForm');
    form.addEventListener('submit', handleSubmit);
    
    // Save draft button
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', handleSaveDraft);
    
    // Update progress on input
    form.addEventListener('input', updateProgress);
    form.addEventListener('change', updateProgress);
    
    // Initial progress update
    updateProgress();
    
    // Prevent accidental page leave
    window.addEventListener('beforeunload', (e) => {
        const hasUnsavedData = localStorage.getItem('kpiPollData');
        if (hasUnsavedData) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
    
    console.log('✅ Form initialized successfully');
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', init);

// ========================================
// Keyboard Shortcuts
// ========================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save draft
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveDraft();
    }
});