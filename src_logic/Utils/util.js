/**
 * @function statusConvert
 * @param  {string} param 1일 복용횟수
 * @return {Number} 복용 횟수 숫자 치환 값
 * @description 근데 이거 chartModel에도 쓰임, 이런 함수가 종종 있는데 나중에 공통 모듈로 묶어서 빼거나 해야할 것으로 예상
 */
function convertDoseCount (param) {
  switch (param) {
    case 'hs':
    case 'qd': 
      return 1;
    case 'bid': 
      return 2; 
    case 'tid': 
      return 3; 
    case 'qid': 
      return 4; 
    default:
      return 1;
  }
}

module.exports = {
  convertDoseCount
}