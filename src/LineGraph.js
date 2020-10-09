import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

const options = {
  legends: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: 'index',
    intersect: false,
    callbacks: {
      lable: function (tooltipItem, data) {
        return numeral(tooltipItem.value).formate('+0,0');
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: 'time',
        time: {
          formate: 'MM/DD/YY',
          tooltipFormat: 'll',
        },
      },
    ],
    yAxix: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format('0a');
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType) => {
  const chartData = [];
  let lastDatapoint;

  for (let date in data.cases) {
    if (lastDatapoint) {
      const newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDatapoint,
      };
      chartData.push(newDataPoint);
    }
    lastDatapoint = data[casesType][date];
  }
  return chartData;
};

function Linegraph({ casesType = 'cases' }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          let chartData = buildChartData(data, 'cases');
          setData(chartData);
        });
    };
    fetchData();
  }, [casesType]);

  return (
    <div>
      <h1>I am a Graph</h1>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: 'rgba(204,16,52,0.5)',
                borderColor: '#CC1034',
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default Linegraph;
