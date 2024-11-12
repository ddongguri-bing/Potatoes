document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('new-page__button');

  if (button) {
    button.addEventListener('click', async function () {
      console.log('새 페이지 버튼이 클릭되었습니다!');
      await createNewPage();
    });
  } else {
    console.log('버튼을 찾을 수 없습니다.');
  }
});

// api입력
async function createNewPage() {
  try {
    const response = await fetch('https://kdt-api.fe.dev-cos.com/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-username': 'potatoes',
      },
      body: JSON.stringify({
        title: '새 페이지',
        content: '',
      }),
    });

    if (!response.ok) {
      alert('새 페이지 생성에 실패했습니다. 다시 시도해주세요.');
      throw new Error('새 페이지 생성에 실패했습니다.');
    }

    const newPageData = await response.json();
    console.log('API 응답 데이터:', newPageData); // 확인용

    // newPageData 구조에 맞춰 데이터 전달
    addPageToDOM(newPageData);
    scrollToNewPage(newPageData.id);
  } catch (error) {
    console.error('페이지 생성 중 오류 발생:', error);
  }
}

function addPageToDOM(pageData) {
  // pageData 객체의 title과 id가 제대로 전달되는지 확인
  console.log('DOM에 추가할 페이지 데이터:', pageData);

  const newPageHTML = `
          <main class="doc__article" id="doc-${pageData.id}">
            <form action="#">
              <div class="doc__article-title">
                <h1 class="none">Title</h1>
                <textarea
                  rows="1"
                  type="text"
                  id="doc-title__input-${pageData.id}"
                  placeholder="새 페이지"
                >${pageData.title || '새 페이지'}</textarea>
              </div>
              <textarea
                id="doc-contents-${pageData.id}"
                placeholder="아름다운 글을 작성해보세요!!"
              >${pageData.content || ''}</textarea>
            </form>
          </main>
        `;

  document.getElementById('doc').insertAdjacentHTML('beforeend', newPageHTML);
  addToSideBar(pageData.id, pageData.title || '새 페이지');
}

function addToSideBar(pageId, pageTitle) {
  // pageTitle이 undefined로 오는지 확인
  console.log('사이드바에 추가할 제목:', pageTitle);

  const newPageItemHTML = `
          <li>
            <div class="flex">
              <img src="./assets/toggle-icon.svg" alt="토글 아이콘" />
              <a href="#doc-${pageId}" class="side-bar__link">${pageTitle}</a>
            </div>
          </li>
        `;
  document
    .querySelector('.side-bar__nav-list')
    .insertAdjacentHTML('beforeend', newPageItemHTML);
}

function scrollToNewPage(pageId) {
  const newPageElement = document.getElementById(`doc-${pageId}`);

  if (newPageElement) {
    newPageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const titleInput = newPageElement.querySelector(
      `#doc-title__input-${pageId}`
    );
    if (titleInput) {
      titleInput.focus();
    }
  } else {
    console.log('새 페이지를 찾을 수 없습니다.');
  }
}
