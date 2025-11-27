// ========================================
// Global Variables
// ========================================

let currentStep = 1;
const totalSteps = 5;

// จำนวนคำถามแต่ละ Step
const questionsPerStep = {
    1: 6, // Q1-Q6
    2: 5, // Q7-Q11
    3: 3, // Q12-Q14
    4: 7, // Questionnaire No, Gender, Age, Education, Occupation, Income, Province
    5: 1  // PDPA
};

// ========================================
// Step Navigation Functions
// ========================================

function updateStepIndicators() {
    const stepIndicators = document.querySelectorAll('.step-indicator');
    
    stepIndicators.forEach((indicator, index) => {
        const stepNumber = index + 1;
        
        // Remove all classes
        indicator.classList.remove('active', 'completed');
        
        // Add appropriate class
        if (stepNumber < currentStep) {
            indicator.classList.add('completed');
        } else if (stepNumber === currentStep) {
            indicator.classList.add('active');
        }
    });
}

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const progressStatus = document.getElementById('progressStatus');
    
    // Calculate percentage
    const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressBar.style.width = percentage + '%';
    
    // Update text
    progressText.textContent = `ส่วนที่ ${currentStep}/${totalSteps}`;
    
    // Count completed questions in current step
    const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (currentStepEl) {
        const completed = countCompletedQuestions(currentStepEl);
        const total = questionsPerStep[currentStep];
        progressStatus.textContent = `ข้อ ${completed}/${total} ครบ`;
    }
}

function countCompletedQuestions(stepElement) {
    let completed = 0;
    
    // Count radio groups
    const radioGroups = {};
    stepElement.querySelectorAll('input[type="radio"]').forEach(radio => {
        const name = radio.getAttribute('name');
        if (!radioGroups[name]) {
            radioGroups[name] = false;
        }
        if (radio.checked) {
            radioGroups[name] = true;
        }
    });
    completed += Object.values(radioGroups).filter(v => v).length;
    
    // Count selects
    stepElement.querySelectorAll('select[required]').forEach(select => {
        if (select.value) completed++;
    });
    
    // Count text inputs
    stepElement.querySelectorAll('input[type="text"][required]').forEach(input => {
        if (input.value.trim()) completed++;
    });
    
    // Count checkboxes (Q11 - ต้องเลือกอย่างน้อย 1)
    const q11Checkboxes = stepElement.querySelectorAll('input[name="q11[]"]');
    if (q11Checkboxes.length > 0) {
        const q11Checked = Array.from(q11Checkboxes).some(cb => cb.checked);
        if (q11Checked) completed++;
    }
    
    // Count PDPA checkbox
    const pdpaCheckbox = stepElement.querySelector('#pdpaConsent');
    if (pdpaCheckbox && pdpaCheckbox.checked) {
        completed++;
    }
    
    return completed;
}

function validateStep(stepNumber) {
    const stepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    if (!stepElement) return false;
    
    let isValid = true;
    let firstInvalidField = null;
    
    // ตรวจสอบ Radio buttons
    const radioGroups = {};
    stepElement.querySelectorAll('input[type="radio"][required]').forEach(radio => {
        const name = radio.getAttribute('name');
        radioGroups[name] = radioGroups[name] || stepElement.querySelector(`input[name="${name}"]:checked`);
    });
    
    for (let [name, checked] of Object.entries(radioGroups)) {
        if (!checked) {
            isValid = false;
            if (!firstInvalidField) {
                const group = stepElement.querySelector(`input[name="${name}"]`).closest('.form-group');
                firstInvalidField = group;
                group.classList.add('shake');
                setTimeout(() => group.classList.remove('shake'), 500);
            }
        }
    }
    
    // ตรวจสอบ Select dropdowns
    stepElement.querySelectorAll('select[required]').forEach(select => {
        if (!select.value) {
            isValid = false;
            if (!firstInvalidField) {
                const group = select.closest('.form-group');
                firstInvalidField = group;
                group.classList.add('shake');
                setTimeout(() => group.classList.remove('shake'), 500);
            }
            select.style.borderColor = '#e74c3c';
        } else {
            select.style.borderColor = '#e0e0e0';
        }
    });
    
    // ตรวจสอบ Text inputs
    stepElement.querySelectorAll('input[type="text"][required]').forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            if (!firstInvalidField) {
                const group = input.closest('.form-group');
                firstInvalidField = group;
                group.classList.add('shake');
                setTimeout(() => group.classList.remove('shake'), 500);
            }
            input.style.borderColor = '#e74c3c';
        } else {
            input.style.borderColor = '#e0e0e0';
        }
    });
    
    // ตรวจสอบ Q11 - ต้องเลือกอย่างน้อย 1 ข้อ
    if (stepNumber === 2) {
        const q11Checkboxes = stepElement.querySelectorAll('input[name="q11[]"]');
        const q11Checked = Array.from(q11Checkboxes).filter(cb => cb.checked);
        
        if (q11Checked.length === 0) {
            isValid = false;
            if (!firstInvalidField) {
                const group = q11Checkboxes[0].closest('.form-group');
                firstInvalidField = group;
                group.classList.add('shake');
                setTimeout(() => group.classList.remove('shake'), 500);
            }
        }
    }
    
    // ตรวจสอบ PDPA
    if (stepNumber === 5) {
        const pdpaCheckbox = document.getElementById('pdpaConsent');
        if (!pdpaCheckbox.checked) {
            isValid = false;
            if (!firstInvalidField) {
                const group = pdpaCheckbox.closest('.form-group');
                firstInvalidField = group;
                group.classList.add('shake');
                setTimeout(() => group.classList.remove('shake'), 500);
            }
        }
    }
    
    // Scroll to first invalid field
    if (!isValid && firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        Swal.fire({
            icon: 'warning',
            title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            text: 'โปรดตรวจสอบและกรอกข้อมูลที่จำเป็นทั้งหมดในหน้านี้',
            confirmButtonColor: '#e74c3c'
        });
    }
    
    return isValid;
}

