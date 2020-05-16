const NUMBERS = '일이삼사오육칠팔구'
const OPERATORS = '십백천만억조'
function replaceNumberDigits(num) {
  return num
    .replace(/일/g, '1')
    .replace(/이/g, 2)
    .replace(/삼/g, 3)
    .replace(/사/g, 4)
    .replace(/오/g, 5)
    .replace(/육/g, 6)
    .replace(/칠/g, 7)
    .replace(/팔/g, 8)
    .replace(/구/g, 9)
}

function getNumberString(num){
  switch(num){
    case 1: return '일';
    case 2: return '이';
    case 3: return '삼';
    case 4: return '사';
    case 5: return '오';
    case 6: return '육';
    case 7: return '칠';
    case 8: return '팔';
    case 9: return '구';
  }
}

function getSuperNumberValue(num) {
  switch (num) {
    case '십':
      return 10
    case '백':
      return 10 ** 2
    case '천':
      return 10 ** 3
    case '만':
      return 10 ** 4
    case '억':
      return 10 ** 8
    case '조':
      return 10 ** 12
    default:
      return +num
  }
}

function findMax(num){
  let max = 0;
  const length = num.length

  for (let i = 0; i < length; i++) {
    let c = num[i]
    c = getSuperNumberValue(c);
    max < c&&(max=c)
  }

  return max;
}

//STEP 1: convert from text to number to calculate the sum
/*
* main idea: 
* read digit of number from left
* if 일이삼사오육칠팔구 push to calculatingStack
* if 십백천만억조 pop number from calculatingStack and do a multiply
* flag is value of 십백천만억조 in string which min(십) < max(조)
* flag is important: when current flag is bigger than next flag, just multiply on a top item of the calculatingStack
* if not pop all the items from calculatingStack, make a sum and then multiply with new flag
*/

function getNumberValue(num) {
  const valueStack = []
  const calculatingStack = []
  let flag = findMax(num);

  const length = num.length

  for (let i = 0; i < length; i++) {
    let c = num[i]
    c = getSuperNumberValue(c);

    // console.log(c, flag);
    if(c < 10 || calculatingStack.length === 0){
      calculatingStack.push(c);

      // console.log(calculatingStack);
      // console.log(valueStack);
      continue;
    }

    if (c >= 10) {
      if (flag > c || flag == 0) {

        if(i > 0 && getSuperNumberValue(num[i-1]) >=10){
          calculatingStack.push(c)
        }else{
          calculatingStack.push(calculatingStack.pop() * c)
        }
      } else {
        let sum = 0
        while (calculatingStack.length > 0) {
          sum += calculatingStack.pop()
        }
        valueStack.push(sum * c)
      }
       
      flag = c;
    }

      // console.log(calculatingStack);
      // console.log(valueStack);
  }

  let remain = 0
  // console.log(calculatingStack)
  while (calculatingStack.length > 0) {
    remain += calculatingStack.pop()
  }
  // console.log('remain', remain);

 
  let value = 0;
  while (valueStack.length > 0) {
    value += valueStack.pop()
  }

  // console.log('value', value);
  return value + remain
}

function add(num1, num2) {
  if (!num1 || num1.length === 0) return 0
  if (!num2 || num2.length === 0) return 0

  num1 = replaceNumberDigits(num1)
  num2 = replaceNumberDigits(num2)

  num1 = getNumberValue(num1)
  num2 = getNumberValue(num2)

  // console.log(num1, num2)
  return num1 + num2;
}

//STEP 2: convert from number to text

function convertNumberToText(num){
  let ret = '';

  const jo = num / 10**12 | 0;
  jo > 0 && (ret += jo === 1 ? '일조' :  convertThousandsNumber(jo) + '조');
  num = num - jo * 10**12;

  const ok = num / 10**8 | 0;
  ok > 0 && (ret += ok === 1 ? '일억' :  convertThousandsNumber(ok) + '억');

  num = num - ok * 10**8;
  const man = num / 10**4 | 0;
  man == 1 && ( ret += (jo || ok)  ? '일만' : '만');
  man > 1 && ( ret += man === 1  ? '일만' :  convertThousandsNumber(man) + '만');

  num = num - man * 10**4;
  num > 0 && (ret += convertThousandsNumber(num))
  console.log(ret)
}

function convertThousandsNumber(num){
  let ret = '';
  const jon = num / 1000 | 0;
  jon > 0 && (jon === 1 ? ret += '천' : ret += (getNumberString(jon) + '천'));

  num -= jon * 1000;
  const beak = num / 100 | 0 
  beak > 0 && (beak === 1 ? ret += '백' : ret += (getNumberString(beak) + '백'));
  num -= beak * 100;

  const sib = num / 10 | 0 
  sib > 0 && (sib === 1 ? ret += '십' : ret += (getNumberString(sib) + '십'));
  num -= sib * 10;

  num > 0 && (ret += getNumberString(num));

  return ret;
}

// convertNumberToText(add('오백삼십조칠천팔백구십만천오백삼십구', '삼조사천이만삼천구'))

const DATA = [
  ['오백삼십조칠천팔백구십만천오백삼십구', '삼조사천이만삼천구'],
  ['육십사억삼천십팔만칠천육백구', '사십삼'],
  ['구백육십조칠천억팔천백삼십이만칠천일', '사십삼조오천이백억육천구백십만일'],
  ['이천구백육십조천오백칠십만삼천구백구십', '삼천사백오십조일억이천만육백사십삼'],
  ['사십오억삼천육십만오백구십', '칠십억천이백삼십오만칠천구십이'],
  ['천백십일', '구천오백구십구'],
  ['오억사천', '백십일'],
  ['만오천사백삼십', '십구만삼천오백'],
  ['일조', '삼'],
  ['일억', '만'],
];

DATA.forEach(data => convertNumberToText(add(data[0], data[1])))

//#4 should be 육천사백십일조삼천오백칠십만사천육백삼십삼 instead of 육천사백십조일억삼천오백칠십만사천육백삼십삼
