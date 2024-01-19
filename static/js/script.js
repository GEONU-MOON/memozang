$(document).ready(function () {
  initializeMemoDisplay();
});

function initializeMemoDisplay() {
  loadAndShowMemos();
}

function postMemo() {
  let title = $("#input-title").val();
  let text = $("#input-text").val();

  $.ajax({
    type: "POST",
    url: "/memo",
    data: { title_give: title, text_give: text },
    success: function (response) {
      if (response["result"] == "success") {
        alert("메모가 성공적으로 저장되었습니다.");
        loadAndShowMemos();
        resetInputFields();
      } else {
        alert("서버 오류가 발생했습니다.");
      }
    },
  });
}

function resetInputFields() {
  $("#input-title").val("");
  $("#input-text").val("");
}

function loadAndShowMemos() {
  $("#card-list").empty();
  $.ajax({
    type: "GET",
    url: "/memo",
    data: {},
    success: function (response) {
      response["memos"].forEach(function (memo, index) {
        addMemoToDisplay(index, memo["title"], memo["text"]);
      });
    },
  });
}

function addMemoToDisplay(index, title, text) {
  let memoHTML = createMemoHTML(index, title, text);
  $("#card-list").append(memoHTML);
}

function createMemoHTML(index, title, text) {
  return `
      <div class="col-md-4">
        <div class="card" style="width: 100%;">
          <div class="card-body">
                    <h5 class="card-title">
                        <span id="title_${index}">${title}</span>
                        <input type="text" id="edit_title_${index}" class="form-control" style="display:none;" value="${title}">
                    </h5>
                    <h6 class="card-text">
                        <span id="text_${index}">${text}</span>
                        <textarea id="edit_text_${index}" class="form-control" style="display:none;">${text}</textarea>
                    </h6>
                    <span class="badge badge-info">                       
                        <a href="#" class="card-link" id="edit_button_${index}" onclick="editMemo(${index})">수정</a>
                    </span>
                    <span class="badge badge-danger">
                        <a href="#" class="card-link" id="delete_button_${index}" onclick="deleteMemo(${index})">삭제</a>
                    </span>
                    <span id="save_cancel_buttons_${index}" style="display:none;">
                        <button class="btn btn-success btn-sm" onclick="saveEdit(${index})">저장</button>
                        <button class="btn btn-secondary btn-sm" onclick="cancelEdit(${index})">취소</button>
                    </span>
                    </div>
                </div>
            </div>`;
}

function editMemo(index) {
  // 편집 모드로 전환
  $(`#title_${index}`).hide();
  $(`#text_${index}`).hide();
  $(`#edit_title_${index}`).show();
  $(`#edit_text_${index}`).show();
  $(`#save_cancel_buttons_${index}`).show();

  // 수정 및 삭제 버튼 숨기기
  $(`#edit_button_${index}`).closest(".badge-info").hide(); // badge-info 클래스 숨기기
  $(`#delete_button_${index}`).closest(".badge-danger").hide(); // badge-danger 클래스 숨기기
}

function saveEdit(index) {
  let originalTitle = $(`#title_${index}`).text();
  let editedTitle = $(`#edit_title_${index}`).val();
  let editedText = $(`#edit_text_${index}`).val();

  $.ajax({
    type: "POST",
    url: "/edit_memo",
    data: {
      originalTitle: originalTitle,
      editedTitle: editedTitle,
      editedText: editedText,
    },
    success: function (response) {
      if (response["result"] == "success") {
        alert("수정이 저장되었습니다.");
        loadAndShowMemos(); // 전체 메모 다시 불러오기
      } else {
        alert("서버 오류!");
      }
    },
  });
}

function cancelEdit(index) {
  // 수정 취소
  $(`#title_${index}`).show();
  $(`#text_${index}`).show();
  $(`#edit_title_${index}`).hide();
  $(`#edit_text_${index}`).hide();
  $(`#save_cancel_buttons_${index}`).hide();

  // 수정 및 삭제 버튼 다시 보이기
  $(`#edit_button_${index}`).closest(".badge-info").show(); // badge-info 클래스 다시 보이기
  $(`#delete_button_${index}`).closest(".badge-danger").show(); // badge-danger 클래스 다시 보이기
}

function deleteMemo(index) {
  $.ajax({
    type: "POST",
    url: "/delete_memo",
    data: { index: index },
    success: function (response) {
      if (response["result"] == "success") {
        alert("삭제되었습니다.");
        loadAndShowMemos(); // 전체 메모 다시 불러오기
      } else {
        alert("서버 오류!");
      }
    },
  });
}