function nextStep(fromStep) {
    // Validate current step
    if (!validateStep(fromStep)) {
        return;
    }
    
    // บันทึกข้อมูล
    saveFormData();
    
    // Hide current step
    document.querySelector(`.form-step[data-step="${fromStep}"]`).classList.remove('active');
    
    // Show next step
    currentStep = fromStep + 1;
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
    
    // Update UI
    updateStepIndicators();
    updateProgressBar();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(fromStep) {
    // Hide current step
    document.querySelector(`.form-step[data-step="${fromStep}"]`).classList.remove('active');
    
    // Show previous step
    currentStep = fromStep - 1;
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
    
    // Update UI
    updateStepIndicators();
    updateProgressBar();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// Conditional Fields Logic
// ========================================

function setupConditionalFields() {
    // Questionnaire Number - Format to 4 digits
    const questionnaireNo = document.getElementById('questionnaireNo');
    const questionnaireDisplay = document.querySelector('#questionnaireDisplay .display-number');
    
    if (questionnaireNo && questionnaireDisplay) {
        questionnaireNo.addEventListener('input', function() {
            const value = this.value;
            if (value) {
                const num = parseInt(value);
                if (num >= 1 && num <= 9999) {
                    // แปลงเป็น 4 หลัก
                    const formatted = String(num).padStart(4, '0');
                    questionnaireDisplay.textContent = formatted;
                    questionnaireDisplay.style.color = '#26513C';
                    questionnaireDisplay.style.fontWeight = '700';
                } else {
                    questionnaireDisplay.textContent = '----';
                    questionnaireDisplay.style.color = '#e74c3c';
                    questionnaireDisplay.style.fontWeight = '500';
                }
            } else {
                questionnaireDisplay.textContent = '----';
                questionnaireDisplay.style.color = '#7f8c8d';
                questionnaireDisplay.style.fontWeight = '500';
            }
        });
        
        // ป้องกันการกรอกเกิน 4 หลัก
        questionnaireNo.addEventListener('keypress', function(e) {
            if (this.value.length >= 4 && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                e.preventDefault();
            }
        });
    }
    
    // Q5 - Show "Other" field
    document.addEventListener('change', function(e) {
        if (e.target.name === 'q5') {
            const otherGroup = document.getElementById('q5_other_group');
            const otherInput = document.querySelector('[name="q5_other"]');
            if (e.target.value === '9') {
                otherGroup.style.display = 'block';
                otherInput.required = true;
            } else {
                otherGroup.style.display = 'none';
                otherInput.required = false;
                otherInput.value = '';
            }
        }
    });
    
    // Q6 - Show "Other" field
    document.addEventListener('change', function(e) {
        if (e.target.name === 'q6') {
            const otherGroup = document.getElementById('q6_other_group');
            const otherInput = document.querySelector('[name="q6_other"]');
            if (e.target.value === '9') {
                otherGroup.style.display = 'block';
                otherInput.required = true;
            } else {
                otherGroup.style.display = 'none';
                otherInput.required = false;
                otherInput.value = '';
            }
        }
    });
    
    // Q11 - Show "Other" field and limit to 3
    document.addEventListener('change', function(e) {
        if (e.target.name === 'q11[]') {
            const checkboxes = document.querySelectorAll('[name="q11[]"]');
            const noOpinionCheckbox = Array.from(checkboxes).find(cb => cb.value === '99');
            const otherCheckboxes = Array.from(checkboxes).filter(cb => cb.value !== '99');
            
            // ถ้าเลือก "ไม่มีความคิดเห็น"
            if (e.target.value === '99' && e.target.checked) {
                // ยกเลิกการเลือกทั้งหมดยกเว้น "ไม่มีความคิดเห็น"
                otherCheckboxes.forEach(cb => {
                    cb.checked = false;
                    cb.disabled = true;
                });
                
                // ซ่อน "บุคคลอื่น" field
                const otherGroup = document.getElementById('q11_other_group');
                const otherInput = document.querySelector('[name="q11_other"]');
                otherGroup.style.display = 'none';
                otherInput.required = false;
                otherInput.value = '';
            } 
            // ถ้ายกเลิก "ไม่มีความคิดเห็น"
            else if (e.target.value === '99' && !e.target.checked) {
                // เปิดให้เลือกตัวอื่นได้
                otherCheckboxes.forEach(cb => {
                    cb.disabled = false;
                });
            }
            // ถ้าเลือกตัวเลือกอื่นที่ไม่ใช่ "ไม่มีความคิดเห็น"
            else if (e.target.value !== '99' && e.target.checked) {
                // ยกเลิก "ไม่มีความคิดเห็น" และ disable มัน
                if (noOpinionCheckbox) {
                    noOpinionCheckbox.checked = false;
                    noOpinionCheckbox.disabled = true;
                }
            }
            // ถ้ายกเลิกตัวเลือกอื่น และไม่มีอะไรถูกเลือกเลย
            else if (e.target.value !== '99' && !e.target.checked) {
                const anyChecked = otherCheckboxes.some(cb => cb.checked);
                if (!anyChecked && noOpinionCheckbox) {
                    // เปิดให้เลือก "ไม่มีความคิดเห็น" ได้
                    noOpinionCheckbox.disabled = false;
                }
            }
            
            const checked = Array.from(checkboxes).filter(cb => cb.checked);
            
            // Check if "บุคคลอื่น" is selected
            const otherCheckbox = Array.from(checkboxes).find(cb => cb.value === '11');
            const otherGroup = document.getElementById('q11_other_group');
            const otherInput = document.querySelector('[name="q11_other"]');
            
            if (otherCheckbox && otherCheckbox.checked) {
                otherGroup.style.display = 'block';
                otherInput.required = true;
            } else {
                otherGroup.style.display = 'none';
                otherInput.required = false;
                otherInput.value = '';
            }
            
            // Limit to 3 selections (ไม่นับ "ไม่มีความคิดเห็น")
            const regularChecked = otherCheckboxes.filter(cb => cb.checked);
            if (regularChecked.length > 3) {
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
}

// ========================================
// PDPA Modal
// ========================================

function setupPDPAModal() {
    const viewPDPABtn = document.getElementById('viewPDPABtn');
    const pdpaModal = document.getElementById('pdpaModal');
    const closePDPAModal = document.getElementById('closePDPAModal');
    const pdpaModalOverlay = document.getElementById('pdpaModalOverlay');
    const acceptPDPABtn = document.getElementById('acceptPDPABtn');
    const pdpaConsent = document.getElementById('pdpaConsent');
    
    const closeModal = () => {
        pdpaModal.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    viewPDPABtn?.addEventListener('click', () => {
        pdpaModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closePDPAModal?.addEventListener('click', closeModal);
    pdpaModalOverlay?.addEventListener('click', closeModal);
    
    acceptPDPABtn?.addEventListener('click', () => {
        pdpaConsent.checked = true;
        updateProgressBar();
        closeModal();
    });
    
    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pdpaModal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ========================================
// Form Data Management
// ========================================

function saveFormData() {
    const form = document.getElementById('pollForm');
    const data = {};
    
    // บันทึก Radio buttons
    const radios = form.querySelectorAll('input[type="radio"]:checked');
    radios.forEach(radio => {
        data[radio.name] = radio.value;
    });
    
    // บันทึก Checkboxes
    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        if (!data[checkbox.name]) {
            data[checkbox.name] = [];
        }
        if (Array.isArray(data[checkbox.name])) {
            data[checkbox.name].push(checkbox.value);
        }
    });
    
    // บันทึก Selects
    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
        if (select.value) {
            data[select.name] = select.value;
        }
    });
    
    // บันทึก Text inputs
    const inputs = form.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        if (input.value) {
            data[input.name] = input.value;
        }
    });
    
    localStorage.setItem('kpiPollData', JSON.stringify(data));
    localStorage.setItem('kpiPollStep', currentStep.toString());
    localStorage.setItem('kpiPollTimestamp', new Date().toISOString());
}

function loadFormData() {
    const savedData = localStorage.getItem('kpiPollData');
    const savedStep = localStorage.getItem('kpiPollStep');
    const timestamp = localStorage.getItem('kpiPollTimestamp');
    
    if (savedData && timestamp) {
        const data = JSON.parse(savedData);
        const savedDate = new Date(timestamp);
        const now = new Date();
        const daysDiff = (now - savedDate) / (1000 * 60 * 60 * 24);
        
        // โหลดถ้าบันทึกไว้ภายใน 7 วัน
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
                    
                    // กลับไปที่ Step ที่บันทึกไว้
                    if (savedStep) {
                        const stepNum = parseInt(savedStep);
                        if (stepNum > 1 && stepNum <= totalSteps) {
                            document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
                            currentStep = stepNum;
                            document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
                        }
                    }
                    
                    updateStepIndicators();
                    updateProgressBar();
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'โหลดข้อมูลสำเร็จ',
                        text: 'ข้อมูลที่บันทึกไว้ถูกโหลดเรียบร้อยแล้ว',
                        confirmButtonColor: '#26513C',
                        timer: 2000
                    });
                } else {
                    localStorage.removeItem('kpiPollData');
                    localStorage.removeItem('kpiPollStep');
                    localStorage.removeItem('kpiPollTimestamp');
                }
            });
        } else {
            localStorage.removeItem('kpiPollData');
            localStorage.removeItem('kpiPollStep');
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
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                }
            } else if (element.type === 'checkbox') {
                if (Array.isArray(value)) {
                    if (value.includes(element.value)) {
                        element.checked = true;
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            } else if (element.tagName === 'SELECT') {
                element.value = value;
                element.dispatchEvent(new Event('change', { bubbles: true }));
            } else if (element.tagName === 'INPUT') {
                element.value = value;
                element.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }
}

// ========================================
// Form Submission
// ========================================

const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

async function submitForm(formData) {
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
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
    
    // Validate final step
    if (!validateStep(5)) {
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    const form = document.getElementById('pollForm');
    const formData = new FormData(form);
    
    // Convert to object
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
    
    // Add timestamp
    data.timestamp = new Date().toISOString();
    
    console.log('Form Data:', data);
    
    submitForm(data)
        .then(response => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            if (response.success) {
                // Clear saved data
                localStorage.removeItem('kpiPollData');
                localStorage.removeItem('kpiPollStep');
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
                    currentStep = 1;
                    document.querySelectorAll('.form-step').forEach(step => {
                        step.classList.remove('active');
                    });
                    document.querySelector('.form-step[data-step="1"]').classList.add('active');
                    updateStepIndicators();
                    updateProgressBar();
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

// ========================================
// Auto-save & Progress Update
// ========================================

function setupAutoSave() {
    const form = document.getElementById('pollForm');
    
    // Auto-save every 30 seconds
    setInterval(() => {
        const hasData = Array.from(new FormData(form)).length > 0;
        if (hasData) {
            saveFormData();
        }
    }, 30000);
    
    // Update progress on input
    form.addEventListener('input', () => {
        updateProgressBar();
    });
    
    form.addEventListener('change', () => {
        updateProgressBar();
    });
}

// ========================================
// Initialize
// ========================================

function init() {
    console.log('🚀 Initializing KPI Poll Wizard');
    
    // Setup
    setupConditionalFields();
    setupPDPAModal();
    setupAutoSave();
    
    // Load saved data
    loadFormData();
    
    // Initialize UI
    updateStepIndicators();
    updateProgressBar();
    
    // Form submission
    const form = document.getElementById('pollForm');
    form.addEventListener('submit', handleSubmit);
    
    // Prevent accidental page leave
    window.addEventListener('beforeunload', (e) => {
        const hasUnsavedData = localStorage.getItem('kpiPollData');
        if (hasUnsavedData && currentStep < totalSteps) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
    
    console.log('✅ Form initialized successfully');
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', init);