/* 코드를 작성해 보세요. */
import Calendar from 'tui-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

const container = document.getElementById('calendar');
const options = {
  defaultView: 'month', // 'week', 'month'          // 캘린더가 초기에 그려지는 뷰 타입을 주간 뷰로 지정
  week: {                       // 주간 뷰 시간 지정
    hourStart: 7,
    hourEnd: 18
  },
  month:{
    workweek: true,
    visibleWeeksCount: 2
  },
  useCreationPopup: true,
  useDetailPopup: true
};

const calendar = new Calendar(container, options); 
/* ---------------------------------------------- */
/* 이동 및 뷰 타입 변경 버튼 이벤트 핸들러 */
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dayViewBtn = document.getElementById('dayViewBtn');
const weekViewBtn = document.getElementById('weekViewBtn');
const monthViewBtn = document.getElementById('monthViewBtn');
calendar.setDate('2020-11-16');

calendar.on('beforeCreateSchedule', scheduleData => {
  const schedule = {
    calendarId: scheduleData.calendarId,
    id: String(Math.random() * 100000000000000000),
    title: scheduleData.title,
    isAllDay: scheduleData.isAllDay,
    start: scheduleData.start,
    end: scheduleData.end,
    category: scheduleData.isAllDay ? 'allday' : 'time',
    location: scheduleData.location             // 장소 정보도 입력할 수 있네요!
  };
  
  calendar.createSchedules([schedule]);
  
  alert('일정 생성 완료');
});

// API 테스트
fetch('http://54.180.142.199:32270/tags').then(function(response) {
  return response.json();}).then(function(myJson) {
  console.log(JSON.stringify(myJson));});
//

// 위 API 리스트를 아래에 세팅 필요
calendar.setCalendars([
  {
    id: 'Major Subject',
    name: '전공 필수',
    color: '#ffffff',
    bgColor: '#ff5583',
    dragBgColor: '#ff5583',
    borderColor: '#ff5583'
  },
  {
    id: 'Elective Subject',
    name: '전공 선택',
    color: '#ffffff',
    bgColor: '#ffbb3b',
    dragBgColor: '#ffbb3b',
    borderColor: '#ffbb3b'
  },
  {
    id: 'General Subject',
    name: '일반 교양',
    color: '#ffffff',
    bgColor: '#03bd9e',
    dragBgColor: '#03bd9e',
    borderColor: '#03bd9e'
  }
    ]);

// 스케쥴 조회 API로 아래에 값 넣기 
calendar.createSchedules([
  {
    id: '1',
    calendarId: 'Major Subject',
    title: '자료구조론',
    category: 'time',              // 일반 일정
    start: '2020-11-18T10:00:00',
    end: '2020-11-18T11:00:00'
  },
  {
    id: '2',
    calendarId: 'Elective Subject',
    title: '웹 프로그래밍',
    category: 'time',
    start: '2020-11-18T14:00:00',
    end: '2020-11-18T15:00:00'
  },
  {
    id: '3',
    calendarId: 'General Subject',
    title: '영양과 건강',
    category: 'time',
    start: '2020-11-18T13:00:00',
    end: '2020-11-18T14:00:00'
  },
  {
    id: '4',
    calendarId: 'Major Subject',
    title: '소프트웨어 공학',
    category: 'time',
    dueDateClass: '',
    start: '2020-11-17T09:00:00',
    end: '2020-11-17T10:30:00'
  },
  {
    id: '5',
    calendarId: 'Elective Subject',
    title: '데이터베이스',
    category: 'time',
    start: '2020-11-17T10:30:00',
    end: '2020-11-17T12:00:00'
  },
  {
    id: '6',
    calendarId: 'Major Subject',
    title: '알고리즘',
    category: 'time',
    dueDateClass: '',
    start: '2020-11-19T13:00:00',
    end: '2020-11-19T14:30:00'
  },
  {
    id: '8',
    calendarId: 'Travel',
    title: '강촌 OT',
    category: 'allday',              // 종일 일정
    start: '2020-11-20',
    end: '2020-11-21',
    color: '#ffffff',
    bgColor: '#ff4040',              // 일정 색상을 직접 지정할 수 있어요
    dragBgColor: '#ff4040',
    borderColor: '#ff4040'
  }
  ]);

  
  
  

nextBtn.addEventListener('click', () => {
    calendar.next();                          // 현재 뷰 기준으로 다음 뷰로 이동
  });
  
prevBtn.addEventListener('click', () => {
    calendar.prev();                          // 현재 뷰 기준으로 이전 뷰로 이동
});
  
dayViewBtn.addEventListener('click', () => {
    calendar.changeView('day', true);         // 일간 뷰 보기
});
  
weekViewBtn.addEventListener('click', () => {
    calendar.changeView('week', true);        // 주간 뷰 보기
});
  
monthViewBtn.addEventListener('click', () => {
    calendar.changeView('month', true);       // 월간 뷰 보기
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