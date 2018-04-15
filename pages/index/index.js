const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js')
Page({
  data: {
    nowTemp: '14°',
    nowWeather: '阴天',
    nowWeatherBackground: "",
    hourWeather: [],
    todayTemp: "",
    todayDate: ""
  },
  onPullDownRefresh(){
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })    
  },
  onLoad() {
    this.qqmapsdk = new QQMapWX({
      key: 'HHIBZ-OXHKJ-7LKF4-KWI3P-K4SEJ-2RBQU'
    })
    this.getNow()
  },
  setNow(result) {
    let temp = result.now.temp
    let weather = result.now.weather 
    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      nowWeatherBackground: '/images/' + weather + '-bg.png'
    })

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather]
    })
  },
  setHourWeather(result) {
    let origin_forcast = result.forecast;
    let forecast = []
    let nowHour = new Date().getHours()
    for (let i = 0; i < 24; i += 3) {
      forecast.push({
        time: (i + nowHour) % 24 + "时",
        iconPath: '/images/' + origin_forcast[i / 3].weather + '-icon.png',
        temp: origin_forcast[i / 3].temp + '°'
      })
    }
    forecast[0].time = '现在'
    this.setData({
      hourWeather: forecast
    })
  },
  setToday(result) {
    let date = new Date()
    this.setData({
       todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
       todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
    })
  },
  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: 'shanghai'
      },
      success: res => {
        let result = res.data.result
        this.setNow(result)
        this.setHourWeather(result)  
        this.setToday(result)    
      },     
      complete: () => {
        callback && callback()
      }
    })
  },
  onTapDayWeather() {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  },
  onTapLocation() {
    wx.getLocation({
      success: res => {
        console.log(res.latitude, res.longitude)
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,longitude: res.longitude
          },
          success: res => {
            let city = res.result.address_component.city
            console.log(city)
          }
        })
      },
    })
  }
})
