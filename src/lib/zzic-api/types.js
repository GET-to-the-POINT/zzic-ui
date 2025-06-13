/**
 * ZZIC API 공통 타입 정의
 */

/**
 * @typedef {Object} ApiError
 * @property {number} [status] - HTTP 상태 코드
 * @property {string} message - 에러 메시지
 */

/**
 * @typedef {Object} ApiResponse
 * @property {any} data - 응답 데이터
 * @property {ApiError|null} error - 에러 정보
 */

/**
 * @typedef {Object} SignInRequest
 * @property {string} email - 이메일 주소
 * @property {string} password - 비밀번호
 */

/**
 * @typedef {Object} SignUpRequest
 * @property {string} email - 이메일 주소
 * @property {string} password - 비밀번호
 * @property {string} nickname - 닉네임
 */

/**
 * @typedef {Object} MemberMeResponse
 * @property {string} email - 사용자의 이메일 주소
 * @property {string} nickname - 사용자의 닉네임
 */

/**
 * @typedef {Object} AuthResponse
 * @property {{user: MemberMeResponse|null}} data - 사용자 데이터
 * @property {ApiError|null} error - 에러 정보
 */

/**
 * @typedef {Object} TodoDto
 * @property {number} id - 할 일 ID
 * @property {string} title - 할 일 제목
 * @property {string} [description] - 할 일 설명
 * @property {boolean} done - 완료 여부
 * @property {string} [createdAt] - 생성 시간
 * @property {string} [updatedAt] - 수정 시간
 */

/**
 * @typedef {Object} PageTodoDto
 * @property {TodoDto[]} content - 할 일 목록
 * @property {number} number - 현재 페이지 번호 (0부터 시작)
 * @property {number} size - 페이지 크기
 * @property {number} totalElements - 총 요소 개수
 * @property {number} totalPages - 총 페이지 개수
 * @property {boolean} first - 첫 번째 페이지 여부
 * @property {boolean} last - 마지막 페이지 여부
 * @property {boolean} empty - 비어있는 페이지 여부
 */

/**
 * @typedef {Object} CreateTodoRequest
 * @property {string} title - 할 일 제목
 * @property {string} [description] - 할 일 설명
 */

/**
 * @typedef {Object} UpdateTodoRequest
 * @property {string} [title] - 할 일 제목
 * @property {string} [description] - 할 일 설명
 * @property {boolean} [done] - 완료 여부
 */

/**
 * @typedef {Object} ChallengeDto
 * @property {number} id - 챌린지 ID
 * @property {string} title - 챌린지 제목
 * @property {string} description - 챌린지 설명
 * @property {string} startDate - 시작일 (YYYY-MM-DD)
 * @property {string} endDate - 종료일 (YYYY-MM-DD)
 * @property {'DAILY'|'WEEKLY'|'MONTHLY'} periodType - 기간 타입
 * @property {boolean} [participationStatus] - 참여 상태 (인증된 사용자의 경우)
 */

/**
 * @typedef {Object} ChallengeDetailDto
 * @property {number} id - 챌린지 ID
 * @property {string} title - 챌린지 제목
 * @property {string} description - 챌린지 설명
 * @property {string} startDate - 시작일 (YYYY-MM-DD)
 * @property {string} endDate - 종료일 (YYYY-MM-DD)
 * @property {'DAILY'|'WEEKLY'|'MONTHLY'} periodType - 기간 타입
 * @property {ParticipantDto[]} participants - 참여자 목록
 */

/**
 * @typedef {Object} ParticipantDto
 * @property {string} id - 참여자 ID (UUID)
 * @property {string} email - 참여자 이메일
 * @property {string} nickname - 참여자 닉네임
 * @property {string} joinedAt - 참여일 (ISO 8601)
 */

/**
 * @typedef {Object} ChallengeTodoResponse
 * @property {number} id - 챌린지 할 일 ID
 * @property {string} challengeTitle - 챌린지 제목
 * @property {string} challengeDescription - 챌린지 설명
 * @property {string} startDate - 시작일 (YYYY-MM-DD)
 * @property {string} endDate - 종료일 (YYYY-MM-DD)
 * @property {boolean} done - 완료 여부
 * @property {boolean} isPersisted - 영속성 여부
 * @property {'DAILY'|'WEEKLY'|'MONTHLY'} periodType - 기간 타입
 */

/**
 * @typedef {Object} PageResponse
 * @property {number} totalElements - 전체 요소 수
 * @property {number} totalPages - 전체 페이지 수
 * @property {boolean} first - 첫 페이지 여부
 * @property {boolean} last - 마지막 페이지 여부
 * @property {number} size - 페이지 크기
 * @property {number} number - 현재 페이지 번호
 * @property {number} numberOfElements - 현재 페이지 요소 수
 * @property {boolean} empty - 빈 페이지 여부
 */

/**
 * @typedef {PageResponse & {content: ChallengeDto[]}} PageChallengeDto
 */

/**
 * @typedef {PageResponse & {content: ChallengeDetailDto[]}} PageChallengeDetailDto
 */

/**
 * @typedef {PageResponse & {content: ChallengeTodoResponse[]}} PageChallengeTodoResponse
 */

/**
 * @typedef {Object} CreateChallengeCommand
 * @property {string} title - 챌린지 제목
 * @property {string} description - 챌린지 설명
 * @property {'DAILY'|'WEEKLY'|'MONTHLY'} periodType - 기간 타입
 */

/**
 * @typedef {Object} UpdateChallengeCommand
 * @property {string} [title] - 챌린지 제목
 * @property {string} [description] - 챌린지 설명
 * @property {'DAILY'|'WEEKLY'|'MONTHLY'} [periodType] - 기간 타입
 */

/**
 * @typedef {Object} CreateChallengeResponse
 * @property {number} challengeId - 생성된 챌린지 ID
 * @property {string} message - 응답 메시지
 */

// 이 파일은 타입 정의만을 위한 파일이므로 실제 export는 없습니다.
// JSDoc 타입 정의는 다른 파일에서 import('./types.js').TypeName 형태로 참조할 수 있습니다.
export {};
