import Calendar from 'tui-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

const container = document.getElementById('calendar');
const options = {
  defaultView: 'month', // 'week', 'month'
  // 캘린더가 초기에 그려지는 뷰 타입을 주간 뷰로 지정
  week: {                       // 주간 뷰 시간 지정
    hourStart: 7,
    hourEnd: 18
  },
  month:{
    workweek: false,
    visibleWeeksCount: 5,
    visibleEventCount: 6,
  },
  useCreationPopup: true,
  useDetailPopup: true,
//          template: {
//            popupIsAllday: function () {
//              return 'All day?';
//            },
//            popupStateFree: function () {
//              return '🏝️ Free';
//            },
//            popupStateBusy: function () {
//              return '🔥 Busy';
//            },
//            titlePlaceholder: function () {
//              return 'Enter title';
//            },
//            locationPlaceholder: function () {
//              return 'Enter location';
//            },
//            startDatePlaceholder: function () {
//              return 'Start date';
//            },
//            endDatePlaceholder: function () {
//              return 'End date';
//            },
//            popupSave: function () {
//              return 'Add Event';
//            },
//            popupUpdate: function () {
//              return 'Update Event';
//            },
//            popupEdit: function () {
//              return 'Modify';
//            },
//            popupDelete: function () {
//              return 'Remove';
//            },
//            popupDetailTitle: function (data) {
//              return 'Detail of ' + data.title;
//            },
//          },
  timezone: {
      zones: [
        {
          timezoneName: 'Asia/Seoul',
          displayLabel: 'UTC+9:00',
          tooltip: 'Seoul'
        }
      ]
  },
  useFormPopup: true
};
// const URL = 'http://54.180.142.199:'
const URL = 'http://localhost:'
// const PORT_USER = '30197'
const PORT_USER = '8082'
// const PORT_CALENDAR = '32270'
const PORT_CALENDAR = '8080'
const USER_ID = 6183298
const USER_PW = "tkdgns09@gks"

const calendar = new Calendar(container, options);

/* ---------------------------------------------- */
/* 이동 및 뷰 타입 변경 버튼 이벤트 핸들러 */
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dayViewBtn = document.getElementById('dayViewBtn');
const weekViewBtn = document.getElementById('weekViewBtn');
const monthViewBtn = document.getElementById('monthViewBtn');
// 날짜 설정
let today = new Date();
// 연도
let now_year = today.getFullYear();
// 월
let now_month = today.getMonth() + 1;
// 해당 월의 첫 번째 날
let firstDay = new Date(today.getFullYear(), now_month-1, 1);
calendar.setDate(firstDay);

// [UI] 월 출력
document.getElementById('month').innerHTML = now_month + "월";

// [UI] 사용자 정보 변수
const userId = document.getElementById('userId');
const userDept = document.getElementById('userDept');
const userName = document.getElementById('userName');

// [POST] 사용자 조회
const user_request = async () => {
  const response = await fetch(URL+PORT_USER+'/login', {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    // 로그인 부분 구현 필요
    body: JSON.stringify({
        id: USER_ID,
        pswd: USER_PW
      }),
  });
  const user = await response.json();
  return user
};
user_request().then((user) => {
    userId.innerHTML = String(user[0].userId);
    userDept.innerHTML = user[0].dept;
    userName.innerHTML = user[0].name;
});

// 태그 조회
const get_tags = async () => {
  const response = await fetch(URL + PORT_CALENDAR+'/tags');
  const tags = await response.json();
  return tags
}
get_tags().then((tags) => {
    let newTags = tags.map(items => {
        let newTags = {
            id : String(items.tagId),
            name : items.tagName,
            bgColor : items.tagColor
        };
//        newTags['id'] = String(items.tagId);
//        newTags['name'] = items.tagName;
//        newTags['bgColor'] = items.tagColor;
        return newTags;
    })
    calendar.setCalendars(newTags);
}
);

