function handleForm(event) {
    event.preventDefault();
    const serviceCode = document.getElementById('serviceCode').value;
    const idNumber = document.getElementById('idNumber').value;
    
    if(!serviceCode || !idNumber) {
        alert("يرجى تعبئة جميع الحقول المطلوبة");
        return;
    }

    // Simulate an inquiry request processing
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> جاري الاستعلام...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        alert("لا توجد بيانات مسجلة لهذا الطلب حالياً.");
    }, 1500);
}
