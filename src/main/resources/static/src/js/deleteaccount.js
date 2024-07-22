document.addEventListener('DOMContentLoaded', function () {
    const deleteAccountForm = document.getElementById('delete-account-form');

    deleteAccountForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const password = document.getElementById('password').value;

        const userData = {
            password: password
        };

        fetch('/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
            credentials: 'include'  // 쿠키를 포함하여 요청
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || '회원 탈퇴에 실패했습니다.');
                });
            }
        })
        .then(data => {
            console.log('Response data:', data); // 디버깅을 위한 로그
            if (data.success) {
                alert('회원 탈퇴가 성공적으로 완료되었습니다.');
                window.location.href = 'networker.html';
            } else {
                alert(data.message || '회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message || '회원 탈퇴 중 오류가 발생했습니다.');
        });
    });
});
