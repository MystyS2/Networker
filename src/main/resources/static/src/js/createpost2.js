document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('#login');
    const signupButton = document.querySelector('#signup');
    const profileIcon = document.querySelector('.profile-icon');
    const contentTextarea = document.querySelector('.post-body');

    // 취소 버튼 누를 때 돌아감 기능
    document.querySelector('.cancel-button').onclick = function() {
        window.location.href = '/post/list';
    };

    // 로그인 상태 확인 함수(로그인 여부에 따라 헤더 요소 변경)
    const checkLoginStatus = () => {
        // 현재 페이지의 전체 URL을 가져옴
        const currentUrl = window.location.href;
        // /post의 위치를 찾음
        const postIndex = currentUrl.indexOf('/post');
        // /post 이전의 부분을 추출
        const baseUrl = postIndex !== -1 ? currentUrl.substring(0, postIndex) : currentUrl;

        
        fetch('/board', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    // 로그인 했을때
                    if (window.innerWidth > 1090) {
                        loginButton.style.display = 'none';
                        signupButton.style.display = 'none';
                        profileIcon.style.display = 'inline-block';
                    } else {
                        loginButton.style.display = 'none';
                        signupButton.style.display = 'none';
                        profileIcon.style.display = 'inline-block';
                    }
                } else {
                    // 비 로그인 상태
                    window.alert("로그인이 필요합니다.");
                    window.location.href = baseUrl+'/views/login.html';

                    loginButton.style.display = 'inline-block';
                    signupButton.style.display = 'inline-block';
                    profileIcon.style.display = 'none';
                }
            })
            .catch(error => console.error('Error:', error));
    };

    
    // 윈도우 크기 변경 시 요소 가시성 조정
    window.addEventListener('resize', checkLoginStatus);

    // 페이지 로드 시 로그인 상태 확인
    checkLoginStatus();


    document.querySelector('.create-post').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        const file = formData.get('file');
        const MAX_SIZE = 5 * 1024 * 1024;

        if (file && file.size > MAX_SIZE) {
            alert('파일 크기는 5MB를 초과할 수 없습니다.');
            return;
        }
    });

    // 파일 업로드 이벤트 리스너
    document.getElementById('image-upload').addEventListener('change', function(event) {
        var file = event.target.files[0];
        if (file) {
            var formData = new FormData();
            formData.append('file', file);
            fetch('/post/uploadImage', {
                method: 'POST',
                body: formData
            }).then(response => response.text())
              .then(imageUrl => {
                  // Markdown 에디터에 이미지 URL 삽입
                  var markdownText = simplemde.value();
                  simplemde.value(markdownText + `\n![Image](${imageUrl})\n`);
              })
              .catch(error => console.error('Error:', error));
        }
    });
    
});


document.addEventListener('DOMContentLoaded', () => {
      
    // 헤더 로고 반응형 스타일 적용 및 드롭다운 기능 활성화
    const logo = document.querySelector('.logo');
    const menu = document.querySelector('.menu');

    logo.addEventListener('click', (event) => {
        if (window.innerWidth <= 745) {
        event.preventDefault(); // 745px 이하에서는 기본 동작 막기
        menu.classList.toggle('active');
        }
    });

    // 윈도우 크기 변경 시 메뉴 상태 초기화
    window.addEventListener('resize', () => {
        if ( window.innerWidth > 745 ) {
            menu.classList.remove('active');
        }
    });

});
