function handleForm(event) {
    event.preventDefault();
    const serviceCode = document.getElementById('username').value.trim();
    const idNumber = document.getElementById('idNumber').value.trim();

    if (!serviceCode || !idNumber) {
        alert("يرجى تعبئة جميع الحقول المطلوبة");
        return;
    }

    const btn = document.getElementById('inquiry-btn');
    const originalText = btn.innerText;
    btn.innerHTML = 'جاري الاستعلام...';
    btn.disabled = true;

    // محاكاة عملية الاستعلام
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        // التحقق من المعلومات التجريبية
        if (serviceCode === "PSL26024183076" && idNumber === "1074429703") {
            // إظهار النتائج وإخفاء أزرار الاستعلام
            document.querySelector('.btns-wrap').style.display = 'none';
            document.getElementById('resultWrapper').style.display = 'block';
            document.getElementById('newInquiryBtnWrap').style.display = 'block';
            window.scrollTo({ top: document.getElementById('resultWrapper').offsetTop - 20, behavior: 'smooth' });
        } else {
            alert("لا توجد بيانات مسجلة لهذا الطلب حالياً. يرجى التأكد من الرموز المدخلة.");
        }
    }, 1200);
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
