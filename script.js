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

    // ===== استدعاء API الحقيقي =====
    fetch(`api/inquiry.php?serviceCode=${encodeURIComponent(serviceCode)}&idNumber=${encodeURIComponent(idNumber)}`)
        .then(response => response.json())
        .then(result => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            if (result.status === 'success' && result.data) {
                try {
                    const data = result.data;
                    const resultItems = document.querySelectorAll('.result-item');
                    
                    // تحديث القيم بالترتيب الصحيح مع إخفاء الحقول الفارغة
                    const fields = [
                        { index: 0, value: data.name },
                        { index: 1, value: data.companion },
                        { index: 2, value: data.relation },
                        { index: 3, value: data.reportDate },
                        { index: 4, value: data.startDate },
                        { index: 5, value: data.endDate },
                        { index: 6, value: (data.startDate && data.endDate) ? (() => {
                            const start = new Date(data.startDate);
                            const end = new Date(data.endDate);
                            return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                        })() : null },
                        { index: 7, value: data.doctor },
                        { index: 8, value: data.job }
                    ];
                    
                    fields.forEach(field => {
                        const item = resultItems[field.index];
                        const valueSpan = item.querySelector('.result-value');
                        
                        if (field.value) {
                            valueSpan.textContent = field.value;
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                    
                    document.querySelector('.btns-wrap').style.display = 'none';
                    document.getElementById('resultWrapper').style.display = 'block';
                    document.getElementById('newInquiryBtnWrap').style.display = 'block';
                    window.scrollTo({ top: document.getElementById('resultWrapper').offsetTop - 20, behavior: 'smooth' });
                } catch(error) {
                    console.error('Error updating results:', error);
                    alert("حدث خطأ في عرض النتائج");
                }
            } else {
                alert(result.message || "لا توجد بيانات مسجلة لهذا الطلب حالياً. يرجى التأكد من الرموز المدخلة.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            btn.innerHTML = originalText;
            btn.disabled = false;
            alert("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
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
