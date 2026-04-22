function handleForm(event) {
    event.preventDefault();
    console.log('Form submitted');
    
    const serviceCode = document.getElementById('username').value.trim();
    const idNumber = document.getElementById('idNumber').value.trim();

    if (!serviceCode || !idNumber) {
        alert("يرجى تعبئة جميع الحقول المطلوبة");
        return;
    }

    console.log('Service Code:', serviceCode);
    console.log('ID Number:', idNumber);

    const btn = document.getElementById('inquiry-btn');
    const originalText = btn.innerText;
    btn.innerHTML = 'جاري الاستعلام...';
    btn.disabled = true;

    // الاتصال بـ API للبحث عن الإجازة
    fetch(`api/inquiry.php?serviceCode=${encodeURIComponent(serviceCode)}&idNumber=${encodeURIComponent(idNumber)}`)
        .then(response => response.json())
        .then(data => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            if (data.status === 'success' && data.data) {
                const leave = data.data;
                
                // تحديث النتائج بالبيانات الحقيقية
                document.querySelector('.result-item:nth-child(1) .result-value').textContent = leave.name || '-';
                document.querySelector('.result-item:nth-child(2) .result-value').textContent = leave.reportDate || '-';
                document.querySelector('.result-item:nth-child(3) .result-value').textContent = leave.startDate || '-';
                document.querySelector('.result-item:nth-child(4) .result-value').textContent = leave.endDate || '-';
                
                // حساب المدة بالأيام
                if (leave.startDate && leave.endDate) {
                    const start = new Date(leave.startDate);
                    const end = new Date(leave.endDate);
                    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                    document.querySelector('.result-item:nth-child(5) .result-value').textContent = days;
                } else {
                    document.querySelector('.result-item:nth-child(5) .result-value').textContent = '-';
                }
                
                document.querySelector('.result-item:nth-child(6) .result-value').textContent = leave.doctor || '-';
                document.querySelector('.result-item:nth-child(7) .result-value').textContent = leave.job || '-';
                
                // إظهار النتائج وإخفاء أزرار الاستعلام
                document.querySelector('.btns-wrap').style.display = 'none';
                document.getElementById('resultWrapper').style.display = 'block';
                document.getElementById('newInquiryBtnWrap').style.display = 'block';
                window.scrollTo({ top: document.getElementById('resultWrapper').offsetTop - 20, behavior: 'smooth' });
            } else {
                alert(data.message || "لا توجد بيانات مسجلة لهذا الطلب حالياً. يرجى التأكد من الرموز المدخلة.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            btn.innerHTML = originalText;
            btn.disabled = false;
            alert("حدث خطأ أثناء الاستعلام. يرجى المحاولة مرة أخرى.");
        });
}

function resetForm() {
    document.querySelector('.btns-wrap').style.display = 'flex';
    document.getElementById('resultWrapper').style.display = 'none';
    document.getElementById('newInquiryBtnWrap').style.display = 'none';
    document.getElementById('inquiryForm').reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
    history.back();
}
