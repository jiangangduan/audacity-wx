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
Page({
  data: {
    nowTemp: '14°',
    nowWeather: '阴天',
    nowWeatherBackground: "",
    hourWeather: []
  },
  onPullDownRefresh(){
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })    
  },
  onLoad() {
    this.getNow()
  },
  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: 'shanghai'
      },
      success: res => {
        let result = res.data.result
        let temp = result.now.temp
        let weather = result.now.weather
        console.log("----------------")
        console.log(res.data)
        console.log("----------------")
        console.log(temp + "+" + weather)

        let origin_forcast = result.forecast;

        this.setData({
          nowTemp: temp + '°',
          nowWeather: weatherMap[weather],
          nowWeatherBackground: '/images/' + weather + '-bg.png'
        })

        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather]
        })

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
          hourWeather:forecast
        })
      },     
      complete: () => {
        callback && callback()
      }
    })

  }
})
