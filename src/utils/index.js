import publicStyles from "../styles/variables.scss"

/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}


export const tableStyle =  {
  headerStyle: {
      color: publicStyles.colorText,
      "text-align": "center",
      background: publicStyles.colorBorder,
  },
  cellStyle: {
      "text-align": "center",
      border: "1px dotted" + publicStyles.colorBorder
  },
}

/******** 日期格式开始 ********/
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export const formatDate = (date, format) => {
  if(typeof date == "string" && date.indexOf("T") > -1){
      if(date.indexOf('T') == 10){
          date = date.substr(0,19)
      }
      date = date.replace(new RegExp(/-|\./gm) ,"/").replace(/\T/g, " ")
  }
  date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var weekDay = date.getDay();
  var dayArr = ["日","一","二","三","四","五","六"]

  format = format.replace('yyyy', formatNumber(year))
  format = format.replace('MM', formatNumber(month))
  format = format.replace('dd', formatNumber(day))
  format = format.replace('HH', formatNumber(hour))
  format = format.replace('mm', formatNumber(minute))
  format = format.replace('ss', formatNumber(second))
  
  format = format.replace('weekDay', dayArr[weekDay])

  return format
}
/******** 日期格式结束 ********/



/******** 判空 ********/
export const isEmpty = (str) => {
  if ("" === str || "undefined" === str || null == str || "null" === str) {
      return true;
  } else {
      return false;
  }
}

/******** 日期中文 -> 时间开始结束的数组 ********/
export const getDateArray = (str, format) => {
  let cuts = [
    {text:"一周", day: 7},
    {text:"一个月", day: 30},
    {text:"三个月", day: 90},
    {text:"半年", day: 6 * 30},
    {text:"一年", day: 365},
    {text:"三年", day: 3 * 365},
  ]
  let start = null, end = null;
  for(let i = 0; i < cuts.length ; i++){
    if("最近" + cuts[i].text == str){
      end = new Date();
      start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * cuts[i].day);
      if(isEmpty(format)){
        format = 'yyyy-MM-dd'
      }
      return [formatDate(start, format), formatDate(end, format)]
    }
  }
  return false;   
}
/******** 日期中文 -> condition key ********/
// 1：最近7天，2：最近一个月，3：最近3个月，4：最近半年，5：最近一年，6：最近3年
export const getDateInfo = (val, type) => {
  let cuts = ["最近一周","最近一个月","最近三个月","最近半年","最近一年","最近三年"]
  if(type == 'condition'){
    return Number(cuts.indexOf(val)) + 1;
  }else{
    return cuts[(Number(val) - 1)]
  }
}


/******** 处理返回的图表数据   ********/
export const formatChartData = (data, attrName) => {
	let tableData = [], dateList = [], column = [{prop: "time", label:"日期", sortable: true}];
	let	ecData = {
			xAxis:{},
			series: []
		};
  let attrKeyList = Object.keys(data);
  // if(!isEmpty(allName)){
  //   attrKeyList[0] = allName;
  // }
	let t_data = {time: ""};
	attrKeyList.forEach(attr =>{
		column.push({prop: 'column_'+ attr, label: attr, sortable: true})
    t_data['column_'+ attr] = "null";
    let data_attrName = attr
    // if(!isEmpty(allName)){
    //   data_attrName = 'all';
    // }
		data[data_attrName].forEach((data_item, data_index)=>{
			let dateIndex = dateList.indexOf(data_item.time)
			if(dateIndex == -1){
				dateList.push(data_item.time)
				let tableItem = {}
				tableItem['column_'+ attr] = data_item.count;
				tableData.push({time: data_item.time, ...tableItem})
			}else{
				tableData[dateIndex]['column_'+ attr] = data_item.count
			}
		})
	})
	tableData.sort(function(a,b){
		return new Date(a.time).getTime() - new Date(b.time).getTime();
	});
	// ecData
	dateList.sort(function(a,b){
		return new Date(a).getTime() - new Date(b).getTime();
	});
	ecData.xAxis = [...dateList]
	attrKeyList.forEach(attr=>{
		let seriesItem = { name: attr, data:[]}		
		tableData.forEach((table_row, table_index)=>{
			seriesItem.data.push(isEmpty(table_row['column_'+ attr]) ? 0 : table_row['column_'+ attr])
		})
		ecData.series.push(seriesItem)
	})
	return {
		tableData: tableData,
		column: column,
		ecData: ecData,
	};
}


/******** 多维度数据处理   ********/
export const formatSubDimension = (data) =>{
  let column = {}, tableData = [];
  for(const key in data){
    if(data[key] != null){
      let formatChartData_ = formatChartData(data[key])
      column[key] = {...concatColumnName(formatChartData_.column, key)}
      // tableData = [...tableData, ...concatArrByTime(formatChartData_.tableData, key)]
      tableData = [...tableData, ...concatArrByTime(formatChartData_.tableData, key)]
    }
  }
  return {
    column, 
    tableData: [...concatArrByTime(tableData)]
  }
}
// 处理table keyname / time日期值
const concatArrByTime =(arr, name)=>{
  let newArr = [], obj = {};
  if(isEmpty(name)){
    name = ""
  }
  arr.forEach(arr_data=>{
    for(let key in arr_data){
      if(key != 'time'){
        let new_name = name + key;
        if(isEmpty(obj[arr_data.time])){
          obj[arr_data.time] = {}
        }
        obj[arr_data.time][new_name] = arr_data[key]
      }
    }
  })
  for(let key in obj){
    newArr.push({
      time: key,
      ...obj[key]
    })
  }
	newArr.sort(function(a,b){
		return new Date(a.time).getTime() - new Date(b.time).getTime();
	});
  return newArr;
}

// obj对象名处理
const concatColumnName = (column, name)=>{
  let newObj = [];
  column.forEach(column_ =>{
    if(column_.prop != 'time'){
       column_.prop = name + column_.prop
       newObj.push(column_)
    }
  })
  return newObj;
}
