// 챗봇 사용자
export interface IChatUser {
  // 개인 채팅에 대한 정보를 가지는 데이터
  userId: string; // 카카오워크 채팅 유저 고유 ID
  allowNotification: boolean;
}

// 소마 사용자
export interface ISomaUser {
  name: string; // 사용자 이름
  major: string[]; // 멘토: 학력 | 멘티: 학과
  userType: 'mentor' | 'mentee';
}

// 소마 멘토링
export interface IMentoring {
  id: number; // NO. 에 있는 숫자가 아니라 링크의 qustnrSN 프로퍼티이다.
  title: string; // 제목
  state: string; // 상태: (마감 / 대기 / 접수중)
  createdAt: Date; // 등록일
  mentoringDate: Date; // 특강일
  appliedCnt: number; // 접수인원
  writer: string; // 작성자(멘토와 1대1 매칭 안될 우려 염려해서 string형으로 작성)
  applyStartDate: Date; // 접수기간 시작
  applyEndDate: Date; // 접수기간 끝
  mentoringLocation?: string; // 장소
  content?: string; // 본문
}

// 소마 일정
export interface ISchedule {
  title: string; // 제목
  classification: string; // 구분
  startDate: Date; // 일정 시작
  endDate: Date; // 일정 끝
}