// 월별 일정 조회
const schedule_request = async () => {
  const response = await fetch(URL + PORT_CALENDAR+'/calendar/ICT운영부/' + now_year + '/' + now_month);
  const schedules = await response.json();
  return schedules
}
schedule_request().then((schedules) => {
    let newSchedules = schedules.map(items => {
        console.log("items", items);
        let newSchedules = {};

        newSchedules['id'] = String(items.id);
        newSchedules['calendarId'] = items.tagName;
        newSchedules['title'] = items.title;
        newSchedules['body'] = items.memo;
        newSchedules['category'] = 'time';
        newSchedules['start'] = items.startDate;
        newSchedules['end'] = items.endDate;
        newSchedules['tagColor'] = items.tagColor;

        newSchedules['color'] = '#ffffff';
        newSchedules['bgColor'] = items.tagColor;
        newSchedules['dragBgColor'] = '#2537DF';
        newSchedules['borderColor'] = items.tagColor;
        return newSchedules;
    })
    calendar.createSchedules(newSchedules);
}
);


// 일정 등록
calendar.on('beforeCreateSchedule', scheduleData => {
  console.log("일정 등록 save 버튼 클릭시")
  console.log("scheduleData", scheduleData)
  // 화면에서 생성
  const schedule = {
    tag: scheduleData.calendarId,
    title: scheduleData.title,
    isAllDay: scheduleData.isAllDay,
    startDate: scheduleData.start,
    endDate: scheduleData.end,
    // category: scheduleData.isAllDay ? 'allday' : 'time',
    insertUser: USER_ID
    // location: scheduleData.location             // 장소 정보도 입력할 수 있네요!
  };
  console.log("생성", schedule);
  // 일정 등록
  const schedule_post_request = async (scheduleData) => {
      const response = await fetch(URL+PORT_CALENDAR+'/schedule', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
              title : schedule.title,
              startDate: schedule.startDate._date.toISOString(),
              endDate: schedule.endDate._date.toISOString(),
              memo : "memo",
              tag : schedule.tag,
              insertUser : schedule.insertUser
          }),
      });
      const schedule_response = await response.json();
      return schedule_response
    };
    schedule_post_request().then((schedule_response) => {
        // [UI] 일정 등록 창
        calendar.createSchedules([schedule_response]);
        alert('일정 생성 완료');

    });
});

// 일정 수정
calendar.on('beforeUpdateSchedule', event => {
  const {schedule, changes} = event;
  console.log("수정하기");
  console.log("s", schedule);
  console.log("c", changes);

//  const schedule_list = {
//      tag: schedule.calendarId,
//      // id: String(Math.random() * 100000000000000000),
//      title: schedule.title,
//      // isAllDay: scheduleData.isAllDay,
//      startDate: schedule.start,
//      endDate: schedule.end,
//      // tag: scheduleData.isAllDay ? 'allday' : 'time',
//      insertUser: USER_ID
//      // location: scheduleData.location             // 장소 정보도 입력할 수 있네요!
//    };

  const schedule_update_request = async () => {
        const response = await fetch(URL+PORT_CALENDAR+'/schedule/'+schedule.id, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
                title : schedule.title,
                startDate: schedule.start._date.toISOString(),
                endDate: schedule.end._date.toISOString(),
                memo : "memo",
                tag : parseInt(schedule.calendarId),
                insertUser : USER_ID
            }),
        });
        const schedule_response = await response.json();
        return schedule_response
      };
      schedule_update_request().then((schedule_response) => {
          calendar.updateSchedule(schedule.id, schedule.calendarId, changes);
          alert('일정 수정 완료');
      });
});







nextBtn.addEventListener('click', () => {
  calendar.next(); // 현재 뷰 기준으로 다음 뷰로 이동
});

prevBtn.addEventListener('click', () => {
  calendar.prev(); // 현재 뷰 기준으로 이전 뷰로 이동
});

dayViewBtn.addEventListener('click', () => {
  calendar.changeView('day', true); // 일간 뷰 보기
  console.log('이전버튼');
});

weekViewBtn.addEventListener('click', () => {
  calendar.changeView('week', true); // 주간 뷰 보기
});

monthViewBtn.addEventListener('click', () => {
  calendar.changeView('month', true); // 월간 뷰 보기
});

prevBtn.addEventListener('click', () => {


});

nextBtn.addEventListener('click', () => {

});

dayViewBtn.addEventListener('click', () => {

});

weekViewBtn.addEventListener('click', () => {

});

monthViewBtn.addEventListener('click', () => {

});
month.set();