function handleForm(event) {
    event.preventDefault();
    const serviceCode = document.getElementById('serviceCode').value.trim();
    const idNumber = document.getElementById('idNumber').value.trim();

    if (!serviceCode || !idNumber) {
        alert("يرجى تعبئة جميع الحقول المطلوبة");
        return;
    }

    const btn = document.getElementById('submitBtn');
    const originalText = btn.innerText;
    btn.innerHTML = '⏳ جاري الاستعلام...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        alert("لا توجد بيانات مسجلة لهذا الطلب حالياً.");
    }, 1500);
}

function goBack() {
    history.back();
}
