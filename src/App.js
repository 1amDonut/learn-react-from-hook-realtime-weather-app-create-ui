import { ThemeProvider } from '@emotion/react';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import React, { useState } from 'react';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';
import styled from '@emotion/styled';
import dayjs from 'dayjs';

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const Container = styled.div`
  background-color: ${({theme}) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 30px 15px;
`;
// props 會是{theme: "dark", children: "台北市"}
const Location = styled.div`
  font-size: 28px;
  color: #212121;
  color: ${props => props.theme === 'dark' ? '#dadada' : '#212121'};
  margin-bottom: 20px;
`;


const Description = styled.div`

  font-size: 16px;
 
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: #757575;
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: #828282;

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
`;

const AUTHORIZATION_KEY = 'CWB-34000862-50AF-423E-A896-52BD8C4CDE38';
const LOCATION_NAME = '臺北';
const App = () => {
  // const [ currentTheme, setCurrentTheme] = useState('light');
  // 定義會使用到的資料狀態
  const [ currentWeather, setCurrentWeather] = useState({
    location: '臺北市',
    description: '多雲時晴',
    windSpeed: 1.1,
    temperature: 22.9,
    rainPossibility: 47.3,
    observationTime: '2020-12-12 22:10:00',
  });

  const handleClick = () => {
    fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`)
    .then((Response) => Response.json())  //取得伺服器回傳的資料並以JSON解析
    .then((data) => {
      // 解析後的JSON資料
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (['WDSD','TEMP'].includes(item.elementName)){
            neededElements[item.elementName] = item.elementValue;
          }
          return neededElements;
        }, {}
      );
      // 更新React 資料狀態
      setCurrentWeather({
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        description: '多雲時晴',
        rainPossibility: 60,
      });

    });
  };
  return (
  <ThemeProvider theme={theme.dark}>
    <Container theme={theme.dark}>
      <WeatherCard>
        <Location >{currentWeather.location}</Location>
        <Description>{currentWeather.description}</Description>
        <CurrentWeather>
          <Temperature>
            {Math.round(currentWeather.temperature)} <Celsius>°C</Celsius>
          </Temperature>
          <DayCloudy />
        </CurrentWeather>
        <AirFlow>
          <AirFlowIcon /> 23 m/h
        </AirFlow>
        <Rain>
          <RainIcon /> {Math.round(currentWeather.rainPossibility)}%
        </Rain>
        <Refresh onClick={handleClick}>
          最後觀測時間：{new Intl.DateTimeFormat('zh-TW',{
            hour: 'numeric',
            minute: 'numeric',
          }).format(dayjs(currentWeather.observationTime))} <RefreshIcon />
          {/* 這裡的dayjs 用來代替 new Date 方法 */}
        </Refresh >
      </WeatherCard>
    </Container>
  </ThemeProvider>
    
  );
};

export default App;
