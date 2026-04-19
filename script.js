function calculateDays(startStr, endStr) {
    if(!startStr || !endStr) return 0;
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    // Add 1 because same day means 1 day
    return diffDays + 1;
}

async function handleForm(event) {
    event.preventDefault();
    const serviceCode = document.getElementById('serviceCodeInput').value.trim();
    const idNumber = document.getElementById('idNumberInput').value.trim();

    if (!serviceCode || !idNumber) {
        alert("يرجى تعبئة جميع الحقول المطلوبة");
        return;
    }

    // Clear any previous error
    document.getElementById('no-results-alert').style.display = 'none';

    const btn = document.getElementById('inquiry-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'جاري الاستعلام...';
    btn.disabled = true;

    try {
        const res = await fetch('api/inquiry.php?action=inquiry', {
            method: 'POST',
            body: JSON.stringify({ serviceCode, idNumber }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        
        btn.innerHTML = originalText;
        btn.disabled = false;

        if(data.status === 'success' && data.data) {
            const found = data.data;
            // Show result
            document.getElementById('inquiry-section').style.display = 'none';
            
            document.getElementById('echo-service').textContent = serviceCode;
            document.getElementById('echo-id').textContent = idNumber;
            
            document.getElementById('res-name').textContent = found.name || '-';
            document.getElementById('res-report-date').textContent = found.reportDate || '-';
            document.getElementById('res-start-date').textContent = found.startDate || '-';
            document.getElementById('res-end-date').textContent = found.endDate || '-';
            
            document.getElementById('res-duration').textContent = calculateDays(found.startDate, found.endDate);
            
            document.getElementById('res-doctor').textContent = found.doctor || '-';
            document.getElementById('res-job').textContent = found.job || '-';

            // Show companion info only if it exists
            const rowCompanion = document.getElementById('row-companion');
            const rowRelation = document.getElementById('row-relation');
            
            if (found.companion && found.companion.trim() !== '') {
                rowCompanion.style.display = 'flex';
                document.getElementById('res-companion').textContent = found.companion;
            } else {
                rowCompanion.style.display = 'none';
            }

            if (found.relation && found.relation.trim() !== '') {
                rowRelation.style.display = 'flex';
                document.getElementById('res-relation').textContent = found.relation;
            } else {
                rowRelation.style.display = 'none';
            }
            
            document.getElementById('result-section').style.display = 'block';
            
        } else {
            document.getElementById('no-results-alert').style.display = 'block';
        }
    } catch(err) {
        btn.innerHTML = originalText;
        btn.disabled = false;
        alert('حدث خطأ أثناء الاتصال بالسيرفر.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const newBtn = document.getElementById('new-inquiry-btn');
    if(newBtn) {
        newBtn.addEventListener('click', () => {
             document.getElementById('serviceCodeInput').value = '';
             document.getElementById('idNumberInput').value = '';
             document.getElementById('result-section').style.display = 'none';
             document.getElementById('inquiry-section').style.display = 'block';
             document.getElementById('no-results-alert').style.display = 'none';
             window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

function goBack(event) {
    if (event) event.preventDefault();
    history.back();
}
